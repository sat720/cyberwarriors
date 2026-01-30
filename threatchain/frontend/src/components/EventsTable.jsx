import React from 'react';

/**
 * EVENTS TABLE COMPONENT
 * Displays all security events in a beautiful table
 */
const EventsTable = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="card animate-fade-in">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-3xl">📊</span>
          Security Events
        </h2>
        <div className="text-center py-12 text-gray-400">
          <p className="text-6xl mb-4">📭</p>
          <p className="text-xl">No events yet</p>
          <p className="text-sm mt-2">Click a test button to generate events</p>
        </div>
      </div>
    );
  }

  // Helper to format event type
  const getEventTypeIcon = (type) => {
    const icons = {
      'login_attempt': '🔑',
      'otp_request': '🔢',
      'reset_request': '🔄',
      'api_request': '🌐'
    };
    return icons[type] || '📝';
  };

  // Helper to format event type name
  const getEventTypeName = (type) => {
    const names = {
      'login_attempt': 'Login Attempt',
      'otp_request': 'OTP Request',
      'reset_request': 'Reset Request',
      'api_request': 'API Request'
    };
    return names[type] || type;
  };

  // Helper to get success badge
  const getSuccessBadge = (success) => {
    if (success) {
      return <span className="px-2 py-1 rounded-full text-xs bg-green-500/30 text-green-300 border border-green-500/50">✓ Success</span>;
    }
    return <span className="px-2 py-1 rounded-full text-xs bg-red-500/30 text-red-300 border border-red-500/50">✗ Failed</span>;
  };

  // Helper to format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="card animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span className="text-3xl">📊</span>
        Security Events
        <span className="ml-auto text-sm font-normal bg-indigo-500/30 px-3 py-1 rounded-full border border-indigo-500/50">
          {events.length} events
        </span>
      </h2>

      <div className="overflow-x-auto">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-800/90 backdrop-blur-sm">
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">IP Address</th>
                <th className="px-4 py-3 font-semibold">Username</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr
                  key={event._id || index}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span>{getEventTypeIcon(event.type)}</span>
                      <span className="text-sm">{getEventTypeName(event.type)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-sm bg-slate-700/50 px-2 py-1 rounded">
                      {event.ip_address}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-sm">{event.username}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {event.location || 'Unknown'}
                  </td>
                  <td className="px-4 py-3">
                    {getSuccessBadge(event.success)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {formatDate(event.time_of_login)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {events.length > 10 && (
        <div className="mt-4 text-center text-sm text-gray-400">
          Showing latest {events.length} events
        </div>
      )}
    </div>
  );
};

export default EventsTable;
