import express from 'express';
import Event from '../models/Event.js';
import Alert from '../models/Alert.js';
import User from '../models/User.js';
import {
  generateBruteForceEvents,
  generateOTPFloodingEvents,
  generateResetAbuseEvents,
  generateRequestFloodingEvents,
  generateImpossibleTravelEvents,
  generateTorConnectionEvents,
  generateSuspiciousTimeEvents,
  generateMaliciousPayloadEvents,
  generateXSSAttackEvents,
  generateRansomwareEvents
} from '../services/fakeDataGenerator.js';
import { runAllDetectors } from '../services/detector.js';

const router = express.Router();

// ... (existing routes) ...

// ============================================
// TEST: Simulate RANSOMWARE
// ============================================
router.post('/test/ransomware', async (req, res) => {
  try {
    const events = await generateRansomwareEvents();
    res.json({ success: true, message: 'Ransomware Attack simulated', events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// TEST: Simulate XSS ATTACK
// ============================================
router.post('/test/xss', async (req, res) => {
  try {
    const events = await generateXSSAttackEvents();
    res.json({ success: true, message: 'XSS Attack simulated', events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// TEST: Simulate MALICIOUS PAYLOAD
// ============================================
router.post('/test/malicious-payload', async (req, res) => {
  try {
    const events = await generateMaliciousPayloadEvents();
    res.json({ success: true, message: 'Malicious Payload simulated', events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// TEST: Simulate IMPOSSIBLE TRAVEL
// ============================================
router.post('/test/impossible-travel', async (req, res) => {
  try {
    const events = await generateImpossibleTravelEvents();
    res.json({ success: true, message: 'Impossible Travel simulated', events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// TEST: Simulate TOR CONNECTION
// ============================================
router.post('/test/tor-connection', async (req, res) => {
  try {
    const events = await generateTorConnectionEvents();
    res.json({ success: true, message: 'Tor Connection simulated', events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// TEST: Simulate SUSPICIOUS TIME
// ============================================
router.post('/test/suspicious-time', async (req, res) => {
  try {
    const events = await generateSuspiciousTimeEvents();
    res.json({ success: true, message: 'Suspicious Time simulated', events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// TEST: Simulate REQUEST FLOODING Attack

// ============================================
// TEST: Simulate BRUTE FORCE Attack
// ============================================
router.post('/test/bruteforce', async (req, res) => {
  try {
    console.log('\n🎯 TEST: Simulating BRUTE FORCE attack...');
    
    // Generate fake brute force events
    const events = await generateBruteForceEvents();
    
    // Run detection algorithms
    const alerts = await runAllDetectors();
    
    // Get latest events and alerts
    const latestEvents = await Event.find().sort({ createdAt: -1 }).limit(20);
    const latestAlerts = await Alert.find().sort({ createdAt: -1 }).limit(10);
    
    res.json({
      success: true,
      message: 'Brute force attack simulated successfully',
      events_created: events.length,
      alerts_created: alerts.length,
      events: latestEvents,
      alerts: latestAlerts
    });
  } catch (error) {
    console.error('Error simulating brute force:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// TEST: Simulate OTP FLOODING Attack
// ============================================
router.post('/test/otp-flood', async (req, res) => {
  try {
    console.log('\n🎯 TEST: Simulating OTP FLOODING attack...');
    
    const events = await generateOTPFloodingEvents();
    const alerts = await runAllDetectors();
    
    const latestEvents = await Event.find().sort({ createdAt: -1 }).limit(20);
    const latestAlerts = await Alert.find().sort({ createdAt: -1 }).limit(10);
    
    res.json({
      success: true,
      message: 'OTP flooding attack simulated successfully',
      events_created: events.length,
      alerts_created: alerts.length,
      events: latestEvents,
      alerts: latestAlerts
    });
  } catch (error) {
    console.error('Error simulating OTP flood:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// TEST: Simulate RESET ABUSE Attack
// ============================================
router.post('/test/reset-abuse', async (req, res) => {
  try {
    console.log('\n🎯 TEST: Simulating RESET ABUSE attack...');
    
    const events = await generateResetAbuseEvents();
    const alerts = await runAllDetectors();
    
    const latestEvents = await Event.find().sort({ createdAt: -1 }).limit(20);
    const latestAlerts = await Alert.find().sort({ createdAt: -1 }).limit(10);
    
    res.json({
      success: true,
      message: 'Reset abuse attack simulated successfully',
      events_created: events.length,
      alerts_created: alerts.length,
      events: latestEvents,
      alerts: latestAlerts
    });
  } catch (error) {
    console.error('Error simulating reset abuse:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// TEST: Simulate REQUEST FLOODING Attack
// ============================================
router.post('/test/request-flood', async (req, res) => {
  try {
    console.log('\n🎯 TEST: Simulating REQUEST FLOODING attack...');
    
    const events = await generateRequestFloodingEvents();
    const alerts = await runAllDetectors();
    
    const latestEvents = await Event.find().sort({ createdAt: -1 }).limit(20);
    const latestAlerts = await Alert.find().sort({ createdAt: -1 }).limit(10);
    
    res.json({
      success: true,
      message: 'Request flooding attack simulated successfully',
      events_created: events.length,
      alerts_created: alerts.length,
      events: latestEvents,
      alerts: latestAlerts
    });
  } catch (error) {
    console.error('Error simulating request flood:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// GET: Fetch all events
// ============================================
router.get('/events', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const events = await Event.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.json({
      success: true,
      count: events.length,
      events: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// GET: Fetch all alerts
// ============================================
router.get('/alerts', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const alerts = await Alert.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.json({
      success: true,
      count: alerts.length,
      alerts: alerts
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// GET: Dashboard statistics
// ============================================
router.get('/stats', async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalAlerts = await Alert.countDocuments();
    const highSeverityAlerts = await Alert.countDocuments({ severity: 'HIGH' });
    const activeAlerts = await Alert.countDocuments({ status: 'ACTIVE' });
    
    // Get events by type
    const eventsByType = await Event.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get alerts by severity
    const alertsBySeverity = await Alert.aggregate([
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      stats: {
        total_events: totalEvents,
        total_alerts: totalAlerts,
        high_severity_alerts: highSeverityAlerts,
        active_alerts: activeAlerts,
        events_by_type: eventsByType,
        alerts_by_severity: alertsBySeverity
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// DELETE: Clear all data (for testing)
// ============================================
// ============================================
// DELETE: Clear all data (Reset Demo)
// ============================================
router.delete('/clear-all', async (req, res) => {
  try {
    await Event.deleteMany({});
    await Alert.deleteMany({});
    
    // Reset all users to SAFE state
    await User.updateMany({}, { 
      risk_score: 0,
      block_status: 'ACTIVE',
      block_until: null,
      failed_login_attempts: 0
    });
    
    res.json({
      success: true,
      message: 'All events/alerts cleared & User Risk Scores reset to 0'
    });
  } catch (error) {
    console.error('Error clearing data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
