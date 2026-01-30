import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-12 animate-fade-in">
        
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <span className="text-8xl filter drop-shadow-lg">🛡️</span>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            ThreatChain
          </h1>
          <p className="text-2xl text-gray-300 font-light max-w-2xl mx-auto">
            Next-Gen Cyber Threat Detection System <br/>
            <span className="text-base text-gray-400 mt-2 block">Powered by AI & Real-time Monitoring</span>
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          
          {/* User Portal Card */}
          <Link to="/login" className="group">
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:border-indigo-500/50 shadow-2xl hover:shadow-indigo-500/20">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">👤</div>
              <h2 className="text-2xl font-bold text-white mb-2">User Portal</h2>
              <p className="text-gray-400 text-sm">
                Login to access your account, manage settings, and request services.
              </p>
              <div className="mt-6 flex items-center justify-center text-indigo-400 font-semibold group-hover:text-indigo-300">
                Login as User →
              </div>
            </div>
          </Link>

          {/* Admin Command Center Card */}
          <Link to="/admin-login" className="group">
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:border-red-500/50 shadow-2xl hover:shadow-red-500/20">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🛡️</div>
              <h2 className="text-2xl font-bold text-white mb-2">Admin Command Center</h2>
              <p className="text-gray-400 text-sm">
                Monitor threats, view live alerts, and analyze security events.
              </p>
              <div className="mt-6 flex items-center justify-center text-red-400 font-semibold group-hover:text-red-300">
                Access Dashboard →
              </div>
            </div>
          </Link>

        </div>

        {/* Footer */}
        <div className="pt-12 text-gray-500 text-sm">
          <p>AU Hackathon 2026 Project</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
