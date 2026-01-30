import express from 'express';
import User from '../models/User.js';
import Event from '../models/Event.js';
import {
  isUserBlocked,
  updateUserRiskScore,
  detectUserBruteForce,
  detectUserOTPFlooding,
  detectUserResetAbuse
} from '../services/riskScorer.js';

const router = express.Router();

/**
 * USER AUTHENTICATION ROUTES
 * Real login, OTP, reset password functionality
 */

// ============================================
// REGISTER USER
// ============================================
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }
    
    // Create new user (in production, hash password!)
    const user = new User({
      username,
      email,
      password, // WARNING: In production, use bcrypt to hash!
      risk_score: 0,
      block_status: 'ACTIVE'
    });
    
    await user.save();
    
    console.log(`✅ New user registered: ${username}`);
    
    res.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        risk_score: user.risk_score,
        block_status: user.block_status
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// LOGIN USER
// ============================================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'Unknown';
    
    // Find user
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Check if blocked
    const blockStatus = await isUserBlocked(user._id);
    if (blockStatus.blocked) {
      return res.status(403).json({
        success: false,
        error: blockStatus.reason,
        blocked: true,
        block_until: blockStatus.until,
        permanent: blockStatus.permanent
      });
    }
    
    // Check password
    if (user.password !== password) {
      // FAILED LOGIN - Track it!
      user.failed_login_attempts = (user.failed_login_attempts || 0) + 1;
      user.last_failed_login = new Date();
      user.last_ip = ipAddress;
      await user.save();
      
      // Create event
      const event = new Event({
        type: 'login_attempt',
        ip_address: ipAddress,
        username: user.username,
        success: false,
        location: 'User Login Page',
        user_behavior_score: user.risk_score
      });
      await event.save();
      
      // Detect brute force
      await detectUserBruteForce(user._id);
      
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        risk_score: user.risk_score,
        failed_attempts: user.failed_login_attempts
      });
    }
    
    // SUCCESSFUL LOGIN
    user.failed_login_attempts = 0;
    user.last_login = new Date();
    user.last_ip = ipAddress;
    await user.save();
    
    // Create success event
    const event = new Event({
      type: 'login_attempt',
      ip_address: ipAddress,
      username: user.username,
      success: true,
      location: 'User Login Page',
      user_behavior_score: user.risk_score
    });
    await event.save();
    
    console.log(`✅ User ${username} logged in successfully`);
    
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        risk_score: user.risk_score,
        block_status: user.block_status
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// REQUEST OTP
// ============================================
router.post('/request-otp', async (req, res) => {
  try {
    const { username } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'Unknown';
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if blocked
    const blockStatus = await isUserBlocked(user._id);
    if (blockStatus.blocked) {
      return res.status(403).json({
        success: false,
        error: blockStatus.reason,
        blocked: true
      });
    }
    
    // Track OTP request
    const now = new Date();
    const oneMinuteAgo = new Date(now - 60 * 1000);
    
    if (user.last_otp_request && user.last_otp_request > oneMinuteAgo) {
      user.otp_requests_count = (user.otp_requests_count || 0) + 1;
    } else {
      user.otp_requests_count = 1;
    }
    
    user.last_otp_request = now;
    user.last_ip = ipAddress;
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.current_otp = otp;
    user.otp_expires = new Date(now.getTime() + 5 * 60000); // 5 minutes
    
    await user.save();
    
    // Create event
    const event = new Event({
      type: 'otp_request',
      ip_address: ipAddress,
      username: user.username,
      success: true,
      location: 'User OTP Page',
      otp_requests: user.otp_requests_count,
      user_behavior_score: user.risk_score
    });
    await event.save();
    
    // Detect OTP flooding
    await detectUserOTPFlooding(user._id);
    
    console.log(`📱 OTP requested for ${username}: ${otp}`);
    
    res.json({
      success: true,
      message: 'OTP sent successfully',
      otp: otp, // In production, don't send OTP in response!
      risk_score: user.risk_score,
      otp_count: user.otp_requests_count
    });
    
  } catch (error) {
    console.error('OTP request error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// RESET PASSWORD
// ============================================
router.post('/reset-password', async (req, res) => {
  try {
    const { username, email } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'Unknown';
    
    const user = await User.findOne({ username, email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if blocked
    const blockStatus = await isUserBlocked(user._id);
    if (blockStatus.blocked) {
      return res.status(403).json({
        success: false,
        error: blockStatus.reason,
        blocked: true
      });
    }
    
    // Track reset request
    const now = new Date();
    const oneMinuteAgo = new Date(now - 60 * 1000);
    
    if (user.last_reset_request && user.last_reset_request > oneMinuteAgo) {
      user.reset_requests_count = (user.reset_requests_count || 0) + 1;
    } else {
      user.reset_requests_count = 1;
    }
    
    user.last_reset_request = now;
    user.last_ip = ipAddress;
    await user.save();
    
    // Create event
    const event = new Event({
      type: 'reset_request',
      ip_address: ipAddress,
      username: user.username,
      success: true,
      location: 'User Reset Page',
      reset_requests: user.reset_requests_count,
      user_behavior_score: user.risk_score
    });
    await event.save();
    
    // Detect reset abuse
    await detectUserResetAbuse(user._id);
    
    console.log(`🔄 Password reset requested for ${username}`);
    
    res.json({
      success: true,
      message: 'Password reset link sent to email',
      risk_score: user.risk_score,
      reset_count: user.reset_requests_count
    });
    
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// GET USER INFO
// ============================================
router.get('/user/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        risk_score: user.risk_score,
        block_status: user.block_status,
        block_until: user.block_until,
        failed_login_attempts: user.failed_login_attempts,
        otp_requests_count: user.otp_requests_count,
        reset_requests_count: user.reset_requests_count,
        last_login: user.last_login
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
