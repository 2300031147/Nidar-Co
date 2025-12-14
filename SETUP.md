# Quick Setup Guide

## 🚀 Docker Deployment (Recommended)

The easiest way to run the entire application:

```bash
# Start all services (MySQL, Backend, Frontend)
docker-compose up -d

# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

Access the application:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/api
- **MySQL**: localhost:3306

## 💻 Local Development

### Prerequisites
- Node.js 20+
- Java 17+
- Maven 3.9+
- MySQL 8.0 (or use Docker for MySQL only)

### 1. Start MySQL Database

```bash
docker run -d \
  --name drone-mysql \
  -e MYSQL_DATABASE=drone_mission_db \
  -e MYSQL_USER=drone_user \
  -e MYSQL_PASSWORD=drone_password \
  -e MYSQL_ROOT_PASSWORD=root_password \
  -p 3306:3306 \
  mysql:8.0
```

### 2. Start Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend API will be available at: http://localhost:8080

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: http://localhost:5173

## 🔌 MAVProxy Connection

### Install MAVProxy (on your system with the drone)

```bash
pip install MAVProxy
```

### Connect to Flight Controller

For serial connection:
```bash
mavproxy.py --master=/dev/ttyUSB0 --out=udp:localhost:14550
```

For network connection:
```bash
mavproxy.py --master=tcp:192.168.1.100:5760 --out=udp:localhost:14550
```

For SITL (Software In The Loop - Testing):
```bash
mavproxy.py --master=tcp:127.0.0.1:5760 --out=udp:localhost:14550
```

### Connect from the Dashboard

1. Open the web application
2. Scroll down to the Dashboard section
3. Click "CONNECT TO DRONE" button
4. The application will connect to MAVProxy at localhost:14550

## 📱 Using the Application

### Landing Page Features

1. **Hero Section**: Introduction to the platform
2. **About**: Company information and capabilities
3. **Services**: Detailed service offerings
4. **Portfolio**: Success stories and statistics
5. **Dashboard**: Mission control center

### Dashboard Features

#### 1. Connection Management
- Connect/Disconnect from drone
- Real-time connection status indicator

#### 2. Telemetry Display
- **Altitude**: Current height above ground
- **Speed**: Ground speed in m/s
- **Battery**: Remaining battery percentage
- **Satellites**: GPS satellite count
- **Detailed Info**: Lat/Long, Heading, Flight Mode

#### 3. Waypoint Management
- Add waypoints with coordinates (lat, lon, alt)
- View all added waypoints
- Remove waypoints
- Deploy mission to drone

#### 4. Mission File Upload
- Upload XML mission files
- Support for Mission Planner & QGroundControl formats
- Automatic parsing and waypoint extraction

#### 5. Flight Controls
- **ARM**: Arm the drone motors
- **TAKEOFF**: Initiate autonomous takeoff
- **LAND**: Land the drone safely
- **EMERGENCY STOP**: Immediate motor stop

## 🧪 Testing Without Hardware

The application includes simulated telemetry for testing without a physical drone:

1. Start the application (frontend + backend)
2. Click "CONNECT TO DRONE"
3. The system will simulate a connection
4. You'll see telemetry data updating every second
5. Try adding waypoints and deploying missions

## 🔧 Configuration

### Backend Configuration
Edit `backend/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/drone_mission_db
spring.datasource.username=drone_user
spring.datasource.password=drone_password

# MAVProxy
mavproxy.host=localhost
mavproxy.port=14550
```

### Frontend Configuration
For production, update the API URL in frontend build:

```javascript
// Create .env file in frontend/
VITE_API_URL=http://your-backend-url:8080
```

## 🐛 Troubleshooting

### Backend won't start
- Check if MySQL is running: `docker ps` or `mysql -u drone_user -p`
- Check port 8080 is not in use: `lsof -i :8080`
- View backend logs for detailed error messages

### Frontend won't connect to backend
- Verify backend is running: `curl http://localhost:8080/api/drone/status`
- Check CORS configuration in backend
- Check browser console for errors

### Can't connect to MAVProxy
- Verify MAVProxy is running with UDP output
- Check the port matches (default: 14550)
- Ensure no firewall is blocking the connection
- Test MAVProxy connection: `netstat -an | grep 14550`

### Docker Issues
- Ensure Docker and Docker Compose are installed
- Check if containers are running: `docker-compose ps`
- View container logs: `docker-compose logs backend` or `frontend`
- Rebuild containers: `docker-compose build --no-cache`

## 📚 API Documentation

### Drone Endpoints

```
POST   /api/drone/connect          - Connect to MAVProxy
POST   /api/drone/disconnect       - Disconnect from drone
GET    /api/drone/status           - Get connection status
GET    /api/drone/telemetry        - Get recent telemetry
GET    /api/drone/telemetry/latest - Get latest telemetry
POST   /api/drone/command/{cmd}    - Send command to drone
```

### Mission Endpoints

```
POST   /api/mission                - Create new mission
GET    /api/mission                - List all missions
GET    /api/mission/{id}           - Get mission by ID
POST   /api/mission/{id}/deploy    - Deploy mission to drone
POST   /api/mission/upload         - Upload XML mission file
```

### WebSocket

```
ws://localhost:8080/ws
Topic: /topic/telemetry
```

Subscribe to receive real-time telemetry updates every second.

## 🎨 UI Features

### Neobrutalist Design
- Bold 4px black borders
- 8px offset brutal shadows
- Vibrant color palette
- Smooth hover animations
- Responsive grid layouts

### Smooth Animations
- Scroll-triggered section reveals
- Hover effects on cards
- Smooth scrolling between sections
- Animated telemetry updates

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Hamburger menu for mobile
- Adaptive grid layouts

## 🔐 Security Notes

**Important for Production:**

1. Change default database credentials
2. Use environment variables for secrets
3. Enable HTTPS/SSL
4. Implement authentication/authorization
5. Add rate limiting to API endpoints
6. Validate all user inputs
7. Sanitize XML file uploads
8. Use secure WebSocket connections (wss://)

## 📈 Next Steps

After initial setup:

1. Test connection with your drone/flight controller
2. Create test missions in Mission Planner/QGC
3. Export and upload mission XML files
4. Test manual waypoint creation
5. Monitor telemetry during test flights
6. Configure geofencing boundaries
7. Set up camera control commands

## 🆘 Support

- Check the main README.md for detailed information
- Review backend logs: `docker-compose logs backend`
- Review frontend console in browser DevTools
- Open an issue on GitHub for bugs
- Check MAVProxy documentation for connection issues

---

Happy Flying! 🚁
