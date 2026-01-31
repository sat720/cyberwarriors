import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');
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

    try {
      const result = await loginUser(formData);
      
      if (result.success) {
        setMessage(`✅ ${result.message}`);
        
        // Store user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        
        // Redirect to OTP verification after 1 second
        setTimeout(() => {
          navigate('/verify-otp', { state: { user: result.user } });
        }, 1000);
      }
    } catch (error) {
      if (error.response?.data) {
        const data = error.response.data;
        
        if (data.blocked) {
          setMessage(`🚫 ${data.error}`);
        } else {
          setMessage(`❌ ${data.error || 'Login failed'}`);
          if (data.risk_score) {
            setMessage(prev => prev + ` | Risk Score: ${data.risk_score}`);
          }
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
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            User Login
          </h1>
          <p className="text-gray-400 mt-2">Enter your credentials</p>
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
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-indigo-500 focus:outline-none transition-colors"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-indigo-500 focus:outline-none transition-colors"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-4 rounded-lg bg-white/10 border border-white/20 animate-fade-in">
            <p className="text-sm">{message}</p>
          </div>
        )}

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Register here
            </Link>
          </p>
          <p className="text-sm text-gray-400">
            <Link to="/reset-password" className="text-pink-400 hover:text-pink-300">
              Forgot Password?
            </Link>
          </p>
          <p className="text-sm text-gray-400">
            <Link to="/" className="text-green-400 hover:text-green-300">
              ← Back to Admin Dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
