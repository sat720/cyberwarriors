import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TestButtons from '../components/TestButtons';
import EventsTable from '../components/EventsTable';
import AlertsTable from '../components/AlertsTable';
import { getEvents, getAlerts, getStats, checkHealth } from '../api/api';

/**
 * DASHBOARD PAGE
 * Main page of the application
 * Shows test buttons, events, and alerts
 */
const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  // Check backend connection on mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  // Load initial data
  useEffect(() => {
    if (connected) {
      loadData();
    }
  }, [connected]);

  const checkBackendConnection = async () => {
    try {
      const result = await checkHealth();
      if (result.success) {
        console.log('✅ Connected to backend:', result.data);
        setConnected(true);
      } else {
        console.error('❌ Backend connection failed:', result.error);
        setConnected(false);
      }
    } catch (error) {
      console.error('❌ Backend connection error:', error);
      setConnected(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [eventsData, alertsData, statsData] = await Promise.all([
        getEvents(50),
        getAlerts(50),
        getStats()
      ]);

      setEvents(eventsData.events || []);
      setAlerts(alertsData.alerts || []);
      setStats(statsData.stats || null);

      console.log('📊 Data loaded:', {
        events: eventsData.count,
        alerts: alertsData.count
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestComplete = (result) => {
    console.log('Test completed:', result);
    // Update events and alerts from test result
    if (result.events) {
      setEvents(result.events);
    }
    if (result.alerts) {
      setAlerts(result.alerts);
    }
    // Reload all data to ensure sync
    loadData();
  };

  // Connection error screen
  if (!connected && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-2xl w-full text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold mb-4 text-red-400">Backend Connection Failed</h1>
          <p className="text-gray-300 mb-6">
            Cannot connect to the backend server. Please make sure:
          </p>
          <ul className="text-left text-gray-300 space-y-2 mb-6">
            <li>✓ Backend server is running on port 5000</li>
            <li>✓ MongoDB connection is configured</li>
            <li>✓ Environment variables are set correctly</li>
          </ul>
          <button
            onClick={checkBackendConnection}
            className="btn btn-primary"
          >
            🔄 Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 text-center animate-slide-in">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-6xl">🛡️</span>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            ThreatChain
          </h1>
        </div>
        <p className="text-xl text-gray-300 mb-2">
          Real-time Cyber Threat Detection System
        </p>

        
        {/* Status Badge */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/50">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-sm text-green-300 font-semibold">System Online</span>
        </div>

        {/* Admin Controls */}
        <div className="mt-6 flex justify-center">
          <Link to="/" className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-red-500/20 hover:border-red-500/50 transition-colors text-sm font-semibold">
            🚪 Admin Logout
          </Link>
        </div>
      </header>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
          <div className="card text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-3xl font-bold text-indigo-400">{stats.total_events}</div>
            <div className="text-sm text-gray-400">Total Events</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl mb-2">🚨</div>
            <div className="text-3xl font-bold text-red-400">{stats.total_alerts}</div>
            <div className="text-sm text-gray-400">Total Alerts</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl mb-2">⚠️</div>
            <div className="text-3xl font-bold text-orange-400">{stats.high_severity_alerts}</div>
            <div className="text-sm text-gray-400">High Severity</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl mb-2">🔔</div>
            <div className="text-3xl font-bold text-yellow-400">{stats.active_alerts}</div>
            <div className="text-sm text-gray-400">Active Alerts</div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-8">
        {/* Test Buttons */}
        <TestButtons onTestComplete={handleTestComplete} />

        {/* Alerts Table */}
        <AlertsTable alerts={alerts} />

        {/* Events Table */}
        <EventsTable events={events} />
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-500 text-sm pb-8">
        <p>Built for AU Hackathon 2026 | Cybersecurity + Blockchain</p>
        <p className="mt-2">Made with ❤️ by Satvik</p>
      </footer>
    </div>
  );
};

export default Dashboard;
