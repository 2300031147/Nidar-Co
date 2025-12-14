# Nidar-Co - Drone Mission Planning Platform

A comprehensive full-stack web application for autonomous drone mission planning and real-time surveillance operations.

## 🚁 Features

### Landing Page (Neobrutalist Design)
- **Hero Section**: Eye-catching neobrutalist design with bold colors and smooth animations
- **About Section**: Company information and mission statement
- **Services**: Detailed overview of drone capabilities
- **Portfolio**: Success stories and project showcases
- **Fully Responsive**: Works seamlessly on all devices

### Mission Control Dashboard
- **Real-time Telemetry**: 1-second update interval for live drone data
  - Altitude, Speed, Battery, GPS coordinates
  - Heading, Satellites, Flight mode
- **Mission Planning**: Intuitive waypoint management
  - Add/remove waypoints with coordinates
  - Visual mission overview
- **File Upload**: Import XML mission files from Mission Planner/QGC
- **Flight Controls**: Arm, Takeoff, Land, Emergency Stop
- **MAVLink Integration**: Direct communication with ArduPilot/QGC via MAVProxy

### Multi-Drone Dashboard
- **Fleet Management**: Register and manage multiple drones
- **Live Tracking**: Real-time position monitoring on interactive map
- **Status Monitoring**: Connection status, battery levels, and flight modes
- **Individual Control**: Select and control specific drones

### Advanced Geofencing
- **Multiple Zones**: Create inclusion and exclusion zones
- **Altitude Constraints**: Set min/max altitude limits per zone
- **Visual Editor**: Draw zones with multiple points on map
- **Violation Actions**: Configure actions (warn, RTL, land, brake)
- **Real-time Validation**: Check drone position against active zones

### Mission Replay & Analytics
- **Telemetry Playback**: Replay missions with timeline controls
- **Speed Control**: Adjust playback speed from 0.5x to 5x
- **Path Visualization**: See complete flight path on map
- **Statistics Dashboard**: Analyze mission performance
  - Total distance traveled
  - Max altitude and speed
  - Battery consumption
  - Flight duration

## 🛠️ Technology Stack

### Frontend
- **React** with Vite
- **Tailwind CSS** (Neobrutalist design system)
- **Axios** for API calls
- **React Router** for navigation
- **Leaflet.js** for interactive maps
- **React-Leaflet** for map components
- Responsive design with smooth animations

### Backend
- **Spring Boot 3.2.0** (Java 17)
- **Spring Data JPA** with Hibernate
- **Spring WebSocket** for real-time updates
- **MySQL** database
- **MAVLink** protocol integration

### Infrastructure
- **Docker** & **Docker Compose**
- **Nginx** reverse proxy
- Multi-stage builds for optimization

## 📦 Project Structure

```
Nidar-Co/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Header.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── backend/               # Spring Boot backend
│   ├── src/main/java/com/nidar/drone/
│   │   ├── controller/   # REST controllers
│   │   ├── service/      # Business logic
│   │   ├── model/        # JPA entities
│   │   ├── repository/   # Data access
│   │   └── config/       # Configuration
│   ├── Dockerfile
│   └── pom.xml
│
└── docker-compose.yml    # Docker orchestration
```

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- Java 17+ (for local development)
- Maven 3.9+ (for local development)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/2300031147/Nidar-Co.git
   cd Nidar-Co
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:8080
   - MySQL: localhost:3307

### Local Development Setup

#### Frontend
```bash
cd frontend
npm install
npm run dev
# Access at http://localhost:5173
```

#### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
# API available at http://localhost:8080
```

#### Database (Docker)
```bash
docker run -d \
  --name drone-mysql \
  -e MYSQL_DATABASE=drone_mission_db \
  -e MYSQL_USER=drone_user \
  -e MYSQL_PASSWORD=drone_password \
  -e MYSQL_ROOT_PASSWORD=root_password \
  -p 3307:3306 \
  mysql:8.0
```

## 🔌 MAVProxy Integration

### Connecting to Mission Planner/QGC

1. **Start MAVProxy** on your system
   ```bash
   mavproxy.py --master=/dev/ttyUSB0 --out=udp:localhost:14550
   ```

2. **Connect through the Dashboard**
   - Click "CONNECT TO DRONE" button
   - Application will establish connection via localhost:14550

3. **Upload Mission**
   - Create waypoints in the dashboard, or
   - Upload XML mission file from Mission Planner/QGC

### Telemetry Data
The system receives and displays:
- GPS position (Latitude, Longitude)
- Altitude (meters)
- Ground speed (m/s)
- Battery level (%)
- Heading (degrees)
- Satellite count
- Flight mode
- Armed status

## 📡 API Endpoints

### Drone Control
- `POST /api/drone/connect` - Connect to MAVProxy
- `POST /api/drone/disconnect` - Disconnect from drone
- `GET /api/drone/status` - Get connection status
- `GET /api/drone/telemetry` - Get recent telemetry data
- `GET /api/drone/telemetry/latest` - Get latest telemetry
- `POST /api/drone/command/{command}` - Send command to drone

### Drone Management (Multi-Drone)
- `GET /api/drones` - Get all registered drones
- `GET /api/drones/{id}` - Get drone by ID
- `POST /api/drones` - Register new drone
- `PUT /api/drones/{id}` - Update drone information
- `DELETE /api/drones/{id}` - Delete drone
- `GET /api/drones/connected` - Get connected drones
- `POST /api/drones/{id}/position` - Update drone position
- `POST /api/drones/{id}/status` - Update drone status

### Mission Management
- `POST /api/mission` - Create new mission
- `GET /api/mission` - Get all missions
- `GET /api/mission/{id}` - Get mission by ID
- `POST /api/mission/{id}/deploy` - Deploy mission to drone
- `POST /api/mission/upload` - Upload mission XML file

### Geofencing
- `GET /api/geofence` - Get all geofence zones
- `GET /api/geofence/{id}` - Get zone by ID
- `GET /api/geofence/mission/{missionId}` - Get zones for mission
- `POST /api/geofence` - Create new geofence zone
- `PUT /api/geofence/{id}` - Update geofence zone
- `DELETE /api/geofence/{id}` - Delete geofence zone
- `POST /api/geofence/validate` - Validate position against zones

### Mission Replay
- `GET /api/replay/mission/{missionId}` - Get mission replay data with analytics
- `GET /api/replay/telemetry/{missionId}` - Get telemetry data for mission

### WebSocket
- `ws://localhost:8080/ws` - Real-time telemetry updates
- Topic: `/topic/telemetry` - Subscribe for telemetry stream

## 🎨 Design System

### Neobrutalist Theme
- **Bold borders**: 4px solid black outlines
- **Brutal shadows**: 8px offset shadows
- **Vibrant colors**: Yellow, Pink, Blue, Green, Orange, Purple
- **Smooth animations**: Hover effects and scroll animations
- **Minimalistic**: Clean, functional design

### Color Palette
```css
neo-yellow: #FFD700
neo-pink: #FF1493
neo-blue: #00BFFF
neo-green: #00FF7F
neo-purple: #9370DB
neo-orange: #FF8C00
neo-black: #000000
neo-white: #FFFFFF
```

## 🔒 Security Notes

- Change default database credentials in production
- Use environment variables for sensitive data
- Enable HTTPS for production deployment
- Implement authentication/authorization as needed
- Validate and sanitize all user inputs

## 📝 Environment Variables

### Backend
```properties
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/drone_mission_db
SPRING_DATASOURCE_USERNAME=drone_user
SPRING_DATASOURCE_PASSWORD=drone_password
MAVPROXY_HOST=localhost
MAVPROXY_PORT=14550
```

### Frontend (Development)
```env
VITE_API_URL=http://localhost:8080
```

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
mvn test
```

## 📈 New Features

- [x] **Map visualization with real-time drone position** - Interactive Leaflet map showing live drone locations
- [x] **Multi-drone support** - Manage and monitor multiple drones simultaneously
- [x] **Advanced geofencing tools** - Create inclusion/exclusion zones with altitude constraints
- [x] **Mission replay and analytics** - Review completed missions with telemetry playback and statistics

## 📈 Future Enhancements

- [ ] Video streaming from drone camera
- [ ] User authentication and roles
- [ ] Mobile app companion
- [ ] 3D mission visualization
- [ ] AI-powered mission optimization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Nidar Co Team

## 📞 Support

For support, email support@nidar.co or open an issue in the repository.

---

**Built with ❤️ for the drone community**