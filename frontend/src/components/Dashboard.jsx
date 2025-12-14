import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [telemetry, setTelemetry] = useState({
    connected: false,
    latitude: 0,
    longitude: 0,
    altitude: 0,
    speed: 0,
    battery: 100,
    heading: 0,
    satellites: 0,
    mode: 'STABILIZE',
  });
  const [waypoints, setWaypoints] = useState([]);
  const [newWaypoint, setNewWaypoint] = useState({ lat: '', lon: '', alt: '' });
  const [missionFile, setMissionFile] = useState(null);
  const sectionRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Simulated telemetry updates (replace with real WebSocket connection)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate telemetry updates
      setTelemetry((prev) => ({
        ...prev,
        speed: (Math.random() * 15 + 5).toFixed(1),
        altitude: (Math.random() * 100 + 50).toFixed(1),
        battery: Math.max(0, (prev.battery - 0.01).toFixed(1)),
        heading: (prev.heading + 1) % 360,
        satellites: Math.floor(Math.random() * 3) + 10,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleConnect = async () => {
    try {
      // Replace with actual API call
      // const response = await axios.post('http://localhost:8080/api/drone/connect');
      setTelemetry((prev) => ({ ...prev, connected: true }));
      alert('Connected to drone via MAVProxy!');
    } catch (error) {
      console.error('Connection failed:', error);
      alert('Failed to connect. Make sure backend is running.');
    }
  };

  const handleAddWaypoint = () => {
    if (newWaypoint.lat && newWaypoint.lon && newWaypoint.alt) {
      setWaypoints([...waypoints, { ...newWaypoint, id: Date.now() }]);
      setNewWaypoint({ lat: '', lon: '', alt: '' });
    }
  };

  const handleRemoveWaypoint = (id) => {
    setWaypoints(waypoints.filter((wp) => wp.id !== id));
  };

  const handleUploadMission = async () => {
    if (!missionFile) {
      alert('Please select a mission file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', missionFile);

    try {
      // Replace with actual API call
      // const response = await axios.post('http://localhost:8080/api/mission/upload', formData);
      alert('Mission file uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload mission file.');
    }
  };

  const handleDeployMission = async () => {
    if (waypoints.length === 0) {
      alert('Please add waypoints first');
      return;
    }

    try {
      // Replace with actual API call
      // const response = await axios.post('http://localhost:8080/api/mission/deploy', { waypoints });
      alert('Mission deployed to drone!');
    } catch (error) {
      console.error('Deploy failed:', error);
      alert('Failed to deploy mission.');
    }
  };

  return (
    <section ref={sectionRef} id="dashboard" className="min-h-screen bg-gradient-to-br from-neo-purple to-neo-blue py-20">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-6xl md:text-7xl font-black text-neo-white mb-4">
            DASHBOARD
          </h2>
          <div className="neo-border inline-block px-8 py-3 bg-neo-yellow shadow-brutal">
            <p className="text-xl font-bold text-neo-black">
              Mission Control Center
            </p>
          </div>
        </div>

        {/* Connection Status */}
        <div className={`mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="neo-card bg-neo-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full ${telemetry.connected ? 'bg-neo-green' : 'bg-red-500'} animate-pulse`}></div>
                <span className="text-xl font-black text-neo-black">
                  {telemetry.connected ? 'CONNECTED' : 'DISCONNECTED'}
                </span>
              </div>
              <button
                onClick={handleConnect}
                className="neo-border px-8 py-3 bg-neo-green text-neo-black font-black hover:bg-neo-yellow shadow-brutal-sm hover:shadow-brutal transition-all duration-300"
                disabled={telemetry.connected}
              >
                {telemetry.connected ? 'CONNECTED' : 'CONNECT TO DRONE'}
              </button>
            </div>
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {[
            { label: 'Altitude', value: `${telemetry.altitude}m`, icon: '⬆️', color: 'bg-neo-yellow' },
            { label: 'Speed', value: `${telemetry.speed}m/s`, icon: '⚡', color: 'bg-neo-green' },
            { label: 'Battery', value: `${telemetry.battery}%`, icon: '🔋', color: 'bg-neo-orange' },
            { label: 'Satellites', value: telemetry.satellites, icon: '📡', color: 'bg-neo-blue' },
          ].map((item) => (
            <div key={item.label} className={`neo-card ${item.color}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-neo-black mb-1">{item.label}</p>
                  <p className="text-3xl font-black text-neo-black">{item.value}</p>
                </div>
                <div className="text-4xl">{item.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Telemetry */}
        <div className={`neo-card bg-neo-white mb-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-2xl font-black text-neo-black mb-4">DETAILED TELEMETRY</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-bold text-gray-600">Latitude</p>
              <p className="text-xl font-black text-neo-black">{telemetry.latitude.toFixed(6)}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-600">Longitude</p>
              <p className="text-xl font-black text-neo-black">{telemetry.longitude.toFixed(6)}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-600">Heading</p>
              <p className="text-xl font-black text-neo-black">{telemetry.heading}°</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-600">Flight Mode</p>
              <p className="text-xl font-black text-neo-black">{telemetry.mode}</p>
            </div>
          </div>
        </div>

        {/* Mission Planning Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Waypoint Management */}
          <div className={`neo-card bg-neo-pink transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h3 className="text-2xl font-black text-neo-black mb-4">WAYPOINT MANAGEMENT</h3>
            
            <div className="space-y-3 mb-4">
              <input
                type="number"
                placeholder="Latitude"
                value={newWaypoint.lat}
                onChange={(e) => setNewWaypoint({ ...newWaypoint, lat: e.target.value })}
                className="w-full neo-border px-4 py-3 text-neo-black font-bold focus:outline-none focus:shadow-brutal"
              />
              <input
                type="number"
                placeholder="Longitude"
                value={newWaypoint.lon}
                onChange={(e) => setNewWaypoint({ ...newWaypoint, lon: e.target.value })}
                className="w-full neo-border px-4 py-3 text-neo-black font-bold focus:outline-none focus:shadow-brutal"
              />
              <input
                type="number"
                placeholder="Altitude (m)"
                value={newWaypoint.alt}
                onChange={(e) => setNewWaypoint({ ...newWaypoint, alt: e.target.value })}
                className="w-full neo-border px-4 py-3 text-neo-black font-bold focus:outline-none focus:shadow-brutal"
              />
              <button
                onClick={handleAddWaypoint}
                className="w-full neo-border px-6 py-3 bg-neo-green text-neo-black font-black hover:bg-neo-yellow shadow-brutal-sm hover:shadow-brutal transition-all duration-300"
              >
                ADD WAYPOINT
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {waypoints.map((wp, index) => (
                <div key={wp.id} className="neo-border bg-neo-white p-3 flex justify-between items-center shadow-brutal-sm">
                  <div>
                    <span className="font-black text-neo-black">WP{index + 1}:</span>
                    <span className="font-bold text-neo-black ml-2">
                      {wp.lat}, {wp.lon}, {wp.alt}m
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveWaypoint(wp.id)}
                    className="neo-border px-3 py-1 bg-red-500 text-white font-bold hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {waypoints.length === 0 && (
                <p className="text-neo-black font-bold text-center py-4">No waypoints added yet</p>
              )}
            </div>

            <button
              onClick={handleDeployMission}
              className="w-full mt-4 neo-border px-6 py-4 bg-neo-orange text-neo-black text-lg font-black hover:bg-neo-yellow shadow-brutal hover:shadow-brutal-lg transition-all duration-300"
            >
              DEPLOY MISSION
            </button>
          </div>

          {/* Mission File Upload */}
          <div className={`neo-card bg-neo-blue transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <h3 className="text-2xl font-black text-neo-black mb-4">MISSION FILE UPLOAD</h3>
            
            <div className="mb-6">
              <p className="text-neo-black font-bold mb-4">
                Upload XML mission files from Mission Planner or QGroundControl
              </p>
              
              <div
                onClick={() => fileInputRef.current?.click()}
                className="neo-border bg-neo-white p-8 text-center cursor-pointer hover:bg-neo-yellow transition-all duration-300 shadow-brutal-sm hover:shadow-brutal"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xml,.mission"
                  onChange={(e) => setMissionFile(e.target.files[0])}
                  className="hidden"
                />
                <div className="text-6xl mb-4">📁</div>
                <p className="text-neo-black font-black text-lg">
                  {missionFile ? missionFile.name : 'Click to select mission file'}
                </p>
                <p className="text-neo-black font-bold text-sm mt-2">
                  Supported: .xml, .mission
                </p>
              </div>

              <button
                onClick={handleUploadMission}
                disabled={!missionFile}
                className="w-full mt-4 neo-border px-6 py-4 bg-neo-green text-neo-black text-lg font-black hover:bg-neo-yellow shadow-brutal hover:shadow-brutal-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                UPLOAD & PARSE MISSION
              </button>
            </div>

            <div className="neo-border bg-neo-white p-4 shadow-brutal-sm">
              <h4 className="text-lg font-black text-neo-black mb-2">MISSION INFO</h4>
              <div className="space-y-1 text-neo-black font-bold">
                <p>Total Waypoints: {waypoints.length}</p>
                <p>Estimated Duration: {waypoints.length * 2} min</p>
                <p>Status: {telemetry.connected ? 'Ready' : 'Waiting for connection'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className={`mt-8 neo-card bg-neo-yellow transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-2xl font-black text-neo-black mb-4">FLIGHT CONTROLS</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="neo-border px-6 py-4 bg-neo-green text-neo-black font-black hover:bg-neo-white shadow-brutal-sm hover:shadow-brutal transition-all duration-300">
              ARM
            </button>
            <button className="neo-border px-6 py-4 bg-neo-blue text-neo-black font-black hover:bg-neo-white shadow-brutal-sm hover:shadow-brutal transition-all duration-300">
              TAKEOFF
            </button>
            <button className="neo-border px-6 py-4 bg-neo-orange text-neo-black font-black hover:bg-neo-white shadow-brutal-sm hover:shadow-brutal transition-all duration-300">
              LAND
            </button>
            <button className="neo-border px-6 py-4 bg-red-500 text-white font-black hover:bg-red-600 shadow-brutal-sm hover:shadow-brutal transition-all duration-300">
              EMERGENCY STOP
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
