import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate network delay
    setTimeout(() => {
      // Hardcoded check for Hackathon demo
      if (formData.username === 'admin' && formData.password === 'admin') {
        localStorage.setItem('isAdmin', 'true');
        navigate('/dashboard');
      } else {
        setError('❌ Invalid Admin Credentials');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
      <div className="card max-w-md w-full animate-fade-in border-red-500/20 shadow-red-500/10">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🛡️</div>
          <h1 className="text-3xl font-bold text-red-400">
            Admin Access
          </h1>
          <p className="text-gray-400 mt-2">Restricted Area: Security Personnel Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">Admin ID</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:border-red-500 focus:outline-none transition-colors text-white"
              placeholder="Enter admin username"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">Passkey</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:border-red-500 focus:outline-none transition-colors text-white"
              placeholder="Enter system passkey"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn w-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 border border-red-500/30"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Verifying Credentials...
              </div>
            ) : (
              'Unlock Dashboard'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 animate-shake text-center">
            <p className="text-red-300 font-bold">{error}</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
