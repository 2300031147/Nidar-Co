import { useState } from 'react';
import axios from 'axios';

const SendToMissionPlanner = ({ mission, onClose }) => {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [options, setOptions] = useState({
    waypoints: true,
    geofence: true,
    rallyPoints: true,
    parameters: false
  });

  const handleSend = async () => {
    setSending(true);
    setResult(null);

    try {
      // Deploy mission to Mission Planner/QGC
      const response = await axios.post(`http://localhost:8080/api/mission/${mission.id}/deploy`);
      
      setResult({
        success: true,
        message: 'Mission sent successfully to Mission Planner/QGroundControl!'
      });
    } catch (error) {
      setResult({
        success: false,
        message: error.response?.data?.message || 'Failed to send mission'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="neo-card bg-neo-white max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black text-neo-black">
            SEND TO MISSION PLANNER/QGC
          </h2>
          <button
            onClick={onClose}
            className="neo-border px-4 py-2 bg-red-500 text-white font-black hover:bg-red-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Mission Info */}
          <div className="neo-border p-4 bg-neo-yellow">
            <h3 className="text-xl font-black text-neo-black mb-2">MISSION: {mission.name}</h3>
            <div className="grid grid-cols-2 gap-2 text-neo-black font-bold">
              <div>Waypoints: {mission.waypoints?.length || 0}</div>
              <div>Status: {mission.status}</div>
              {mission.geofenceEnabled && (
                <div>Geofence: {mission.geofencePoints?.length || 0} points</div>
              )}
              {mission.rallyPoints?.length > 0 && (
                <div>Rally Points: {mission.rallyPoints.length}</div>
              )}
            </div>
          </div>

          {/* What to Send */}
          <div className="neo-border p-4 bg-neo-blue">
            <h3 className="text-xl font-black text-neo-black mb-4">SEND OPTIONS</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={options.waypoints}
                  onChange={(e) => setOptions({ ...options, waypoints: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="font-black text-neo-black">
                  Waypoints & Flight Plan ({mission.waypoints?.length || 0} items)
                </span>
              </label>
              
              {mission.geofenceEnabled && (
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={options.geofence}
                    onChange={(e) => setOptions({ ...options, geofence: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span className="font-black text-neo-black">
                    Geofence Boundaries ({mission.geofencePoints?.length || 0} points)
                  </span>
                </label>
              )}
              
              {mission.rallyPoints?.length > 0 && (
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={options.rallyPoints}
                    onChange={(e) => setOptions({ ...options, rallyPoints: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span className="font-black text-neo-black">
                    Rally Points ({mission.rallyPoints.length} points)
                  </span>
                </label>
              )}
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={options.parameters}
                  onChange={(e) => setOptions({ ...options, parameters: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="font-black text-neo-black">
                  Vehicle Parameters (if configured)
                </span>
              </label>
            </div>
          </div>

          {/* Info */}
          <div className="neo-border p-4 bg-neo-green">
            <h3 className="text-xl font-black text-neo-black mb-2">📡 HOW IT WORKS</h3>
            <ul className="space-y-2 text-neo-black font-bold">
              <li>✓ Mission data will be sent via MAVLink protocol</li>
              <li>✓ Mission Planner/QGC will receive the waypoints</li>
              <li>✓ You can review/edit in Mission Planner/QGC</li>
              <li>✓ Changes in MP/QGC can be synced back to website</li>
            </ul>
          </div>

          {/* Result Message */}
          {result && (
            <div className={`neo-border p-4 ${result.success ? 'bg-neo-green' : 'bg-red-500'}`}>
              <p className={`font-black ${result.success ? 'text-neo-black' : 'text-white'}`}>
                {result.message}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleSend}
              disabled={sending}
              className="flex-1 neo-border px-8 py-4 bg-neo-orange text-neo-black text-lg font-black hover:bg-neo-yellow shadow-brutal hover:shadow-brutal-lg transition-all duration-300 disabled:opacity-50"
            >
              {sending ? 'SENDING...' : 'SEND TO MISSION PLANNER/QGC'}
            </button>
            <button
              onClick={onClose}
              className="neo-border px-8 py-4 bg-neo-white text-neo-black text-lg font-black hover:bg-gray-200 shadow-brutal hover:shadow-brutal-lg transition-all duration-300"
            >
              CANCEL
            </button>
          </div>

          {/* Requirements */}
          <div className="neo-border p-4 bg-neo-pink">
            <h3 className="text-xl font-black text-neo-black mb-2">⚠️ REQUIREMENTS</h3>
            <ul className="space-y-1 text-neo-black font-bold text-sm">
              <li>• Mission Planner or QGroundControl must be running</li>
              <li>• MAVProxy must be connected (UDP port 14550)</li>
              <li>• Drone/SITL must be connected to Mission Planner/QGC</li>
              <li>• Website backend must be connected to MAVProxy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendToMissionPlanner;
