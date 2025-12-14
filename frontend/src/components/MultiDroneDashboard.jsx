import { useState, useEffect } from 'react';
import axios from 'axios';
import MapView from './MapView';

const API_URL = 'http://localhost:8080/api';

const MultiDroneDashboard = () => {
  const [drones, setDrones] = useState([]);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDrone, setNewDrone] = useState({
    name: '',
    serialNumber: '',
    model: '',
    mavproxyHost: 'localhost',
    mavproxyPort: 14550,
  });

  useEffect(() => {
    loadDrones();
    const interval = setInterval(loadDrones, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDrones = async () => {
    try {
      const response = await axios.get(`${API_URL}/drones`);
      setDrones(response.data);
      
      // If no drone is selected, select the first one
      if (!selectedDrone && response.data.length > 0) {
        setSelectedDrone(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to load drones:', error);
    }
  };

  const handleAddDrone = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/drones`, newDrone);
      setNewDrone({
        name: '',
        serialNumber: '',
        model: '',
        mavproxyHost: 'localhost',
        mavproxyPort: 14550,
      });
      setShowAddForm(false);
      loadDrones();
      alert('Drone added successfully!');
    } catch (error) {
      console.error('Failed to add drone:', error);
      alert('Failed to add drone');
    }
  };

  const handleDeleteDrone = async (droneId) => {
    if (window.confirm('Are you sure you want to delete this drone?')) {
      try {
        await axios.delete(`${API_URL}/drones/${droneId}`);
        loadDrones();
        if (selectedDrone?.id === droneId) {
          setSelectedDrone(null);
        }
        alert('Drone deleted successfully!');
      } catch (error) {
        console.error('Failed to delete drone:', error);
        alert('Failed to delete drone');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'FLYING': return 'neo-green';
      case 'IDLE': return 'neo-blue';
      case 'MAINTENANCE': return 'neo-orange';
      case 'OFFLINE': return 'neo-gray';
      default: return 'neo-gray';
    }
  };

  return (
    <section id="multi-drone" className="py-20 px-4 bg-neo-pink">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-black mb-12 text-center neo-text-shadow">
          🚁 MULTI-DRONE CONTROL
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Drone List */}
          <div className="md:col-span-1">
            <div className="neo-brutal-card p-6 bg-neo-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">Drones</h3>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="neo-button bg-neo-blue text-white px-4 py-2"
                >
                  {showAddForm ? 'Cancel' : '+ Add'}
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleAddDrone} className="mb-6 neo-brutal-border p-4 bg-neo-yellow">
                  <input
                    type="text"
                    placeholder="Drone Name"
                    value={newDrone.name}
                    onChange={(e) => setNewDrone({ ...newDrone, name: e.target.value })}
                    className="w-full p-2 mb-2 neo-input"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Serial Number"
                    value={newDrone.serialNumber}
                    onChange={(e) => setNewDrone({ ...newDrone, serialNumber: e.target.value })}
                    className="w-full p-2 mb-2 neo-input"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Model"
                    value={newDrone.model}
                    onChange={(e) => setNewDrone({ ...newDrone, model: e.target.value })}
                    className="w-full p-2 mb-2 neo-input"
                    required
                  />
                  <input
                    type="text"
                    placeholder="MAVProxy Host"
                    value={newDrone.mavproxyHost}
                    onChange={(e) => setNewDrone({ ...newDrone, mavproxyHost: e.target.value })}
                    className="w-full p-2 mb-2 neo-input"
                  />
                  <input
                    type="number"
                    placeholder="MAVProxy Port"
                    value={newDrone.mavproxyPort}
                    onChange={(e) => setNewDrone({ ...newDrone, mavproxyPort: parseInt(e.target.value) || 14550 })}
                    className="w-full p-2 mb-2 neo-input"
                  />
                  <button type="submit" className="neo-button bg-neo-green text-white w-full">
                    Add Drone
                  </button>
                </form>
              )}

              <div className="space-y-3">
                {drones.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No drones registered</p>
                ) : (
                  drones.map((drone) => (
                    <div
                      key={drone.id}
                      onClick={() => setSelectedDrone(drone)}
                      className={`neo-brutal-border p-4 cursor-pointer transition-all ${
                        selectedDrone?.id === drone.id ? 'bg-neo-blue' : 'bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg">{drone.name}</h4>
                          <p className="text-sm">{drone.model}</p>
                          <div className="flex items-center mt-2">
                            <span
                              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                drone.connected ? 'bg-green-500' : 'bg-red-500'
                              }`}
                            ></span>
                            <span className="text-sm font-bold">{drone.status}</span>
                          </div>
                          {drone.lastBattery && (
                            <p className="text-sm mt-1">Battery: {drone.lastBattery.toFixed(1)}%</p>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDrone(drone.id);
                          }}
                          className="text-red-600 hover:text-red-800 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Map View */}
          <div className="md:col-span-2">
            <div className="neo-brutal-card bg-neo-white p-4">
              <h3 className="text-2xl font-bold mb-4">Live Map View</h3>
              <MapView 
                drones={drones}
                center={
                  selectedDrone?.lastLatitude && selectedDrone?.lastLongitude
                    ? [selectedDrone.lastLatitude, selectedDrone.lastLongitude]
                    : undefined
                }
                height="500px"
              />
            </div>

            {/* Selected Drone Details */}
            {selectedDrone && (
              <div className="neo-brutal-card bg-neo-white p-6 mt-4">
                <h3 className="text-2xl font-bold mb-4">{selectedDrone.name} Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="neo-brutal-border p-3 bg-neo-yellow">
                    <p className="text-sm text-gray-600">Serial Number</p>
                    <p className="font-bold">{selectedDrone.serialNumber}</p>
                  </div>
                  <div className="neo-brutal-border p-3 bg-neo-blue">
                    <p className="text-sm text-gray-600">Model</p>
                    <p className="font-bold">{selectedDrone.model}</p>
                  </div>
                  <div className="neo-brutal-border p-3 bg-neo-green">
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-bold">{selectedDrone.status}</p>
                  </div>
                  <div className="neo-brutal-border p-3 bg-neo-orange">
                    <p className="text-sm text-gray-600">Connection</p>
                    <p className="font-bold">{selectedDrone.connected ? 'Connected' : 'Disconnected'}</p>
                  </div>
                  {selectedDrone.lastLatitude && (
                    <>
                      <div className="neo-brutal-border p-3 bg-neo-pink">
                        <p className="text-sm text-gray-600">Position</p>
                        <p className="font-bold text-xs">
                          {selectedDrone.lastLatitude.toFixed(6)}, {selectedDrone.lastLongitude.toFixed(6)}
                        </p>
                      </div>
                      <div className="neo-brutal-border p-3 bg-neo-purple">
                        <p className="text-sm text-gray-600">Altitude</p>
                        <p className="font-bold">{selectedDrone.lastAltitude?.toFixed(1)}m</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MultiDroneDashboard;
