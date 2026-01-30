import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import testRoutes from './routes/testRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// Enable CORS (allows frontend to talk to backend)
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Request logger (see what's happening)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// ROUTES
// ============================================

// Test routes (fake attack simulation)
app.use('/api', testRoutes);

// User authentication routes (real user login/OTP/reset)
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🛡️ ThreatChain API is running!',
    version: '1.0.0',
    endpoints: {
      test_bruteforce: 'POST /api/test/bruteforce',
      test_otp_flood: 'POST /api/test/otp-flood',
      test_reset_abuse: 'POST /api/test/reset-abuse',
      test_request_flood: 'POST /api/test/request-flood',
      get_events: 'GET /api/events',
      get_alerts: 'GET /api/alerts',
      get_stats: 'GET /api/stats',
      clear_all: 'DELETE /api/clear-all'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log('\n✨ ================================');
      console.log('🛡️  ThreatChain Backend Started!');
      console.log('✨ ================================');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 API URL: http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/`);
      console.log('✨ ================================\n');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
