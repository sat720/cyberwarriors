import mongoose from 'mongoose';

/**
 * ALERT MODEL
 * When we detect an attack, we create an Alert
 * Alerts tell us: what attack happened, how serious it is, and when
 */
const alertSchema = new mongoose.Schema({
  // Type of threat detected
  threat_type: {
    type: String,
    required: true,
    enum: ['BRUTE_FORCE', 'OTP_FLOODING', 'RESET_ABUSE', 'REQUEST_FLOODING', 'SUSPICIOUS_ACTIVITY', 'IMPOSSIBLE_TRAVEL', 'TOR_IP_DETECTED', 'SUSPICIOUS_TIME', 'MALICIOUS_PAYLOAD', 'XSS_ATTACK', 'RANSOMWARE_DETECTED']
  },
  
  // How serious is this attack?
  severity: {
    type: String,
    required: true,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  
  // IP address of the attacker
  ip_address: {
    type: String,
    required: true
  },
  
  // Username being targeted
  username: String,
  
  // Why did we flag this as an attack?
  reason: {
    type: String,
    required: true
  },
  
  // How many events triggered this alert?
  event_count: {
    type: Number,
    default: 1
  },
  
  // Related event IDs
  related_events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  
  // Status of the alert
  status: {
    type: String,
    enum: ['ACTIVE', 'INVESTIGATING', 'RESOLVED', 'FALSE_POSITIVE'],
    default: 'ACTIVE'
  },
  
  // When was this alert created?
  detected_at: {
    type: Date,
    default: Date.now
  },
  
  // Blockchain hash (optional - for tamper-proof evidence)
  blockchain_hash: String,
  
  // Additional metadata
  metadata: {
    time_window: String,
    threshold_exceeded: Number
  }
}, {
  timestamps: true
});

// Index for faster queries
alertSchema.index({ ip_address: 1, detected_at: -1 });
alertSchema.index({ severity: 1 });

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;
