import { useState, useEffect } from 'react';
import axios from 'axios';
import MapView from './MapView';

const API_URL = 'http://localhost:8080/api';

const GeofenceManager = () => {
  const [zones, setZones] = useState([]);
  const [missions, setMissions] = useState([]);
  const [selectedMission, setSelectedMission] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [newZone, setNewZone] = useState({
    name: '',
    zoneType: 'INCLUSION',
    enabled: true,
    minAltitude: null,
    maxAltitude: null,
    violationAction: 'WARN',
    points: [],
  });
  const [newPoint, setNewPoint] = useState({ latitude: '', longitude: '' });

  useEffect(() => {
    loadMissions();
    loadZones();
  }, []);

  useEffect(() => {
    if (selectedMission) {
      loadZonesByMission(selectedMission.id);
    }
  }, [selectedMission]);

  const loadMissions = async () => {
    try {
      const response = await axios.get(`${API_URL}/mission`);
      setMissions(response.data);
      if (response.data.length > 0 && !selectedMission) {
        setSelectedMission(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to load missions:', error);
    }
  };

  const loadZones = async () => {
    try {
      const response = await axios.get(`${API_URL}/geofence`);
      setZones(response.data);
    } catch (error) {
      console.error('Failed to load zones:', error);
    }
  };

  const loadZonesByMission = async (missionId) => {
    try {
      const response = await axios.get(`${API_URL}/geofence/mission/${missionId}`);
      setZones(response.data);
    } catch (error) {
      console.error('Failed to load zones for mission:', error);
    }
  };

  const handleAddPoint = () => {
    if (newPoint.latitude && newPoint.longitude) {
      const point = {
        latitude: parseFloat(newPoint.latitude),
        longitude: parseFloat(newPoint.longitude),
        sequence: newZone.points.length,
      };
      setNewZone({
        ...newZone,
        points: [...newZone.points, point],
      });
      setNewPoint({ latitude: '', longitude: '' });
    }
  };

  const handleRemovePoint = (index) => {
    const updatedPoints = newZone.points.filter((_, i) => i !== index);
    setNewZone({
      ...newZone,
      points: updatedPoints.map((p, i) => ({ ...p, sequence: i })),
    });
  };

  const handleSaveZone = async (e) => {
    e.preventDefault();
    
    if (newZone.points.length < 3) {
      alert('A geofence zone must have at least 3 points');
      return;
    }

    try {
      const zoneData = {
        ...newZone,
        mission: selectedMission,
      };

      if (editingZone) {
        await axios.put(`${API_URL}/geofence/${editingZone.id}`, zoneData);
        alert('Geofence zone updated successfully!');
      } else {
        await axios.post(`${API_URL}/geofence`, zoneData);
        alert('Geofence zone created successfully!');
      }

      resetForm();
      loadZonesByMission(selectedMission.id);
    } catch (error) {
      console.error('Failed to save zone:', error);
      alert('Failed to save geofence zone');
    }
  };

  const handleEditZone = (zone) => {
    setEditingZone(zone);
    setNewZone({
      name: zone.name,
      zoneType: zone.zoneType,
      enabled: zone.enabled,
      minAltitude: zone.minAltitude,
      maxAltitude: zone.maxAltitude,
      violationAction: zone.violationAction,
      points: zone.points || [],
    });
    setShowAddForm(true);
  };

  const handleDeleteZone = async (zoneId) => {
    if (window.confirm('Are you sure you want to delete this geofence zone?')) {
      try {
        await axios.delete(`${API_URL}/geofence/${zoneId}`);
        loadZonesByMission(selectedMission.id);
        alert('Geofence zone deleted successfully!');
      } catch (error) {
        console.error('Failed to delete zone:', error);
        alert('Failed to delete geofence zone');
      }
    }
  };

  const resetForm = () => {
    setNewZone({
      name: '',
      zoneType: 'INCLUSION',
      enabled: true,
      minAltitude: null,
      maxAltitude: null,
      violationAction: 'WARN',
      points: [],
    });
    setNewPoint({ latitude: '', longitude: '' });
    setEditingZone(null);
    setShowAddForm(false);
  };

  return (
    <section className="min-h-[calc(100vh-88px)] py-20 px-4 bg-neo-green overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-black mb-12 text-center neo-text-shadow">
          🚧 GEOFENCE MANAGER
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Zones List */}
          <div className="md:col-span-1">
            <div className="neo-brutal-card p-6 bg-neo-white">
              <div className="mb-4">
                <label className="block font-bold mb-2">Select Mission</label>
                <select
                  value={selectedMission?.id || ''}
                  onChange={(e) => {
                    const missionId = parseInt(e.target.value);
                    if (!isNaN(missionId)) {
                      const mission = missions.find(m => m.id === missionId);
                      setSelectedMission(mission);
                    }
                  }}
                  className="neo-input w-full"
                >
                  <option value="">Select a mission</option>
                  {missions.map((mission) => (
                    <option key={mission.id} value={mission.id}>
                      {mission.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">Zones</h3>
                <button
                  onClick={() => {
                    resetForm();
                    setShowAddForm(!showAddForm);
                  }}
                  className="neo-button bg-neo-blue text-white px-4 py-2"
                  disabled={!selectedMission}
                >
                  {showAddForm ? 'Cancel' : '+ Add'}
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleSaveZone} className="mb-6 neo-brutal-border p-4 bg-neo-yellow">
                  <input
                    type="text"
                    placeholder="Zone Name"
                    value={newZone.name}
                    onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                    className="w-full p-2 mb-2 neo-input"
                    required
                  />
                  
                  <select
                    value={newZone.zoneType}
                    onChange={(e) => setNewZone({ ...newZone, zoneType: e.target.value })}
                    className="w-full p-2 mb-2 neo-input"
                  >
                    <option value="INCLUSION">Inclusion Zone</option>
                    <option value="EXCLUSION">Exclusion Zone</option>
                  </select>

                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={newZone.enabled}
                      onChange={(e) => setNewZone({ ...newZone, enabled: e.target.checked })}
                      className="mr-2"
                    />
                    <label>Enabled</label>
                  </div>

                  <input
                    type="number"
                    placeholder="Min Altitude (m)"
                    value={newZone.minAltitude || ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setNewZone({ ...newZone, minAltitude: !isNaN(value) ? value : null });
                    }}
                    className="w-full p-2 mb-2 neo-input"
                  />

                  <input
                    type="number"
                    placeholder="Max Altitude (m)"
                    value={newZone.maxAltitude || ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setNewZone({ ...newZone, maxAltitude: !isNaN(value) ? value : null });
                    }}
                    className="w-full p-2 mb-2 neo-input"
                  />

                  <select
                    value={newZone.violationAction}
                    onChange={(e) => setNewZone({ ...newZone, violationAction: e.target.value })}
                    className="w-full p-2 mb-2 neo-input"
                  >
                    <option value="WARN">Warn</option>
                    <option value="RTL">Return to Launch</option>
                    <option value="LAND">Land</option>
                    <option value="BRAKE">Brake</option>
                  </select>

                  <div className="mt-4">
                    <h4 className="font-bold mb-2">Points ({newZone.points.length})</h4>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="number"
                        step="0.000001"
                        placeholder="Latitude"
                        value={newPoint.latitude}
                        onChange={(e) => setNewPoint({ ...newPoint, latitude: e.target.value })}
                        className="flex-1 p-2 neo-input"
                      />
                      <input
                        type="number"
                        step="0.000001"
                        placeholder="Longitude"
                        value={newPoint.longitude}
                        onChange={(e) => setNewPoint({ ...newPoint, longitude: e.target.value })}
                        className="flex-1 p-2 neo-input"
                      />
                      <button
                        type="button"
                        onClick={handleAddPoint}
                        className="neo-button bg-neo-purple text-white px-3"
                      >
                        +
                      </button>
                    </div>
                    <div className="max-h-32 overflow-y-auto">
                      {newZone.points.map((point, index) => (
                        <div key={index} className="flex justify-between items-center p-1 text-sm">
                          <span>
                            {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemovePoint(index)}
                            className="text-red-600 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="neo-button bg-neo-green text-white w-full mt-4">
                    {editingZone ? 'Update Zone' : 'Create Zone'}
                  </button>
                </form>
              )}

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {zones.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No geofence zones</p>
                ) : (
                  zones.map((zone) => (
                    <div
                      key={zone.id}
                      className={`neo-brutal-border p-4 ${
                        zone.zoneType === 'EXCLUSION' ? 'bg-red-100' : 'bg-green-100'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg">{zone.name}</h4>
                          <p className="text-sm">{zone.zoneType}</p>
                          <p className="text-sm">
                            Status: {zone.enabled ? '✅ Enabled' : '❌ Disabled'}
                          </p>
                          {zone.points && <p className="text-sm">{zone.points.length} points</p>}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditZone(zone)}
                            className="text-blue-600 hover:text-blue-800 font-bold"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteZone(zone.id)}
                            className="text-red-600 hover:text-red-800 font-bold"
                          >
                            ×
                          </button>
                        </div>
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
              <h3 className="text-2xl font-bold mb-4">Geofence Visualization</h3>
              <MapView
                waypoints={selectedMission?.waypoints || []}
                geofenceZones={zones}
                height="600px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeofenceManager;
