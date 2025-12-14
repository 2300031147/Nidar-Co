import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom drone icon
const droneIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxMiIgZmlsbD0iIzAwQkZGRiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMTYgOEwxOSAxNEgxM0wxNiA4WiIgZmlsbD0iI0ZGRkZGRiIvPjwvc3ZnPg==',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

// Component to update map center when drone moves
function MapController({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  
  return null;
}

const MapView = ({ drones = [], waypoints = [], geofenceZones = [], center, zoom = 13, height = '600px' }) => {
  const [selectedDrone, setSelectedDrone] = useState(null);
  const defaultCenter = center || [37.7749, -122.4194]; // Default to San Francisco

  return (
    <div className="w-full neo-brutal-border bg-white" style={{ height }}>
      <MapContainer 
        center={defaultCenter} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Update map center when drone moves */}
        {drones.length > 0 && drones[0].lastLatitude && (
          <MapController center={[drones[0].lastLatitude, drones[0].lastLongitude]} />
        )}
        
        {/* Render drones */}
        {drones.map((drone) => {
          if (drone.lastLatitude && drone.lastLongitude) {
            return (
              <Marker
                key={drone.id}
                position={[drone.lastLatitude, drone.lastLongitude]}
                icon={droneIcon}
                eventHandlers={{
                  click: () => setSelectedDrone(drone),
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg">{drone.name}</h3>
                    <p>Model: {drone.model}</p>
                    <p>Status: {drone.status}</p>
                    <p>Battery: {drone.lastBattery?.toFixed(1)}%</p>
                    <p>Altitude: {drone.lastAltitude?.toFixed(1)}m</p>
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
        
        {/* Render waypoints */}
        {waypoints.map((waypoint, index) => (
          <Marker
            key={waypoint.id || index}
            position={[waypoint.latitude, waypoint.longitude]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">Waypoint {waypoint.sequence || index + 1}</h3>
                <p>Altitude: {waypoint.altitude}m</p>
                {waypoint.speed && <p>Speed: {waypoint.speed}m/s</p>}
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Render waypoint path */}
        {waypoints.length > 1 && (
          <Polyline
            positions={waypoints.map(wp => [wp.latitude, wp.longitude])}
            color="blue"
            weight={3}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}
        
        {/* Render geofence zones */}
        {geofenceZones.map((zone) => {
          if (zone.points && zone.points.length > 2) {
            const positions = zone.points
              .sort((a, b) => a.sequence - b.sequence)
              .map(p => [p.latitude, p.longitude]);
            
            const color = zone.zoneType === 'EXCLUSION' ? 'red' : 'green';
            const fillOpacity = zone.enabled ? 0.2 : 0.1;
            
            return (
              <Polygon
                key={zone.id}
                positions={positions}
                pathOptions={{
                  color: color,
                  weight: 3,
                  fillColor: color,
                  fillOpacity: fillOpacity,
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold">{zone.name}</h3>
                    <p>Type: {zone.zoneType}</p>
                    <p>Status: {zone.enabled ? 'Enabled' : 'Disabled'}</p>
                    {zone.minAltitude && <p>Min Alt: {zone.minAltitude}m</p>}
                    {zone.maxAltitude && <p>Max Alt: {zone.maxAltitude}m</p>}
                  </div>
                </Popup>
              </Polygon>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
