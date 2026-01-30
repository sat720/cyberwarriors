import Event from '../models/Event.js';
import Alert from '../models/Alert.js';

/**
 * THREAT DETECTION ENGINE
 * This is the BRAIN of our system!
 * It analyzes events and detects attacks based on rules
 */

/**
 * Detect BRUTE FORCE attack
 * Rule: More than 10 failed logins from same IP in 60 seconds
 */
export const detectBruteForce = async (events) => {
  console.log('🔍 Checking for BRUTE FORCE attack...');
  
  // Get all IPs from the events
  const ipGroups = {};
  
  for (const event of events) {
    if (event.type === 'login_attempt' && !event.success) {
      if (!ipGroups[event.ip_address]) {
        ipGroups[event.ip_address] = [];
      }
      ipGroups[event.ip_address].push(event);
    }
  }
  
  const alerts = [];
  
  // Check each IP
  for (const [ip, ipEvents] of Object.entries(ipGroups)) {
    // Get events from last 60 seconds
    const sixtySecondsAgo = new Date(Date.now() - 60 * 1000);
    const recentEvents = ipEvents.filter(e => new Date(e.time_of_login) >= sixtySecondsAgo);
    
    // If more than 10 failed logins, create alert!
    if (recentEvents.length > 10) {
      const alert = new Alert({
        threat_type: 'BRUTE_FORCE',
        severity: 'HIGH',
        ip_address: ip,
        username: recentEvents[0].username,
        reason: `${recentEvents.length} failed login attempts in 60 seconds (threshold: 10)`,
        event_count: recentEvents.length,
        related_events: recentEvents.map(e => e._id),
        metadata: {
          time_window: '60 seconds',
          threshold_exceeded: recentEvents.length
        }
      });
      
      alerts.push(alert);
      console.log(`🚨 BRUTE FORCE detected! IP: ${ip}, Attempts: ${recentEvents.length}`);
    }
  }
  
  return alerts;
};

/**
 * Detect OTP FLOODING attack
 * Rule: More than 8 OTP requests from same IP in 60 seconds
 */
export const detectOTPFlooding = async (events) => {
  console.log('🔍 Checking for OTP FLOODING attack...');
  
  const ipGroups = {};
  
  for (const event of events) {
    if (event.type === 'otp_request') {
      if (!ipGroups[event.ip_address]) {
        ipGroups[event.ip_address] = [];
      }
      ipGroups[event.ip_address].push(event);
    }
  }
  
  const alerts = [];
  
  for (const [ip, ipEvents] of Object.entries(ipGroups)) {
    const sixtySecondsAgo = new Date(Date.now() - 60 * 1000);
    const recentEvents = ipEvents.filter(e => new Date(e.time_of_login) >= sixtySecondsAgo);
    
    if (recentEvents.length > 8) {
      const alert = new Alert({
        threat_type: 'OTP_FLOODING',
        severity: recentEvents.length > 15 ? 'HIGH' : 'MEDIUM',
        ip_address: ip,
        username: recentEvents[0].username,
        reason: `${recentEvents.length} OTP requests in 60 seconds (threshold: 8)`,
        event_count: recentEvents.length,
        related_events: recentEvents.map(e => e._id),
        metadata: {
          time_window: '60 seconds',
          threshold_exceeded: recentEvents.length
        }
      });
      
      alerts.push(alert);
      console.log(`🚨 OTP FLOODING detected! IP: ${ip}, Requests: ${recentEvents.length}`);
    }
  }
  
  return alerts;
};

/**
 * Detect PASSWORD RESET ABUSE
 * Rule: More than 5 reset requests from same IP in 60 seconds
 */
export const detectResetAbuse = async (events) => {
  console.log('🔍 Checking for RESET ABUSE attack...');
  
  const ipGroups = {};
  
  for (const event of events) {
    if (event.type === 'reset_request') {
      if (!ipGroups[event.ip_address]) {
        ipGroups[event.ip_address] = [];
      }
      ipGroups[event.ip_address].push(event);
    }
  }
  
  const alerts = [];
  
  for (const [ip, ipEvents] of Object.entries(ipGroups)) {
    const sixtySecondsAgo = new Date(Date.now() - 60 * 1000);
    const recentEvents = ipEvents.filter(e => new Date(e.time_of_login) >= sixtySecondsAgo);
    
    if (recentEvents.length > 5) {
      const alert = new Alert({
        threat_type: 'RESET_ABUSE',
        severity: 'MEDIUM',
        ip_address: ip,
        username: recentEvents[0].username,
        reason: `${recentEvents.length} password reset attempts in 60 seconds (threshold: 5)`,
        event_count: recentEvents.length,
        related_events: recentEvents.map(e => e._id),
        metadata: {
          time_window: '60 seconds',
          threshold_exceeded: recentEvents.length
        }
      });
      
      alerts.push(alert);
      console.log(`🚨 RESET ABUSE detected! IP: ${ip}, Requests: ${recentEvents.length}`);
    }
  }
  
  return alerts;
};

/**
 * Detect REQUEST FLOODING (DDoS-like)
 * Rule: More than 200 requests per minute from same IP
 */
export const detectRequestFlooding = async (events) => {
  console.log('🔍 Checking for REQUEST FLOODING attack...');
  
  const ipGroups = {};
  
  for (const event of events) {
    if (event.type === 'api_request') {
      if (!ipGroups[event.ip_address]) {
        ipGroups[event.ip_address] = [];
      }
      ipGroups[event.ip_address].push(event);
    }
  }
  
  const alerts = [];
  
  for (const [ip, ipEvents] of Object.entries(ipGroups)) {
    const sixtySecondsAgo = new Date(Date.now() - 60 * 1000);
    const recentEvents = ipEvents.filter(e => new Date(e.time_of_login) >= sixtySecondsAgo);
    
    if (recentEvents.length > 200) {
      const alert = new Alert({
        threat_type: 'REQUEST_FLOODING',
        severity: 'HIGH',
        ip_address: ip,
        username: 'N/A',
        reason: `${recentEvents.length} requests per minute from same IP (threshold: 200)`,
        event_count: recentEvents.length,
        related_events: recentEvents.map(e => e._id),
        metadata: {
          time_window: '60 seconds',
          threshold_exceeded: recentEvents.length
        }
      });
      
      alerts.push(alert);
      console.log(`🚨 REQUEST FLOODING detected! IP: ${ip}, Requests: ${recentEvents.length}`);
    }
  }
  
  return alerts;
};

/**
 * Run all detectors on recent events
 * This is called after new events are added
 */
export const runAllDetectors = async () => {
  console.log('🔬 Running all threat detectors...');
  
  // Get all events from last 2 minutes (to catch attacks)
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
  const recentEvents = await Event.find({
    time_of_login: { $gte: twoMinutesAgo }
  });
  
  console.log(`📊 Analyzing ${recentEvents.length} recent events...`);
  
  // Run all detection algorithms
  const bruteForceAlerts = await detectBruteForce(recentEvents);
  const otpFloodingAlerts = await detectOTPFlooding(recentEvents);
  const resetAbuseAlerts = await detectResetAbuse(recentEvents);
  const requestFloodingAlerts = await detectRequestFlooding(recentEvents);
  
  // Combine all alerts
  const allAlerts = [
    ...bruteForceAlerts,
    ...otpFloodingAlerts,
    ...resetAbuseAlerts,
    ...requestFloodingAlerts
  ];
  
  // Save alerts to database
  if (allAlerts.length > 0) {
    const savedAlerts = await Alert.insertMany(allAlerts);
    console.log(`✅ Created ${savedAlerts.length} new alerts`);
    return savedAlerts;
  } else {
    console.log('✅ No threats detected');
    return [];
  }
};
