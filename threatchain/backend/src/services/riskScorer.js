import User from '../models/User.js';
import Event from '../models/Event.js';
import Alert from '../models/Alert.js';

/**
 * RISK SCORE CALCULATOR
 * Calculates and updates user risk scores based on behavior
 */

// Risk score increments for different actions
const RISK_INCREMENTS = {
  FAILED_LOGIN: 5,
  EXCESSIVE_OTP: 10,
  EXCESSIVE_RESET: 8,
  SUSPICIOUS_PATTERN: 15
};

// Risk score thresholds for blocking
const RISK_THRESHOLDS = {
  WARNING: 20,           // Force re-login
  TEMP_BLOCK_5MIN: 40,   // Block for 5 minutes
  TEMP_BLOCK_30MIN: 60,  // Block for 30 minutes
  PERMANENT_BLOCK: 80    // Permanent block
};

/**
 * Update user risk score with AI INTEGRATION
 */
/**
 * Update user risk score with NATIVE HEURISTICS
 */
export const updateUserRiskScore = async (userId, increment, reason) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    // ALGORITHM: Heuristic Anomaly Detection (Implemented natively for performance)
    let heuristicMultiplier = 1.0;
    
    // 1. Brute Force Heuristic
    if ((user.failed_login_attempts || 0) > 3) {
      heuristicMultiplier = 1.5; // Escalating penalty for persistent failures
      console.log('🔥 Anomaly Detected: Potential Brute Force Pattern');
    }
    
    // 2. High Frequency Heuristic (Simulated check)
    // In a real app, we would check request timestamps here
    
    // Apply Heuristic Multiplier
    const finalIncrement = Math.ceil(increment * heuristicMultiplier);
    
    // Increase risk score
    user.risk_score = Math.min(100, user.risk_score + finalIncrement);
    
    console.log(`🎯 User ${user.username} risk score: ${user.risk_score} (+${finalIncrement} - ${reason})`);
    
    // Define Block Status based on Score
    if (user.risk_score >= RISK_THRESHOLDS.PERMANENT_BLOCK) {
      user.block_status = 'PERMANENTLY_BLOCKED';
      user.block_until = null; // Permanent
      console.log(`🚨 User ${user.username} PERMANENTLY BLOCKED`);
      
    } else if (user.risk_score >= RISK_THRESHOLDS.TEMP_BLOCK_30MIN) {
      user.block_status = 'TEMP_BLOCKED';
      user.block_until = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      console.log(`⏰ User ${user.username} blocked for 30 minutes`);
      
    } else if (user.risk_score >= RISK_THRESHOLDS.TEMP_BLOCK_5MIN) {
      user.block_status = 'TEMP_BLOCKED';
      user.block_until = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      console.log(`⏰ User ${user.username} blocked for 5 minutes`);
      
    } else if (user.risk_score >= RISK_THRESHOLDS.WARNING) {
      user.block_status = 'WARNING';
      console.log(`⚠️ User ${user.username} in WARNING state - must re-login`);
    }
    
    await user.save();
    return user;
    
  } catch (error) {
    console.error('Error updating risk score:', error);
    return null;
  }
};

/**
 * Check if user is currently blocked
 */
export const isUserBlocked = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return { blocked: false };
    
    // Permanent block
    if (user.block_status === 'PERMANENTLY_BLOCKED') {
      return {
        blocked: true,
        reason: 'Your account has been permanently blocked due to suspicious activity',
        permanent: true
      };
    }
    
    // Temporary block
    if (user.block_status === 'TEMP_BLOCKED' && user.block_until) {
      if (new Date() < user.block_until) {
        const minutesLeft = Math.ceil((user.block_until - new Date()) / 60000);
        return {
          blocked: true,
          reason: `Your account is temporarily blocked. Try again in ${minutesLeft} minutes`,
          until: user.block_until
        };
      } else {
        // Block expired, reset status
        user.block_status = 'ACTIVE';
        user.block_until = null;
        user.risk_score = Math.max(0, user.risk_score - 20); // Reduce risk score
        await user.save();
        return { blocked: false };
      }
    }
    
    return { blocked: false };
    
  } catch (error) {
    console.error('Error checking block status:', error);
    return { blocked: false };
  }
};

/**
 * Reduce risk score over time (good behavior)
 */
export const decayRiskScore = async (userId, amount = 5) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;
    
    user.risk_score = Math.max(0, user.risk_score - amount);
    
    if (user.risk_score < RISK_THRESHOLDS.WARNING && user.block_status === 'WARNING') {
      user.block_status = 'ACTIVE';
      console.log(`✅ User ${user.username} back to ACTIVE status`);
    }
    
    await user.save();
  } catch (error) {
    console.error('Error decaying risk score:', error);
  }
};

/**
 * Detect brute force on specific user
 */
export const detectUserBruteForce = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;
  
  // Check failed login attempts in last minute
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  
  if (user.last_failed_login && user.last_failed_login > oneMinuteAgo) {
    if (user.failed_login_attempts >= 5) {
      // Brute force detected!
      await updateUserRiskScore(userId, RISK_INCREMENTS.FAILED_LOGIN * 3, 'Brute force detected');
      
      // Create alert
      const alert = new Alert({
        threat_type: 'BRUTE_FORCE',
        severity: 'HIGH',
        ip_address: user.last_ip || 'Unknown',
        username: user.username,
        reason: `${user.failed_login_attempts} failed login attempts in 60 seconds`,
        event_count: user.failed_login_attempts
      });
      
      await alert.save();
      console.log(`🚨 Brute force alert created for user ${user.username}`);
    }
  }
};

/**
 * Detect OTP flooding on specific user
 */
export const detectUserOTPFlooding = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;
  
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  
  if (user.last_otp_request && user.last_otp_request > oneMinuteAgo) {
    if (user.otp_requests_count >= 5) {
      // OTP flooding detected!
      await updateUserRiskScore(userId, RISK_INCREMENTS.EXCESSIVE_OTP, 'OTP flooding detected');
      
      const alert = new Alert({
        threat_type: 'OTP_FLOODING',
        severity: 'MEDIUM',
        ip_address: user.last_ip || 'Unknown',
        username: user.username,
        reason: `${user.otp_requests_count} OTP requests in 60 seconds`,
        event_count: user.otp_requests_count
      });
      
      await alert.save();
      console.log(`🚨 OTP flooding alert created for user ${user.username}`);
    }
  }
};

/**
 * Detect password reset abuse on specific user
 */
export const detectUserResetAbuse = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;
  
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  
  if (user.last_reset_request && user.last_reset_request > oneMinuteAgo) {
    if (user.reset_requests_count >= 3) {
      // Reset abuse detected!
      await updateUserRiskScore(userId, RISK_INCREMENTS.EXCESSIVE_RESET, 'Reset abuse detected');
      
      const alert = new Alert({
        threat_type: 'RESET_ABUSE',
        severity: 'MEDIUM',
        ip_address: user.last_ip || 'Unknown',
        username: user.username,
        reason: `${user.reset_requests_count} password reset requests in 60 seconds`,
        event_count: user.reset_requests_count
      });
      
      await alert.save();
      console.log(`🚨 Reset abuse alert created for user ${user.username}`);
    }
  }
};
