import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { requestOTP } from '../api/api';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [serverOtp, setServerOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  // Get user from state passed from Login page
  const user = location.state?.user; // Passed from Login

  useEffect(() => {
    // If no user passed (tried to access directly), go back to login
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSendOTP = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const result = await requestOTP(user.username);
      
      if (result.success) {
        setServerOtp(result.otp); // Save real OTP to compare
        setOtpSent(true);
        setMessage(`✅ OTP sent to your registered mobile/email!`);
        
        // Check for spamming/blocking
        if (result.otp_count > 5) {
          setMessage('⚠️ Too many OTP requests! Logging you out...');
          setTimeout(() => navigate('/login'), 2000); // Kick out
        }
      }
    } catch (error) {
       const errorMsg = error.response?.data?.error || error.message;
       setMessage(`❌ ${errorMsg}`);
       
       // If blocked, kick out
       if (error.response?.data?.blocked) {
         setTimeout(() => navigate('/login'), 2000);
       }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    
    if (otp === serverOtp) {
       // Success! Go to Profile
       navigate('/profile', { state: { user } });
    } else {
       setMessage('❌ Invalid OTP. Try again.');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full animate-fade-in border-orange-500/30">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-orange-400">
            Two-Factor Auth
          </h1>
          <p className="text-gray-400 mt-2">
            Verifying identity for <strong>{user.username}</strong>
          </p>
        </div>

        {/* Step 1: Send OTP */}
        {!otpSent ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-300">
              For security, please request a One-Time Password (OTP)
            </p>
            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="btn btn-warning w-full"
            >
              {loading ? 'Sending...' : '📨 Send OTP'}
            </button>
          </div>
        ) : (
          /* Step 2: Enter OTP */
          <form onSubmit={handleVerify} className="space-y-4">
             {/* Show Fake OTP for Demo */}
             <div className="p-3 bg-green-900/30 border border-green-500/30 rounded text-center">
               <p className="text-xs text-gray-400">DEMO MODE: Your OTP is</p>
               <p className="text-2xl font-mono font-bold text-green-400 tracking-widest">{serverOtp}</p>
             </div>

             <div>
               <label className="block text-sm font-semibold mb-2">Enter OTP</label>
               <input
                 type="text"
                 value={otp}
                 onChange={(e) => setOtp(e.target.value)}
                 className="w-full text-center text-2xl tracking-widest px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-orange-500 font-mono"
                 placeholder="------"
                 maxLength={6}
               />
             </div>

             <button type="submit" className="btn btn-primary w-full">
               Verify & Login →
             </button>
             
             <button 
               type="button"
               onClick={handleSendOTP} 
               className="text-sm text-orange-400 hover:text-orange-300 w-full text-center"
               type="button"
             >
               Resend OTP
             </button>
          </form>
        )}

        {message && (
          <div className="mt-4 p-3 rounded bg-white/10 text-center text-sm font-semibold animate-fade-in">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyOTP;
