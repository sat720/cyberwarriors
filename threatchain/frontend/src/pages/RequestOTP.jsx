import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestOTP } from '../api/api';

const RequestOTP = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpData, setOtpData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setOtpData(null);

    try {
      const result = await requestOTP(username);
      
      if (result.success) {
        setMessage(`✅ ${result.message}`);
        setOtpData(result);
      }
    } catch (error) {
      if (error.response?.data) {
        const data = error.response.data;
        
        if (data.blocked) {
          setMessage(`🚫 ${data.error}`);
        } else {
          setMessage(`❌ ${data.error || 'OTP request failed'}`);
        }
      } else {
        setMessage(`❌ ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full animate-fade-in">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">📱</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
            Request OTP
          </h1>
          <p className="text-gray-400 mt-2">Get a one-time password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-orange-500 focus:outline-none transition-colors"
              placeholder="Enter your username"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-warning w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Requesting OTP...
              </div>
            ) : (
              '📱 Request OTP'
            )}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-4 rounded-lg bg-white/10 border border-white/20 animate-fade-in">
            <p className="text-sm">{message}</p>
            
            {otpData && (
              <div className="mt-4 space-y-2">
                <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Your OTP:</p>
                  <p className="text-2xl font-bold text-green-300 tracking-widest">{otpData.otp}</p>
                  <p className="text-xs text-gray-400 mt-1">Expires in 5 minutes</p>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Risk Score:</span>
                  <span className={`font-semibold ${
                    otpData.risk_score < 20 ? 'text-green-400' :
                    otpData.risk_score < 40 ? 'text-yellow-400' :
                    otpData.risk_score < 60 ? 'text-orange-400' : 'text-red-400'
                  }`}>
                    {otpData.risk_score}/100
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">OTP Requests:</span>
                  <span className="font-semibold text-orange-400">{otpData.otp_count}</span>
                </div>
                
                {otpData.otp_count >= 5 && (
                  <div className="p-2 bg-red-500/20 border border-red-500/50 rounded text-xs text-red-300">
                    ⚠️ Warning: Multiple OTP requests detected! Your risk score has increased.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-400">
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
              Back to Login
            </Link>
            {' | '}
            <Link to="/reset-password" className="text-pink-400 hover:text-pink-300">
              Reset Password
            </Link>
          </p>
          <p className="text-sm text-gray-400">
            <Link to="/" className="text-green-400 hover:text-green-300">
              ← Back to Admin Dashboard
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-xs text-gray-400">
            💡 <strong>Note:</strong> Requesting too many OTPs will increase your risk score and may result in temporary blocking.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequestOTP;
