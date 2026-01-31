import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword } from '../api/api';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [message, setMessage] = useState('');
  const [resetData, setResetData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setResetData(null);

    try {
      const result = await resetPassword(formData);
      
      if (result.success) {
        setMessage(`✅ ${result.message}`);
        setResetData(result);
      }
    } catch (error) {
      if (error.response?.data) {
        const data = error.response.data;
        if (data.blocked) {
          setMessage(`🚫 ${data.error}`);
        } else {
          setMessage(`❌ ${data.error || 'Reset failed'}`);
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
      <div className="card max-w-md w-full animate-fade-in border-pink-500/30">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🔄</div>
          <h1 className="text-3xl font-bold text-pink-400">
            Reset Password
          </h1>
          <p className="text-gray-400 mt-2">Recover your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-pink-500 focus:outline-none transition-colors"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-pink-500 focus:outline-none transition-colors"
              placeholder="Enter registered email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Send Reset Link'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-4 rounded-lg border animate-fade-in ${
            message.includes('🚫') ? 'bg-red-500/20 border-red-500/50' : 'bg-white/10 border-white/20'
          }`}>
            <p className="text-sm font-semibold">{message}</p>
            {resetData && (
              <div className="mt-2 text-xs text-gray-400">
                <p>New Risk Score: {resetData.risk_score}</p>
                <p>Reset Attempts: {resetData.reset_count}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-pink-400 hover:text-pink-300 font-semibold text-sm">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
