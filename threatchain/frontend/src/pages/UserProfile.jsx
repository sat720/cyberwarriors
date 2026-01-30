import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserInfo } from '../api/api';

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Get user from localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
      if (!currentUser) {
        navigate('/login');
        return;
      }

      // Fetch fresh user data
      const result = await getUserInfo(currentUser.username);
      
      if (result.success) {
        setUserData(result.user);
      }
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const getRiskColor = (score) => {
    if (score < 20) return 'text-green-400';
    if (score < 40) return 'text-yellow-400';
    if (score < 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getBlockStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-400';
      case 'WARNING': return 'text-yellow-400';
      case 'TEMP_BLOCKED': return 'text-orange-400';
      case 'PERMANENTLY_BLOCKED': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getBlockStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE': return '✅';
      case 'WARNING': return '⚠️';
      case 'TEMP_BLOCKED': return '⏰';
      case 'PERMANENTLY_BLOCKED': return '🚫';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <Link to="/login" className="btn btn-primary">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card animate-fade-in">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">👤</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              User Profile
            </h1>
            <p className="text-gray-400 mt-2">Welcome, {userData?.username}!</p>
          </div>

          <div className="space-y-6">
            {/* Account Info */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📋</span> Account Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Username</p>
                  <p className="font-semibold">{userData?.username}</p>
                </div>
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="font-semibold">{userData?.email}</p>
                </div>
                <div>
                  <p className="text-gray-400">User ID</p>
                  <p className="font-mono text-xs">{userData?.id}</p>
                </div>
                <div>
                  <p className="text-gray-400">Last Login</p>
                  <p className="text-xs">{userData?.last_login ? new Date(userData.last_login).toLocaleString() : 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Security Status */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>🛡️</span> Security Status
              </h3>
              
              {/* Risk Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Risk Score</span>
                  <span className={`text-2xl font-bold ${getRiskColor(userData?.risk_score || 0)}`}>
                    {userData?.risk_score || 0}/100
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      userData?.risk_score < 20 ? 'bg-green-500' :
                      userData?.risk_score < 40 ? 'bg-yellow-500' :
                      userData?.risk_score < 60 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${userData?.risk_score || 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {userData?.risk_score < 20 ? '✅ Low risk - Account in good standing' :
                   userData?.risk_score < 40 ? '⚠️ Medium risk - Be careful with your actions' :
                   userData?.risk_score < 60 ? '🔶 High risk - Account may be temporarily blocked' :
                   '🚫 Critical risk - Account at risk of permanent blocking'}
                </p>
              </div>

              {/* Block Status */}
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Account Status</span>
                  <span className={`font-semibold ${getBlockStatusColor(userData?.block_status)}`}>
                    {getBlockStatusIcon(userData?.block_status)} {userData?.block_status}
                  </span>
                </div>
                {userData?.block_until && (
                  <p className="text-xs text-gray-400 mt-2">
                    Blocked until: {new Date(userData.block_until).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Activity Statistics */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📊</span> Activity Statistics
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-2xl font-bold text-red-400">{userData?.failed_login_attempts || 0}</p>
                  <p className="text-xs text-gray-400 mt-1">Failed Logins</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-2xl font-bold text-orange-400">{userData?.otp_requests_count || 0}</p>
                  <p className="text-xs text-gray-400 mt-1">OTP Requests</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-2xl font-bold text-pink-400">{userData?.reset_requests_count || 0}</p>
                  <p className="text-xs text-gray-400 mt-1">Reset Requests</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button onClick={handleLogout} className="btn btn-danger flex-1">
                🚪 Logout
              </button>
              <button onClick={loadUserData} className=" btn btn-primary flex-1">
                🔄 Refresh
              </button>
            </div>

            <div className="text-center">
              <Link to="/" className="text-sm text-green-400 hover:text-green-300">
                ← Back to Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
