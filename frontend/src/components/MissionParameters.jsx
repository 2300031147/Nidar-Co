import { useState } from 'react';

const MissionParameters = ({ missionParams, onUpdate }) => {
  const [params, setParams] = useState(missionParams || {
    defaultAltitude: 100,
    defaultSpeed: 10,
    takeoffAltitude: 50,
    rtlAltitude: 100,
    loiterRadius: 50,
    missionType: 'WAYPOINT',
    geofenceEnabled: false,
    maxAltitude: 500,
    maxDistance: 5000,
    cameraEnabled: false,
    photoInterval: 5,
    triggerDistance: 10
  });

  const handleChange = (field, value) => {
    const updated = { ...params, [field]: value };
    setParams(updated);
    onUpdate(updated);
  };

  return (
    <div className="space-y-6">
      {/* Mission Type */}
      <div className="neo-card bg-neo-yellow">
        <h3 className="text-2xl font-black text-neo-black mb-4">MISSION TYPE & DEFAULTS</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-neo-black mb-2">
              Mission Type
            </label>
            <select
              value={params.missionType}
              onChange={(e) => handleChange('missionType', e.target.value)}
              className="w-full neo-border px-4 py-2 text-neo-black font-bold"
            >
              <option value="WAYPOINT">Waypoint Mission</option>
              <option value="SURVEY">Survey/Grid</option>
              <option value="SEARCH">Search Pattern</option>
              <option value="INSPECTION">Inspection</option>
              <option value="DELIVERY">Delivery</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-neo-black mb-2">
              Default Altitude (m)
            </label>
            <input
              type="number"
              step="1"
              min="10"
              value={params.defaultAltitude}
              onChange={(e) => handleChange('defaultAltitude', parseFloat(e.target.value))}
              className="w-full neo-border px-4 py-2 text-neo-black font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-neo-black mb-2">
              Default Speed (m/s)
            </label>
            <input
              type="number"
              step="0.5"
              min="1"
              value={params.defaultSpeed}
              onChange={(e) => handleChange('defaultSpeed', parseFloat(e.target.value))}
              className="w-full neo-border px-4 py-2 text-neo-black font-bold"
            />
          </div>
        </div>
      </div>

      {/* Takeoff & Return */}
      <div className="neo-card bg-neo-blue">
        <h3 className="text-2xl font-black text-neo-black mb-4">TAKEOFF & RETURN SETTINGS</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-neo-black mb-2">
              Takeoff Altitude (m)
            </label>
            <input
              type="number"
              step="1"
              min="10"
              value={params.takeoffAltitude}
              onChange={(e) => handleChange('takeoffAltitude', parseFloat(e.target.value))}
              className="w-full neo-border px-4 py-2 text-neo-black font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-neo-black mb-2">
              RTL Altitude (m)
            </label>
            <input
              type="number"
              step="1"
              min="10"
              value={params.rtlAltitude}
              onChange={(e) => handleChange('rtlAltitude', parseFloat(e.target.value))}
              className="w-full neo-border px-4 py-2 text-neo-black font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-neo-black mb-2">
              Loiter Radius (m)
            </label>
            <input
              type="number"
              step="5"
              min="10"
              value={params.loiterRadius}
              onChange={(e) => handleChange('loiterRadius', parseInt(e.target.value))}
              className="w-full neo-border px-4 py-2 text-neo-black font-bold"
            />
          </div>
        </div>
      </div>

      {/* Geofence */}
      <div className="neo-card bg-neo-pink">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-black text-neo-black">GEOFENCE LIMITS</h3>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={params.geofenceEnabled}
              onChange={(e) => handleChange('geofenceEnabled', e.target.checked)}
              className="w-6 h-6"
            />
            <span className="font-black text-neo-black">ENABLE</span>
          </label>
        </div>
        {params.geofenceEnabled && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-neo-black mb-2">
                Max Altitude (m)
              </label>
              <input
                type="number"
                step="10"
                min="50"
                value={params.maxAltitude}
                onChange={(e) => handleChange('maxAltitude', parseFloat(e.target.value))}
                className="w-full neo-border px-4 py-2 text-neo-black font-bold"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-neo-black mb-2">
                Max Distance (m)
              </label>
              <input
                type="number"
                step="100"
                min="100"
                value={params.maxDistance}
                onChange={(e) => handleChange('maxDistance', parseFloat(e.target.value))}
                className="w-full neo-border px-4 py-2 text-neo-black font-bold"
              />
            </div>
          </div>
        )}
      </div>

      {/* Camera Settings */}
      <div className="neo-card bg-neo-green">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-black text-neo-black">CAMERA SETTINGS</h3>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={params.cameraEnabled}
              onChange={(e) => handleChange('cameraEnabled', e.target.checked)}
              className="w-6 h-6"
            />
            <span className="font-black text-neo-black">ENABLE</span>
          </label>
        </div>
        {params.cameraEnabled && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-neo-black mb-2">
                Photo Interval (sec)
              </label>
              <input
                type="number"
                step="1"
                min="1"
                value={params.photoInterval}
                onChange={(e) => handleChange('photoInterval', parseInt(e.target.value))}
                className="w-full neo-border px-4 py-2 text-neo-black font-bold"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-neo-black mb-2">
                Trigger Distance (m)
              </label>
              <input
                type="number"
                step="1"
                min="1"
                value={params.triggerDistance}
                onChange={(e) => handleChange('triggerDistance', parseFloat(e.target.value))}
                className="w-full neo-border px-4 py-2 text-neo-black font-bold"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionParameters;
