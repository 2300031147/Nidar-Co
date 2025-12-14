# System Architecture

## Overview

The Nidar-Co Drone Mission Planning Platform is a full-stack web application built with modern technologies to provide real-time drone control and mission planning capabilities.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                     (React + Tailwind CSS)                      │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Landing    │  │   Services   │  │  Portfolio   │        │
│  │     Page     │  │     Page     │  │     Page     │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────┐      │
│  │              DASHBOARD / MISSION CONTROL             │      │
│  │                                                      │      │
│  │  • Real-time Telemetry Display                      │      │
│  │  • Waypoint Management                              │      │
│  │  • Mission File Upload                              │      │
│  │  • Flight Controls                                  │      │
│  └─────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │ WebSocket (Real-time)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NGINX REVERSE PROXY                        │
│                                                                 │
│  • Route /api/* → Backend                                      │
│  • Route /ws/* → WebSocket                                     │
│  • Route /* → Frontend                                         │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SPRING BOOT BACKEND                          │
│                      (Java 17 + Maven)                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐     │
│  │                    REST API LAYER                     │     │
│  │  ┌──────────────┐        ┌──────────────┐           │     │
│  │  │   Drone      │        │   Mission    │           │     │
│  │  │  Controller  │        │  Controller  │           │     │
│  │  └──────────────┘        └──────────────┘           │     │
│  └──────────────────────────────────────────────────────┘     │
│                            │                                    │
│  ┌──────────────────────────────────────────────────────┐     │
│  │                 BUSINESS LOGIC LAYER                  │     │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │     │
│  │  │  MAVProxy    │  │   Mission    │  │Telemetry │  │     │
│  │  │   Service    │  │   Service    │  │ Service  │  │     │
│  │  └──────────────┘  └──────────────┘  └──────────┘  │     │
│  └──────────────────────────────────────────────────────┘     │
│                            │                                    │
│  ┌──────────────────────────────────────────────────────┐     │
│  │                   DATA ACCESS LAYER                   │     │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │     │
│  │  │  Telemetry   │  │   Mission    │  │ Waypoint │  │     │
│  │  │  Repository  │  │  Repository  │  │Repository│  │     │
│  │  └──────────────┘  └──────────────┘  └──────────┘  │     │
│  └──────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐     │
│  │                 WEBSOCKET HANDLER                     │     │
│  │  • Real-time telemetry broadcast                     │     │
│  │  • 1-second update interval                          │     │
│  └──────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
            │                                     │
            │                                     │
            ▼                                     ▼
┌────────────────────────┐         ┌─────────────────────────────┐
│    MYSQL DATABASE      │         │      MAVPROXY/MAVLINK       │
│                        │         │                             │
│  • drone_mission_db    │         │  • UDP Connection           │
│  • telemetry table     │         │  • Port 14550 (default)     │
│  • missions table      │         │  • MAVLink Protocol         │
│  • waypoints table     │         │  • Drone Commands           │
└────────────────────────┘         └─────────────────────────────┘
                                                │
                                                ▼
                                   ┌─────────────────────────────┐
                                   │   MISSION PLANNER / QGC     │
                                   │                             │
                                   │  • ArduPilot                │
                                   │  • Flight Controller        │
                                   │  • Drone Hardware           │
                                   └─────────────────────────────┘
```

## Component Details

### Frontend (React)

**Technology Stack:**
- React 18+ with Vite
- Tailwind CSS (Neobrutalist theme)
- Axios for HTTP requests
- React Router for navigation

**Key Components:**
1. **Header**: Navigation with smooth scrolling
2. **Hero**: Landing page with call-to-action
3. **About**: Company information and capabilities
4. **Services**: Service offerings and features
5. **Portfolio**: Project showcases and statistics
6. **Dashboard**: Mission control interface
   - Telemetry Display
   - Waypoint Manager
   - Mission Uploader
   - Flight Controls

**Features:**
- Responsive design (mobile, tablet, desktop)
- Smooth scroll animations
- Real-time data updates via WebSocket
- File upload for mission XMLs
- Interactive UI elements

### Backend (Spring Boot)

**Technology Stack:**
- Spring Boot 3.2.0
- Spring Data JPA
- Spring WebSocket
- MySQL Connector
- Maven build system

**API Endpoints:**

**Drone Control:**
- `POST /api/drone/connect` - Establish MAVProxy connection
- `POST /api/drone/disconnect` - Close connection
- `GET /api/drone/status` - Connection and telemetry status
- `GET /api/drone/telemetry` - Historical telemetry data
- `GET /api/drone/telemetry/latest` - Most recent telemetry
- `POST /api/drone/command/{command}` - Send flight commands

**Mission Management:**
- `POST /api/mission` - Create mission with waypoints
- `GET /api/mission` - List all missions
- `GET /api/mission/{id}` - Get specific mission
- `POST /api/mission/{id}/deploy` - Upload to drone
- `POST /api/mission/upload` - Parse XML mission file

**Services:**

1. **MAVProxyService**
   - Manages connection to MAVProxy
   - Sends/receives MAVLink messages
   - Generates simulated telemetry (for testing)
   - Schedules telemetry updates (1-second interval)
   - Uploads missions to flight controller

2. **MissionService**
   - CRUD operations for missions
   - XML file parsing
   - Waypoint management
   - Mission deployment orchestration

3. **TelemetryService**
   - Stores telemetry data
   - Retrieves historical data
   - Provides latest telemetry

### Database (MySQL)

**Schema:**

```sql
-- Telemetry data
CREATE TABLE telemetry (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    latitude DOUBLE,
    longitude DOUBLE,
    altitude DOUBLE,
    speed DOUBLE,
    battery DOUBLE,
    heading INT,
    satellites INT,
    flight_mode VARCHAR(50),
    armed BOOLEAN,
    timestamp DATETIME
);

-- Missions
CREATE TABLE missions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    description TEXT,
    status VARCHAR(50),
    created_at DATETIME,
    deployed_at DATETIME
);

-- Waypoints
CREATE TABLE waypoints (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    sequence INT,
    latitude DOUBLE,
    longitude DOUBLE,
    altitude DOUBLE,
    command VARCHAR(50),
    mission_id BIGINT,
    FOREIGN KEY (mission_id) REFERENCES missions(id)
);
```

### MAVProxy Integration

**Connection Flow:**
1. User clicks "Connect" in dashboard
2. Backend initiates UDP connection to MAVProxy (port 14550)
3. MAVLink handshake established
4. Telemetry stream begins (1Hz default)
5. Backend broadcasts via WebSocket to frontend

**Supported Operations:**
- Read telemetry (GPS, attitude, battery, etc.)
- Upload mission waypoints
- Send flight mode commands
- Trigger arm/disarm
- Initiate takeoff/land

**MAVLink Messages Used:**
- HEARTBEAT
- GPS_RAW_INT
- ATTITUDE
- VFR_HUD
- BATTERY_STATUS
- MISSION_COUNT
- MISSION_ITEM
- COMMAND_LONG

### Docker Deployment

**Services:**

1. **MySQL Container**
   - Image: mysql:8.0
   - Port: 3306
   - Volumes: Persistent data storage
   - Health checks enabled

2. **Backend Container**
   - Built from: backend/Dockerfile
   - Multi-stage build (Maven + JRE)
   - Port: 8080
   - Depends on: MySQL
   - Connects to: host.docker.internal for MAVProxy

3. **Frontend Container**
   - Built from: frontend/Dockerfile
   - Multi-stage build (Node + Nginx)
   - Port: 80
   - Nginx proxies API and WebSocket to backend
   - Serves static React build

**Networking:**
- Custom bridge network: drone-network
- Inter-container communication by service name
- Host network access for MAVProxy connection

## Data Flow

### Telemetry Update Flow

```
MAVProxy → UDP:14550 → Backend:MAVProxyService
                            ↓
                    (Parse MAVLink)
                            ↓
                    Store in MySQL
                            ↓
                    WebSocket Broadcast
                            ↓
                    Frontend Update (1/sec)
```

### Mission Deployment Flow

```
User → Frontend Dashboard
         ↓
    Create Waypoints / Upload XML
         ↓
    POST /api/mission
         ↓
    Backend:MissionService
         ↓
    Save to MySQL
         ↓
    POST /api/mission/{id}/deploy
         ↓
    MAVProxyService.uploadMission()
         ↓
    Send MAVLink MISSION_ITEM messages
         ↓
    Flight Controller receives mission
```

## Security Considerations

1. **Authentication**: Not implemented (add OAuth2/JWT for production)
2. **CORS**: Configured for localhost (restrict in production)
3. **Input Validation**: Basic validation (enhance for production)
4. **SQL Injection**: Protected by JPA/Hibernate
5. **XML Parsing**: Standard library (consider validation)
6. **WebSocket Security**: No auth (add token-based auth)
7. **Secrets**: Environment variables (use vault in production)

## Scalability

**Current Limitations:**
- Single drone connection
- Single backend instance
- No load balancing
- No caching layer

**Future Enhancements:**
- Multi-drone support (connection pool)
- Redis for telemetry caching
- Horizontal scaling with load balancer
- Microservices architecture
- Message queue (RabbitMQ/Kafka) for telemetry

## Monitoring & Logging

**Logging:**
- Spring Boot logs (INFO level)
- MAVProxy communication (DEBUG level)
- Request/Response logging
- Database query logging (development)

**Monitoring Points:**
- API response times
- WebSocket connection count
- Database connection pool
- MAVProxy connection status
- Telemetry update frequency

## Technology Choices

**Why React?**
- Component-based architecture
- Rich ecosystem
- Real-time updates with hooks
- Large community support

**Why Spring Boot?**
- Enterprise-grade framework
- Built-in WebSocket support
- Excellent JPA integration
- Easy to deploy

**Why MySQL?**
- Proven reliability
- Good performance for structured data
- Wide adoption
- Easy Docker deployment

**Why Docker?**
- Consistent environments
- Easy deployment
- Service isolation
- Scalability ready

## Performance Metrics

**Target Performance:**
- API Response Time: < 100ms
- Telemetry Update Latency: < 50ms
- WebSocket Messages: 1/second
- Database Query Time: < 20ms
- Frontend Load Time: < 2s

**Resource Usage:**
- Backend: ~500MB RAM
- Frontend: ~50MB RAM (Nginx)
- MySQL: ~200MB RAM
- Total: ~750MB RAM minimum

## Development Workflow

1. **Local Development**: Run services individually
2. **Testing**: Simulated telemetry for UI testing
3. **Integration**: Docker Compose for full stack
4. **Deployment**: Docker containers to production

---

This architecture provides a solid foundation for drone mission planning with room for future enhancements and scaling.
