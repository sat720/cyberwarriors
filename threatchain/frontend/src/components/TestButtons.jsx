import React, { useState } from 'react';
import {
  simulateBruteForce,
  simulateOTPFlood,
  simulateResetAbuse,
  simulateRequestFlood,
  clearAllData
} from '../api/api';

/**
 * TEST BUTTONS COMPONENT
 * These buttons simulate different types of attacks
 * Perfect for demos!
 */
const TestButtons = ({ onTestComplete }) => {
  const [loading, setLoading] = useState(null);
  const [message, setMessage] = useState('');

  const handleTest = async (testFunction, testName) => {
    try {
      setLoading(testName);
      setMessage('');
      
      console.log(`Running ${testName} test...`);
      const result = await testFunction();
      
      setMessage(`✅ ${result.message}`);
      console.log('Test result:', result);
      
      // Notify parent to refresh data
      if (onTestComplete) {
        onTestComplete(result);
      }
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Test error:', error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all data? This cannot be undone!')) {
      return;
    }
    
    try {
      setLoading('clear');
      await clearAllData();
      setMessage('✅ All data cleared!');
      
      if (onTestComplete) {
        onTestComplete({ events: [], alerts: [] });
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="card animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span className="text-3xl">🎯</span>
        Attack Simulation Controls
      </h2>
      
      <p className="text-gray-300 mb-6">
        Click any button below to simulate a cyber attack. The system will detect it and create alerts!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Brute Force Button */}
        <button
          onClick={() => handleTest(simulateBruteForce, 'bruteforce')}
          disabled={loading !== null}
          className="btn btn-danger flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === 'bruteforce' ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Simulating...
            </>
          ) : (
            <>
              🔴 Brute Force Attack
            </>
          )}
        </button>

        {/* OTP Flood Button */}
        <button
          onClick={() => handleTest(simulateOTPFlood, 'otp-flood')}
          disabled={loading !== null}
          className="btn btn-warning flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === 'otp-flood' ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Simulating...
            </>
          ) : (
            <>
              🟠 OTP Flooding
            </>
          )}
        </button>

        {/* Reset Abuse Button */}
        <button
          onClick={() => handleTest(simulateResetAbuse, 'reset-abuse')}
          disabled={loading !== null}
          className="btn btn-warning flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === 'reset-abuse' ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Simulating...
            </>
          ) : (
            <>
              🟡 Reset Abuse
            </>
          )}
        </button>

        {/* Request Flood Button */}
        <button
          onClick={() => handleTest(simulateRequestFlood, 'request-flood')}
          disabled={loading !== null}
          className="btn btn-danger flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === 'request-flood' ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Simulating...
            </>
          ) : (
            <>
              🔴 Request Flooding
            </>
          )}
        </button>
      </div>

      {/* Clear All Button */}
      <button
        onClick={handleClearAll}
        disabled={loading !== null}
        className="btn bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading === 'clear' ? 'Clearing...' : '🗑️ Clear All Data'}
      </button>

      {/* Message Display */}
      {message && (
        <div className="mt-4 p-4 rounded-lg bg-white/10 border border-white/20 animate-fade-in">
          <p className="text-center font-semibold">{message}</p>
        </div>
      )}
    </div>
  );
};

export default TestButtons;
