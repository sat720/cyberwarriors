import Event from '../models/Event.js';

/**
 * FAKE DATA GENERATOR
 * Creates realistic fake security events for testing
 * This is SUPER important for hackathon demos!
 */

// List of fake IP addresses (attackers)
const fakeIPs = [
  '192.168.1.100',
  '10.0.0.5',
  '172.16.0.50',
  '203.0.113.42',
  '198.51.100.23'
];

// List of fake usernames
const fakeUsernames = [
  'satvik',
  'admin',
  'user123',
  'test_user',
  'john_doe'
];

// List of fake locations
const fakeLocations = [
  'Hyderabad',
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Unknown'
];

// Get random item from array
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

/**
 * Generate events for BRUTE FORCE attack
 * Creates 15 failed login attempts from same IP in quick succession
 */
export const generateBruteForceEvents = async () => {
  const ip = getRandomItem(fakeIPs);
  const username = getRandomItem(fakeUsernames);
  const events = [];
  
  console.log(`🔴 Generating BRUTE FORCE attack from IP: ${ip}`);
  
  // Create 15 failed login attempts (more than threshold of 10)
  for (let i = 0; i < 15; i++) {
    const event = new Event({
      type: 'login_attempt',
      ip_address: ip,
      username: username,
      success: false,
      device_id: `dev_${Math.random().toString(36).substr(2, 9)}`,
      location: getRandomItem(fakeLocations),
      time_of_login: new Date(Date.now() - (60 - i) * 1000), // Spread over 60 seconds
      otp_requests: 0,
      reset_requests: 0,
      request_rate: 0,
      session_id: `sess_${Math.random().toString(36).substr(2, 9)}`,
      user_behavior_score: Math.floor(Math.random() * 30) // Low score = suspicious
    });
    
    events.push(event);
  }
  
  // Save all events to database
  const savedEvents = await Event.insertMany(events);
  console.log(`✅ Created ${savedEvents.length} brute force events`);
  
  return savedEvents;
};

/**
 * Generate events for OTP FLOODING attack
 * Creates 12 OTP requests from same IP in 60 seconds
 */
export const generateOTPFloodingEvents = async () => {
  const ip = getRandomItem(fakeIPs);
  const username = getRandomItem(fakeUsernames);
  const events = [];
  
  console.log(`🟠 Generating OTP FLOODING attack from IP: ${ip}`);
  
  // Create 12 OTP requests (more than threshold of 8)
  for (let i = 0; i < 12; i++) {
    const event = new Event({
      type: 'otp_request',
      ip_address: ip,
      username: username,
      success: false,
      device_id: `dev_${Math.random().toString(36).substr(2, 9)}`,
      location: getRandomItem(fakeLocations),
      time_of_login: new Date(Date.now() - (60 - i * 5) * 1000),
      otp_requests: 1,
      reset_requests: 0,
      request_rate: 0,
      session_id: `sess_${Math.random().toString(36).substr(2, 9)}`,
      user_behavior_score: Math.floor(Math.random() * 40)
    });
    
    events.push(event);
  }
  
  const savedEvents = await Event.insertMany(events);
  console.log(`✅ Created ${savedEvents.length} OTP flooding events`);
  
  return savedEvents;
};

/**
 * Generate events for PASSWORD RESET ABUSE
 * Creates 8 reset requests from same IP in 60 seconds
 */
export const generateResetAbuseEvents = async () => {
  const ip = getRandomItem(fakeIPs);
  const username = getRandomItem(fakeUsernames);
  const events = [];
  
  console.log(`🟡 Generating RESET ABUSE attack from IP: ${ip}`);
  
  // Create 8 reset requests (more than threshold of 5)
  for (let i = 0; i < 8; i++) {
    const event = new Event({
      type: 'reset_request',
      ip_address: ip,
      username: username,
      success: false,
      device_id: `dev_${Math.random().toString(36).substr(2, 9)}`,
      location: getRandomItem(fakeLocations),
      time_of_login: new Date(Date.now() - (60 - i * 7) * 1000),
      otp_requests: 0,
      reset_requests: 1,
      request_rate: 0,
      session_id: `sess_${Math.random().toString(36).substr(2, 9)}`,
      user_behavior_score: Math.floor(Math.random() * 50)
    });
    
    events.push(event);
  }
  
  const savedEvents = await Event.insertMany(events);
  console.log(`✅ Created ${savedEvents.length} reset abuse events`);
  
  return savedEvents;
};

/**
 * Generate events for REQUEST FLOODING (DDoS-like)
 * Creates 250 API requests from same IP in 1 minute
 */
export const generateRequestFloodingEvents = async () => {
  const ip = getRandomItem(fakeIPs);
  const events = [];
  
  console.log(`🔴 Generating REQUEST FLOODING attack from IP: ${ip}`);
  
  // Create 250 requests (more than threshold of 200)
  for (let i = 0; i < 250; i++) {
    const event = new Event({
      type: 'api_request',
      ip_address: ip,
      username: getRandomItem(fakeUsernames),
      success: Math.random() > 0.5,
      device_id: `dev_${Math.random().toString(36).substr(2, 9)}`,
      location: getRandomItem(fakeLocations),
      time_of_login: new Date(Date.now() - (60 - i * 0.24) * 1000),
      otp_requests: 0,
      reset_requests: 0,
      request_rate: 1,
      session_id: `sess_${Math.random().toString(36).substr(2, 9)}`,
      user_behavior_score: Math.floor(Math.random() * 30)
    });
    
    events.push(event);
  }
  
  const savedEvents = await Event.insertMany(events);
  console.log(`✅ Created ${savedEvents.length} request flooding events`);
  
  return savedEvents;
};
