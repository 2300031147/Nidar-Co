import { useState } from 'react';

const AdvancedWaypointForm = ({ onAdd, onClose }) => {
  const [waypoint, setWaypoint] = useState({
    latitude: '',
    longitude: '',
    altitude: '',
    speed: '',
    heading: '',
    delay: '',
    acceptanceRadius: '10',
    command: 'WAYPOINT',
    cameraAction: 'NONE',
    cameraPitch: '0',
    autocontinue: 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(waypoint);
    onClose();
  };

  const handleChange = (field, value) => {
    setWaypoint({ ...waypoint, [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="neo-card bg-neo-white max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black text-neo-black">ADD ADVANCED WAYPOINT</h2>
          <button
            onClick={onClose}
            className="neo-border px-4 py-2 bg-red-500 text-white font-black hover:bg-red-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Location */}
          <div className="neo-border p-4 bg-neo-yellow">
            <h3 className="text-xl font-black text-neo-black mb-4">LOCATION</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">
                  Latitude *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={waypoint.latitude}
                  onChange={(e) => handleChange('latitude', e.target.value)}
                  className="w-full neo-border px-4 py-2 text-neo-black font-bold"
                  placeholder="40.7128"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">
                  Longitude *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={waypoint.longitude}
                  onChange={(e) => handleChange('longitude', e.target.value)}
                  className="w-full neo-border px-4 py-2 text-neo-black font-bold"
                  placeholder="-74.0060"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">
                  Altitude (m) *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={waypoint.altitude}
                  onChange={(e) => handleChange('altitude', e.target.value)}
                  className="w-full neo-border px-4 py-2 text-neo-black font-bold"
                  placeholder="100"
                />
              </div>
            </div>
          </div>

          {/* Flight Parameters */}
          <div className="neo-border p-4 bg-neo-blue">
            <h3 className="text-xl font-black text-neo-black mb-4">FLIGHT PARAMETERS</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">
                  Command Type
                </label>
                <select
                  value={waypoint.command}
                  onChange={(e) => handleChange('command', e.target.value)}
                  className="w-full neo-border px-4 py-2 text-neo-black font-bold"
                >
                  <option value="WAYPOINT">Waypoint</option>
                  <option value="TAKEOFF">Takeoff</option>
                  <option value="LAND">Land</option>
                  <option value="LOITER_TIME">Loiter Time</option>
                  <option value="LOITER_UNLIMITED">Loiter Unlimited</option>
                  <option value="RTL">Return to Launch</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">
                  Speed (m/s)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={waypoint.speed}
                  onChange={(e) => handleChange('speed', e.target.value)}
                  className="w-full neo-border px-4 py-2 text-neo-black font-bold"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">
                  Heading (deg)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="360"
                  value={waypoint.heading}
                  onChange={(e) => handleChange('heading', e.target.value)}
                  className="w-full neo-border px-4 py-2 text-neo-black font-bold"
                  placeholder="0-360"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">
                  Delay (sec)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={waypoint.delay}
                  onChange={(e) => handleChange('delay', e.target.value)}
                  className="w-full neo-border px-4 py-2 text-neo-black font-bold"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">
                  Accept Radius (m)
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={waypoint.acceptanceRadius}
                  onChange={(e) => handleChange('acceptanceRadius', e.target.value)}
                  className="w-full neo-border px-4 py-2 text-neo-black font-bold"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">
                  Auto Continue
                </label>
                <select
                  value={waypoint.autocontinue}
                  onChange={(e) => handleChange('autocontinue', parseInt(e.target.value))}
                  className="w-full neo-border px-4 py-2 text-neo-black font-bold"
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Camera Control */}
          <div className="neo-border p-4 bg-neo-green">
            <h3 className="text-xl font-black text-neo-black mb-4">CAMERA CONTROL</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">
                  Camera Action
                </label>
                <select
                  value={waypoint.cameraAction}
                  onChange={(e) => handleChange('cameraAction', e.target.value)}
                  className="w-full neo-border px-4 py-2 text-neo-black font-bold"
                >
                  <option value="NONE">None</option>
                  <option value="TAKE_PHOTO">Take Photo</option>
                  <option value="START_VIDEO">Start Video</option>
                  <option value="STOP_VIDEO">Stop Video</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">
                  Camera Pitch (deg)
                </label>
                <input
                  type="number"
                  step="1"
                  min="-90"
                  max="90"
                  value={waypoint.cameraPitch}
                  onChange={(e) => handleChange('cameraPitch', e.target.value)}
                  className="w-full neo-border px-4 py-2 text-neo-black font-bold"
                  placeholder="-90 to 90"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 neo-border px-8 py-4 bg-neo-green text-neo-black text-lg font-black hover:bg-neo-yellow shadow-brutal hover:shadow-brutal-lg transition-all duration-300"
            >
              ADD WAYPOINT
            </button>
            <button
              type="button"
              onClick={onClose}
              className="neo-border px-8 py-4 bg-red-500 text-white text-lg font-black hover:bg-red-600 shadow-brutal hover:shadow-brutal-lg transition-all duration-300"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvancedWaypointForm;
