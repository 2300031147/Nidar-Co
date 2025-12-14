import { useState, useEffect } from 'react';
import axios from 'axios';

const VehicleParameters = () => {
  const [parameters, setParameters] = useState([]);
  const [newParam, setNewParam] = useState({ name: '', value: '', description: '' });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  // Common ArduPilot parameters
  const commonParams = [
    { name: 'WPNAV_SPEED', value: '1000', description: 'Waypoint navigation horizontal speed (cm/s)' },
    { name: 'WPNAV_SPEED_UP', value: '250', description: 'Waypoint climb speed (cm/s)' },
    { name: 'WPNAV_SPEED_DN', value: '150', description: 'Waypoint descent speed (cm/s)' },
    { name: 'WPNAV_ACCEL', value: '100', description: 'Waypoint acceleration (cm/s/s)' },
    { name: 'RTL_ALT', value: '10000', description: 'RTL altitude (cm)' },
    { name: 'RTL_SPEED', value: '1000', description: 'RTL horizontal speed (cm/s)' },
    { name: 'LAND_SPEED', value: '50', description: 'Land descent speed (cm/s)' },
    { name: 'ANGLE_MAX', value: '4500', description: 'Maximum lean angle (centidegrees)' },
    { name: 'FENCE_ENABLE', value: '1', description: 'Enable geofence' },
    { name: 'FENCE_TYPE', value: '7', description: 'Geofence type (7=all)' },
    { name: 'FENCE_RADIUS', value: '300', description: 'Geofence radius (meters)' },
    { name: 'FENCE_ALT_MAX', value: '120', description: 'Geofence max altitude (meters)' },
    { name: 'PILOT_SPEED_UP', value: '250', description: 'Pilot climb speed (cm/s)' },
    { name: 'CAM_DURATION', value: '10', description: 'Camera trigger duration (0.1 sec)' },
  ];

  useEffect(() => {
    loadParameters();
  }, []);

  const loadParameters = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/parameters');
      setParameters(response.data);
    } catch (error) {
      console.error('Failed to load parameters:', error);
    }
  };

  const handleAddParam = async () => {
    if (!newParam.name || !newParam.value) {
      alert('Please enter parameter name and value');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/parameters', {
        parameterName: newParam.name,
        parameterValue: newParam.value,
        description: newParam.description
      });
      
      setParameters([...parameters, response.data]);
      setNewParam({ name: '', value: '', description: '' });
      setMessage({ success: true, text: 'Parameter added' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to add parameter:', error);
      setMessage({ success: false, text: 'Failed to add parameter' });
    }
  };

  const handleAddCommon = (param) => {
    setNewParam(param);
  };

  const handleUploadToMP = async () => {
    if (parameters.length === 0) {
      alert('No parameters to upload');
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const response = await axios.post('http://localhost:8080/api/parameters/upload', parameters);
      
      if (response.data.success) {
        setMessage({ 
          success: true, 
          text: `Successfully uploaded ${response.data.count} parameters to Mission Planner/QGC!` 
        });
      }
    } catch (error) {
      setMessage({ 
        success: false, 
        text: error.response?.data?.message || 'Failed to upload parameters' 
      });
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/parameters/${id}`);
      setParameters(parameters.filter(p => p.id !== id));
      setMessage({ success: true, text: 'Parameter deleted' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to delete parameter:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="neo-card bg-neo-yellow">
        <h2 className="text-3xl font-black text-neo-black mb-2">VEHICLE PARAMETERS</h2>
        <p className="text-neo-black font-bold">
          Configure and send parameters to Mission Planner/QGroundControl
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className={`neo-border p-4 ${message.success ? 'bg-neo-green' : 'bg-red-500'}`}>
          <p className={`font-black ${message.success ? 'text-neo-black' : 'text-white'}`}>
            {message.text}
          </p>
        </div>
      )}

      {/* Add New Parameter */}
      <div className="neo-card bg-neo-blue">
        <h3 className="text-2xl font-black text-neo-black mb-4">ADD PARAMETER</h3>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Parameter Name"
            value={newParam.name}
            onChange={(e) => setNewParam({ ...newParam, name: e.target.value })}
            className="neo-border px-4 py-2 text-neo-black font-bold"
          />
          <input
            type="text"
            placeholder="Value"
            value={newParam.value}
            onChange={(e) => setNewParam({ ...newParam, value: e.target.value })}
            className="neo-border px-4 py-2 text-neo-black font-bold"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newParam.description}
            onChange={(e) => setNewParam({ ...newParam, description: e.target.value })}
            className="neo-border px-4 py-2 text-neo-black font-bold"
          />
        </div>
        <button
          onClick={handleAddParam}
          className="w-full neo-border px-6 py-3 bg-neo-green text-neo-black font-black hover:bg-neo-yellow shadow-brutal-sm hover:shadow-brutal transition-all duration-300"
        >
          ADD PARAMETER
        </button>
      </div>

      {/* Common Parameters */}
      <div className="neo-card bg-neo-pink">
        <h3 className="text-2xl font-black text-neo-black mb-4">COMMON PARAMETERS</h3>
        <div className="grid md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
          {commonParams.map((param, index) => (
            <button
              key={index}
              onClick={() => handleAddCommon(param)}
              className="neo-border p-3 bg-neo-white text-left hover:bg-neo-yellow transition-all duration-300"
            >
              <div className="font-black text-neo-black">{param.name}</div>
              <div className="text-sm font-bold text-gray-600">{param.description}</div>
              <div className="text-sm font-bold text-neo-black mt-1">Default: {param.value}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Current Parameters */}
      <div className="neo-card bg-neo-green">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-black text-neo-black">
            CONFIGURED PARAMETERS ({parameters.length})
          </h3>
          <button
            onClick={handleUploadToMP}
            disabled={uploading || parameters.length === 0}
            className="neo-border px-6 py-3 bg-neo-orange text-neo-black font-black hover:bg-neo-yellow shadow-brutal-sm hover:shadow-brutal transition-all duration-300 disabled:opacity-50"
          >
            {uploading ? 'UPLOADING...' : 'UPLOAD TO MP/QGC'}
          </button>
        </div>
        
        {parameters.length === 0 ? (
          <p className="text-neo-black font-bold text-center py-8">
            No parameters configured. Add parameters above.
          </p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {parameters.map((param) => (
              <div key={param.id} className="neo-border bg-neo-white p-4 flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-black text-neo-black text-lg">{param.parameterName}</div>
                  <div className="font-bold text-neo-black">Value: {param.parameterValue}</div>
                  {param.description && (
                    <div className="text-sm font-bold text-gray-600 mt-1">{param.description}</div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(param.id)}
                  className="neo-border px-3 py-1 bg-red-500 text-white font-bold hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="neo-border p-4 bg-neo-purple">
        <h3 className="text-xl font-black text-neo-black mb-2">ℹ️ PARAMETER INFO</h3>
        <ul className="space-y-1 text-neo-black font-bold text-sm">
          <li>• Parameters are vehicle configuration settings</li>
          <li>• Changes are sent to Mission Planner/QGC via MAVLink</li>
          <li>• Mission Planner/QGC will apply them to the drone</li>
          <li>• Some parameters require reboot to take effect</li>
          <li>• Always verify critical parameters before flight</li>
        </ul>
      </div>
    </div>
  );
};

export default VehicleParameters;
