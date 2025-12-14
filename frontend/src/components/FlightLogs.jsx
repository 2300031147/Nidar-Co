import { useState, useEffect } from 'react';
import axios from 'axios';

const FlightLogs = () => {
  const [logs, setLogs] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    loadLogs();
    loadStatistics();
  }, []);

  const loadLogs = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/logs');
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/logs/statistics');
      setStatistics(response.data);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-neo-green';
      case 'ABORTED': return 'bg-neo-orange';
      case 'EMERGENCY_LANDED': return 'bg-red-500';
      default: return 'bg-neo-blue';
    }
  };

  const filteredLogs = filter === 'ALL' 
    ? logs 
    : logs.filter(log => log.flightStatus === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="neo-card bg-neo-yellow">
        <h2 className="text-3xl font-black text-neo-black mb-2">📋 FLIGHT LOGS</h2>
        <p className="text-neo-black font-bold">
          View and analyze historical flight data
        </p>
      </div>

      {/* Statistics Overview */}
      {statistics && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="neo-card bg-neo-green">
            <div className="text-5xl mb-2">✈️</div>
            <div className="text-4xl font-black text-neo-black">
              {statistics.totalFlights || 0}
            </div>
            <div className="text-lg font-bold text-neo-black">Total Flights</div>
          </div>
          <div className="neo-card bg-neo-blue">
            <div className="text-5xl mb-2">📏</div>
            <div className="text-4xl font-black text-neo-black">
              {(statistics.totalDistance / 1000).toFixed(1)}km
            </div>
            <div className="text-lg font-bold text-neo-black">Total Distance</div>
          </div>
          <div className="neo-card bg-neo-pink">
            <div className="text-5xl mb-2">⏱️</div>
            <div className="text-4xl font-black text-neo-black">
              {formatDuration(statistics.totalFlightTime)}
            </div>
            <div className="text-lg font-bold text-neo-black">Total Flight Time</div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="neo-card bg-neo-white">
        <h3 className="text-xl font-black text-neo-black mb-4">FILTER BY STATUS</h3>
        <div className="flex flex-wrap gap-3">
          {['ALL', 'COMPLETED', 'ABORTED', 'EMERGENCY_LANDED', 'IN_PROGRESS'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`neo-border px-6 py-2 font-black ${
                filter === status ? 'bg-neo-yellow' : 'bg-neo-white'
              } hover:bg-neo-yellow transition-all duration-300`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Logs List */}
      <div className="neo-card bg-neo-white">
        <h3 className="text-2xl font-black text-neo-black mb-4">
          FLIGHT HISTORY ({filteredLogs.length})
        </h3>
        
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚁</div>
            <p className="text-xl font-bold text-gray-600">No flight logs yet</p>
            <p className="font-bold text-gray-500">Complete a mission to see logs here</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="neo-border p-4 bg-neo-white hover:bg-gray-50 cursor-pointer transition-all duration-300"
                onClick={() => setSelectedLog(log)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`neo-border px-3 py-1 ${getStatusColor(log.flightStatus)} shadow-brutal-sm`}>
                        <span className="font-black text-neo-black text-sm">
                          {log.flightStatus}
                        </span>
                      </span>
                      <span className="text-xl font-black text-neo-black">
                        Flight #{log.id}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <div className="font-bold text-gray-600">Start Time</div>
                        <div className="font-black text-neo-black">{formatDate(log.startTime)}</div>
                      </div>
                      <div>
                        <div className="font-bold text-gray-600">Duration</div>
                        <div className="font-black text-neo-black">{formatDuration(log.durationSeconds)}</div>
                      </div>
                      <div>
                        <div className="font-bold text-gray-600">Distance</div>
                        <div className="font-black text-neo-black">{log.totalDistance?.toFixed(0)}m</div>
                      </div>
                      <div>
                        <div className="font-bold text-gray-600">Battery Used</div>
                        <div className="font-black text-neo-black">{log.batteryUsed?.toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl">▶️</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed View Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="neo-card bg-neo-white max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black text-neo-black">
                FLIGHT LOG #{selectedLog.id}
              </h2>
              <button
                onClick={() => setSelectedLog(null)}
                className="neo-border px-4 py-2 bg-red-500 text-white font-black hover:bg-red-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Status */}
              <div className={`neo-border p-4 ${getStatusColor(selectedLog.flightStatus)}`}>
                <h3 className="text-2xl font-black text-neo-black">
                  STATUS: {selectedLog.flightStatus}
                </h3>
              </div>

              {/* Time Info */}
              <div className="neo-border p-4 bg-neo-blue">
                <h3 className="text-xl font-black text-neo-black mb-3">TIME INFORMATION</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <div className="font-bold text-neo-black">Start Time</div>
                    <div className="font-black text-neo-black text-lg">{formatDate(selectedLog.startTime)}</div>
                  </div>
                  <div>
                    <div className="font-bold text-neo-black">End Time</div>
                    <div className="font-black text-neo-black text-lg">{formatDate(selectedLog.endTime)}</div>
                  </div>
                  <div>
                    <div className="font-bold text-neo-black">Duration</div>
                    <div className="font-black text-neo-black text-lg">{formatDuration(selectedLog.durationSeconds)}</div>
                  </div>
                </div>
              </div>

              {/* Flight Statistics */}
              <div className="neo-border p-4 bg-neo-green">
                <h3 className="text-xl font-black text-neo-black mb-3">FLIGHT STATISTICS</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <div className="font-bold text-neo-black">Max Altitude</div>
                    <div className="font-black text-neo-black text-lg">{selectedLog.maxAltitude?.toFixed(1)}m</div>
                  </div>
                  <div>
                    <div className="font-bold text-neo-black">Max Speed</div>
                    <div className="font-black text-neo-black text-lg">{selectedLog.maxSpeed?.toFixed(1)}m/s</div>
                  </div>
                  <div>
                    <div className="font-bold text-neo-black">Total Distance</div>
                    <div className="font-black text-neo-black text-lg">{selectedLog.totalDistance?.toFixed(0)}m</div>
                  </div>
                  <div>
                    <div className="font-bold text-neo-black">Avg Speed</div>
                    <div className="font-black text-neo-black text-lg">{selectedLog.avgSpeed?.toFixed(1)}m/s</div>
                  </div>
                  <div>
                    <div className="font-bold text-neo-black">Max Distance from Home</div>
                    <div className="font-black text-neo-black text-lg">{selectedLog.maxDistanceFromHome?.toFixed(0)}m</div>
                  </div>
                </div>
              </div>

              {/* Battery Info */}
              <div className="neo-border p-4 bg-neo-orange">
                <h3 className="text-xl font-black text-neo-black mb-3">BATTERY USAGE</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <div className="font-bold text-neo-black">Start Battery</div>
                    <div className="font-black text-neo-black text-lg">{selectedLog.startBattery?.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="font-bold text-neo-black">End Battery</div>
                    <div className="font-black text-neo-black text-lg">{selectedLog.endBattery?.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="font-bold text-neo-black">Battery Used</div>
                    <div className="font-black text-neo-black text-lg">{selectedLog.batteryUsed?.toFixed(1)}%</div>
                  </div>
                </div>
              </div>

              {/* Waypoint Info */}
              <div className="neo-border p-4 bg-neo-pink">
                <h3 className="text-xl font-black text-neo-black mb-3">WAYPOINTS</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <div className="font-bold text-neo-black">Planned</div>
                    <div className="font-black text-neo-black text-lg">{selectedLog.waypointsPlanned}</div>
                  </div>
                  <div>
                    <div className="font-bold text-neo-black">Completed</div>
                    <div className="font-black text-neo-black text-lg">{selectedLog.waypointsCompleted}</div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedLog.notes && (
                <div className="neo-border p-4 bg-neo-yellow">
                  <h3 className="text-xl font-black text-neo-black mb-2">NOTES</h3>
                  <p className="font-bold text-neo-black">{selectedLog.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightLogs;
