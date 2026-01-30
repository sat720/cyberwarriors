import mongoose from 'mongoose';

/**
 * USER MODEL
 * Stores real users with authentication and risk tracking
 */
const userSchema = new mongoose.Schema({
  // Basic info
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  
  password: {
    type: String,
    required: true
  },
  
  // Risk tracking
  risk_score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Blocking status
  block_status: {
    type: String,
    enum: ['ACTIVE', 'WARNING', 'TEMP_BLOCKED', 'PERMANENTLY_BLOCKED'],
    default: 'ACTIVE'
  },
  
  block_until: {
    type: Date,
    default: null
  },
  
  // Activity tracking
  failed_login_attempts: {
    type: Number,
    default: 0
  },
  
  last_failed_login: Date,
  
  otp_requests_count: {
    type: Number,
    default: 0
  },
  
  last_otp_request: Date,
  
  reset_requests_count: {
    type: Number,
    default: 0
  },
  
  last_reset_request: Date,
  
  last_login: Date,
  last_ip: String,
  
  // OTP storage (for demo)
  current_otp: String,
  otp_expires: Date
  
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ risk_score: -1 });

const User = mongoose.model('User', userSchema);

export default User;
