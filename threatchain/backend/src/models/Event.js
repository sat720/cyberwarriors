import mongoose from 'mongoose';

/**
 * EVENT MODEL
 * This defines what a "security event" looks like in our database
 * Every login attempt, OTP request, etc. is stored as an Event
 */
const eventSchema = new mongoose.Schema({
  // Type of event: login_attempt, otp_request, reset_request, etc.
  type: {
    type: String,
    required: true,
    enum: ['login_attempt', 'otp_request', 'reset_request', 'api_request']
  },
  
  // IP address of the attacker/user
  ip_address: {
    type: String,
    required: true
  },
  
  // Username being targeted
  username: {
    type: String,
    required: true
  },
  
  // Was the login successful?
  success: {
    type: Boolean,
    default: false
  },
  
  // Device information
  device_id: String,
  location: String,
  
  // Timestamp
  time_of_login: {
    type: Date,
    default: Date.now
  },
  
  // Attack metrics
  otp_requests: {
    type: Number,
    default: 0
  },
  
  reset_requests: {
    type: Number,
    default: 0
  },
  
  request_rate: {
    type: Number,
    default: 0
  },
  
  session_id: String,
  
  // Behavior score (lower = more suspicious)
  user_behavior_score: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Create index on IP address for faster queries
eventSchema.index({ ip_address: 1, time_of_login: -1 });

const Event = mongoose.model('Event', eventSchema);

export default Event;
