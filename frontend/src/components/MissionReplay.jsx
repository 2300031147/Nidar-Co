import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MapView from './MapView';

const API_URL = 'http://localhost:8080/api';

const MissionReplay = () => {
  const [missions, setMissions] = useState([]);
  const [selectedMission, setSelectedMission] = useState(null);
  const [replayData, setReplayData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const intervalRef = useRef(null);

  useEffect(() => {
    loadMissions();
  }, []);

  useEffect(() => {
    if (selectedMission) {
      loadReplayData(selectedMission.id);
    }
  }, [selectedMission]);

  useEffect(() => {
    if (isPlaying && replayData?.telemetry) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= replayData.telemetry.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, replayData]);

  const loadMissions = async () => {
    try {
      const response = await axios.get(`${API_URL}/mission`);
      setMissions(response.data);
    } catch (error) {
      console.error('Failed to load missions:', error);
    }
  };

  const loadReplayData = async (missionId) => {
    try {
      const response = await axios.get(`${API_URL}/replay/mission/${missionId}`);
      setReplayData(response.data);
      setCurrentIndex(0);
      setIsPlaying(false);
    } catch (error) {
      console.error('Failed to load replay data:', error);
      alert('No telemetry data available for this mission');
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  const handleSeek = (index) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  const getCurrentTelemetry = () => {
    if (replayData?.telemetry && replayData.telemetry[currentIndex]) {
      return replayData.telemetry[currentIndex];
    }
    return null;
  };

  const currentTelemetry = getCurrentTelemetry();
  const statistics = replayData?.statistics;

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <section id="replay" className="py-20 px-4 bg-neo-purple">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-black mb-12 text-center neo-text-shadow">
          🎬 MISSION REPLAY & ANALYTICS
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Mission Selection & Controls */}
          <div className="md:col-span-1">
            <div className="neo-brutal-card p-6 bg-neo-white mb-4">
              <h3 className="text-2xl font-bold mb-4">Select Mission</h3>
              <select
                value={selectedMission?.id || ''}
                onChange={(e) => {
                  const mission = missions.find(m => m.id === parseInt(e.target.value));
                  setSelectedMission(mission);
                }}
                className="neo-input w-full mb-4"
              >
                <option value="">Choose a mission</option>
                {missions.map((mission) => (
                  <option key={mission.id} value={mission.id}>
                    {mission.name}
                  </option>
                ))}
              </select>

              {selectedMission && (
                <div className="neo-brutal-border p-3 bg-neo-yellow">
                  <p className="text-sm text-gray-600">Mission</p>
                  <p className="font-bold">{selectedMission.name}</p>
                  {selectedMission.description && (
                    <p className="text-sm mt-1">{selectedMission.description}</p>
                  )}
                </div>
              )}
            </div>

            {/* Playback Controls */}
            {replayData && (
              <div className="neo-brutal-card p-6 bg-neo-white mb-4">
                <h3 className="text-2xl font-bold mb-4">Playback</h3>
                
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={handlePlayPause}
                    className={`neo-button flex-1 text-white ${
                      isPlaying ? 'bg-neo-orange' : 'bg-neo-green'
                    }`}
                  >
                    {isPlaying ? '⏸ Pause' : '▶ Play'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="neo-button bg-neo-blue text-white flex-1"
                  >
                    ↺ Reset
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block font-bold mb-2">Speed: {playbackSpeed}x</label>
                  <input
                    type="range"
                    min="0.5"
                    max="5"
                    step="0.5"
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="mb-4">
                  <label className="block font-bold mb-2">
                    Progress: {currentIndex + 1} / {replayData.telemetry.length}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={replayData.telemetry.length - 1}
                    value={currentIndex}
                    onChange={(e) => handleSeek(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                {currentTelemetry && (
                  <div className="space-y-2">
                    <div className="neo-brutal-border p-2 bg-neo-yellow">
                      <p className="text-xs text-gray-600">Time</p>
                      <p className="font-bold text-sm">{formatDate(currentTelemetry.timestamp)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="neo-brutal-border p-2 bg-neo-blue">
                        <p className="text-xs">Altitude</p>
                        <p className="font-bold">{currentTelemetry.altitude?.toFixed(1)}m</p>
                      </div>
                      <div className="neo-brutal-border p-2 bg-neo-green">
                        <p className="text-xs">Speed</p>
                        <p className="font-bold">{currentTelemetry.speed?.toFixed(1)}m/s</p>
                      </div>
                      <div className="neo-brutal-border p-2 bg-neo-pink">
                        <p className="text-xs">Battery</p>
                        <p className="font-bold">{currentTelemetry.battery?.toFixed(1)}%</p>
                      </div>
                      <div className="neo-brutal-border p-2 bg-neo-orange">
                        <p className="text-xs">Heading</p>
                        <p className="font-bold">{currentTelemetry.heading}°</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Statistics */}
            {statistics && (
              <div className="neo-brutal-card p-6 bg-neo-white">
                <h3 className="text-2xl font-bold mb-4">📊 Analytics</h3>
                <div className="space-y-2">
                  <div className="neo-brutal-border p-3 bg-neo-yellow">
                    <p className="text-sm text-gray-600">Total Distance</p>
                    <p className="font-bold text-xl">{statistics.totalDistance?.toFixed(0)}m</p>
                  </div>
                  <div className="neo-brutal-border p-3 bg-neo-blue">
                    <p className="text-sm text-gray-600">Max Altitude</p>
                    <p className="font-bold text-xl">{statistics.maxAltitude?.toFixed(1)}m</p>
                  </div>
                  <div className="neo-brutal-border p-3 bg-neo-green">
                    <p className="text-sm text-gray-600">Max Speed</p>
                    <p className="font-bold text-xl">{statistics.maxSpeed?.toFixed(1)}m/s</p>
                  </div>
                  <div className="neo-brutal-border p-3 bg-neo-pink">
                    <p className="text-sm text-gray-600">Avg Speed</p>
                    <p className="font-bold text-xl">{statistics.avgSpeed?.toFixed(1)}m/s</p>
                  </div>
                  <div className="neo-brutal-border p-3 bg-neo-orange">
                    <p className="text-sm text-gray-600">Battery Used</p>
                    <p className="font-bold text-xl">{statistics.batteryUsed?.toFixed(1)}%</p>
                  </div>
                  <div className="neo-brutal-border p-3 bg-neo-purple">
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-bold text-xl">{formatDuration(statistics.duration || 0)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Map Visualization */}
          <div className="md:col-span-2">
            <div className="neo-brutal-card bg-neo-white p-4">
              <h3 className="text-2xl font-bold mb-4">Mission Path</h3>
              {currentTelemetry && (
                <MapView
                  drones={[{
                    id: 'replay',
                    name: 'Replay Position',
                    lastLatitude: currentTelemetry.latitude,
                    lastLongitude: currentTelemetry.longitude,
                    lastAltitude: currentTelemetry.altitude,
                    lastBattery: currentTelemetry.battery,
                    status: currentTelemetry.flightMode,
                    connected: true,
                  }]}
                  waypoints={replayData?.mission?.waypoints || []}
                  center={[currentTelemetry.latitude, currentTelemetry.longitude]}
                  height="700px"
                />
              )}
              {!currentTelemetry && selectedMission && (
                <div className="text-center py-20">
                  <p className="text-2xl font-bold text-gray-400">
                    No telemetry data available
                  </p>
                  <p className="text-gray-500 mt-2">
                    Select a mission with recorded telemetry data
                  </p>
                </div>
              )}
              {!selectedMission && (
                <div className="text-center py-20">
                  <p className="text-2xl font-bold text-gray-400">
                    Select a mission to replay
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionReplay;
