import { useState } from 'react';
import axios from 'axios';

const MissionSimulator = ({ mission, onClose }) => {
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState(null);

  const handleSimulate = async () => {
    setSimulating(true);
    setResult(null);

    try {
      const response = await axios.post(
        `http://localhost:8080/api/simulator/validate/${mission.id}`
      );
      setResult(response.data);
    } catch (error) {
      console.error('Simulation failed:', error);
      setResult({
        valid: false,
        errors: ['Failed to simulate mission'],
        warnings: []
      });
    } finally {
      setSimulating(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="neo-card bg-neo-white max-w-4xl w-full my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black text-neo-black">🎮 MISSION SIMULATOR</h2>
          <button
            onClick={onClose}
            className="neo-border px-4 py-2 bg-red-500 text-white font-black hover:bg-red-600"
          >
            ✕
          </button>
        </div>

        {/* Mission Info */}
        <div className="neo-border p-4 bg-neo-blue mb-6">
          <h3 className="text-2xl font-black text-neo-black mb-2">{mission.name}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-neo-black font-bold">
            <div>Waypoints: {mission.waypoints?.length || 0}</div>
            <div>Default Alt: {mission.defaultAltitude}m</div>
            <div>Default Speed: {mission.defaultSpeed}m/s</div>
            <div>Status: {mission.status}</div>
          </div>
        </div>

        {/* Simulate Button */}
        {!result && (
          <button
            onClick={handleSimulate}
            disabled={simulating}
            className="w-full neo-border px-8 py-6 bg-neo-green text-neo-black text-2xl font-black hover:bg-neo-yellow shadow-brutal hover:shadow-brutal-lg transition-all duration-300 disabled:opacity-50 mb-6"
          >
            {simulating ? '🔄 SIMULATING...' : '▶️ RUN SIMULATION'}
          </button>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Status */}
            <div className={`neo-border p-6 ${result.valid ? 'bg-neo-green' : 'bg-red-500'}`}>
              <div className="flex items-center gap-4">
                <div className="text-6xl">{result.valid ? '✅' : '❌'}</div>
                <div>
                  <h3 className="text-3xl font-black text-neo-black">
                    {result.valid ? 'MISSION VALID' : 'MISSION HAS ISSUES'}
                  </h3>
                  <p className="text-lg font-bold text-neo-black">
                    {result.valid ? 'Ready for deployment' : 'Fix errors before deploying'}
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="neo-card bg-neo-yellow">
              <h3 className="text-2xl font-black text-neo-black mb-4">📊 MISSION STATISTICS</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="neo-border p-4 bg-neo-white">
                  <div className="text-sm font-bold text-gray-600">Total Distance</div>
                  <div className="text-2xl font-black text-neo-black">
                    {result.totalDistance?.toFixed(0)}m
                  </div>
                </div>
                <div className="neo-border p-4 bg-neo-white">
                  <div className="text-sm font-bold text-gray-600">Flight Time</div>
                  <div className="text-2xl font-black text-neo-black">
                    {formatTime(result.estimatedFlightTime)}
                  </div>
                </div>
                <div className="neo-border p-4 bg-neo-white">
                  <div className="text-sm font-bold text-gray-600">Battery Usage</div>
                  <div className="text-2xl font-black text-neo-black">
                    {result.estimatedBatteryUsage?.toFixed(1)}%
                  </div>
                </div>
                <div className="neo-border p-4 bg-neo-white">
                  <div className="text-sm font-bold text-gray-600">Max Altitude</div>
                  <div className="text-2xl font-black text-neo-black">
                    {result.maxAltitude?.toFixed(0)}m
                  </div>
                </div>
                <div className="neo-border p-4 bg-neo-white">
                  <div className="text-sm font-bold text-gray-600">Avg Speed</div>
                  <div className="text-2xl font-black text-neo-black">
                    {result.avgSpeed?.toFixed(1)}m/s
                  </div>
                </div>
                <div className="neo-border p-4 bg-neo-white">
                  <div className="text-sm font-bold text-gray-600">Waypoints</div>
                  <div className="text-2xl font-black text-neo-black">
                    {result.waypointCount}
                  </div>
                </div>
              </div>
            </div>

            {/* Errors */}
            {result.errors && result.errors.length > 0 && (
              <div className="neo-card bg-red-500">
                <h3 className="text-2xl font-black text-white mb-4">❌ ERRORS</h3>
                <ul className="space-y-2">
                  {result.errors.map((error, index) => (
                    <li key={index} className="neo-border p-3 bg-white">
                      <span className="font-bold text-red-600">{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings */}
            {result.warnings && result.warnings.length > 0 && (
              <div className="neo-card bg-neo-orange">
                <h3 className="text-2xl font-black text-neo-black mb-4">⚠️ WARNINGS</h3>
                <ul className="space-y-2">
                  {result.warnings.map((warning, index) => (
                    <li key={index} className="neo-border p-3 bg-white">
                      <span className="font-bold text-orange-600">{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleSimulate}
                className="flex-1 neo-border px-6 py-4 bg-neo-blue text-neo-black font-black hover:bg-neo-green shadow-brutal-sm hover:shadow-brutal transition-all duration-300"
              >
                🔄 RUN AGAIN
              </button>
              <button
                onClick={onClose}
                className="flex-1 neo-border px-6 py-4 bg-neo-white text-neo-black font-black hover:bg-gray-200 shadow-brutal-sm hover:shadow-brutal transition-all duration-300"
              >
                CLOSE
              </button>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 neo-border p-4 bg-neo-pink">
          <h3 className="text-xl font-black text-neo-black mb-2">💡 ABOUT SIMULATION</h3>
          <ul className="space-y-1 text-neo-black font-bold text-sm">
            <li>• Validates waypoint coordinates and altitudes</li>
            <li>• Calculates total distance and flight time</li>
            <li>• Estimates battery consumption</li>
            <li>• Checks for geofence violations</li>
            <li>• Detects dangerous altitude changes</li>
            <li>• Warns about regulatory limits (120m altitude)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MissionSimulator;
