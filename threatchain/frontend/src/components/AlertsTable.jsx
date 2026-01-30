import React from 'react';

/**
 * ALERTS TABLE COMPONENT
 * Displays detected threats with severity colors
 */
const AlertsTable = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="card animate-fade-in">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-3xl">🚨</span>
          Threat Alerts
        </h2>
        <div className="text-center py-12 text-gray-400">
          <p className="text-6xl mb-4">✅</p>
          <p className="text-xl">No threats detected</p>
          <p className="text-sm mt-2">All systems secure</p>
        </div>
      </div>
    );
  }

  // Helper to get severity color and icon
  const getSeverityStyle = (severity) => {
    const styles = {
      'LOW': {
        bg: 'bg-blue-500/20',
        text: 'text-blue-300',
        border: 'border-blue-500/50',
        icon: '🔵',
        glow: 'shadow-lg shadow-blue-500/20'
      },
      'MEDIUM': {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-300',
        border: 'border-yellow-500/50',
        icon: '🟡',
        glow: 'shadow-lg shadow-yellow-500/20'
      },
      'HIGH': {
        bg: 'bg-red-500/20',
        text: 'text-red-300',
        border: 'border-red-500/50',
        icon: '🔴',
        glow: 'shadow-lg shadow-red-500/20'
      },
      'CRITICAL': {
        bg: 'bg-purple-500/20',
        text: 'text-purple-300',
        border: 'border-purple-500/50',
        icon: '🟣',
        glow: 'shadow-lg shadow-purple-500/20 animate-pulse-slow'
      }
    };
    return styles[severity] || styles['MEDIUM'];
  };

  // Helper to get threat type icon
  const getThreatTypeIcon = (type) => {
    const icons = {
      'BRUTE_FORCE': '🔨',
      'OTP_FLOODING': '📱',
      'RESET_ABUSE': '🔄',
      'REQUEST_FLOODING': '🌊',
      'SUSPICIOUS_ACTIVITY': '👁️'
    };
    return icons[type] || '⚠️';
  };

  // Helper to format threat type name
  const getThreatTypeName = (type) => {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
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
        <span className="text-3xl">🚨</span>
        Threat Alerts
        <span className="ml-auto text-sm font-normal bg-red-500/30 px-3 py-1 rounded-full border border-red-500/50 animate-pulse-slow">
          {alerts.length} active alerts
        </span>
      </h2>

      <div className="space-y-3">
        {alerts.map((alert, index) => {
          const style = getSeverityStyle(alert.severity);
          
          return (
            <div
              key={alert._id || index}
              className={`p-4 rounded-lg border ${style.bg} ${style.border} ${style.glow} transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-start gap-4">
                {/* Threat Icon */}
                <div className="text-4xl">
                  {getThreatTypeIcon(alert.threat_type)}
                </div>

                {/* Alert Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold">
                      {getThreatTypeName(alert.threat_type)}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text} ${style.border}`}>
                      {style.icon} {alert.severity}
                    </span>
                  </div>

                  <p className="text-sm text-gray-300 mb-2">
                    {alert.reason}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <span>📍</span>
                      <span>IP: <code className="bg-slate-700/50 px-2 py-0.5 rounded">{alert.ip_address}</code></span>
                    </div>
                    
                    {alert.username && (
                      <div className="flex items-center gap-1">
                        <span>👤</span>
                        <span>User: {alert.username}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <span>📊</span>
                      <span>Events: {alert.event_count}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <span>🕐</span>
                      <span>{formatDate(alert.detected_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  <span className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/20">
                    {alert.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {alerts.length > 5 && (
        <div className="mt-4 text-center text-sm text-gray-400">
          Showing latest {alerts.length} alerts
        </div>
      )}
    </div>
  );
};

export default AlertsTable;
