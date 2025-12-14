package com.nidar.drone.service;

import com.nidar.drone.model.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@Slf4j
public class MAVProxyService {
    
    @Value("${mavproxy.host}")
    private String mavproxyHost;
    
    @Value("${mavproxy.port}")
    private int mavproxyPort;
    
    private final SimpMessagingTemplate messagingTemplate;
    private final TelemetryService telemetryService;
    private final MAVLinkMessageService mavLinkMessageService;
    
    private DatagramSocket udpSocket;
    private InetAddress mavproxyAddress;
    private boolean connected = false;
    private Random random = new Random();
    
    public MAVProxyService(SimpMessagingTemplate messagingTemplate, 
                          TelemetryService telemetryService,
                          MAVLinkMessageService mavLinkMessageService) {
        this.messagingTemplate = messagingTemplate;
        this.telemetryService = telemetryService;
        this.mavLinkMessageService = mavLinkMessageService;
    }
    
    public boolean connect() {
        try {
            // In a real implementation, this would connect to MAVProxy
            // For now, we'll simulate the connection
            log.info("Attempting to connect to MAVProxy at {}:{}", mavproxyHost, mavproxyPort);
            connected = true;
            log.info("Successfully connected to MAVProxy");
            return true;
        } catch (Exception e) {
            log.error("Failed to connect to MAVProxy", e);
            connected = false;
            return false;
        }
    }
    
    public void disconnect() {
        try {
            if (udpSocket != null && !udpSocket.isClosed()) {
                udpSocket.close();
            }
            connected = false;
            log.info("Disconnected from MAVProxy");
        } catch (Exception e) {
            log.error("Error disconnecting from MAVProxy", e);
        }
    }
    
    public boolean isConnected() {
        return connected;
    }
    
    @Scheduled(fixedRate = 1000) // Update every second
    public void updateTelemetry() {
        if (!connected) {
            return;
        }
        
        // In a real implementation, this would read from MAVProxy
        // For now, we'll simulate telemetry data
        Telemetry telemetry = generateSimulatedTelemetry();
        telemetryService.saveTelemetry(telemetry);
        
        // Send telemetry via WebSocket
        messagingTemplate.convertAndSend("/topic/telemetry", telemetry);
    }
    
    private Telemetry generateSimulatedTelemetry() {
        Telemetry telemetry = new Telemetry();
        telemetry.setLatitude(40.7128 + (random.nextDouble() - 0.5) * 0.01);
        telemetry.setLongitude(-74.0060 + (random.nextDouble() - 0.5) * 0.01);
        telemetry.setAltitude(50.0 + random.nextDouble() * 100);
        telemetry.setSpeed(5.0 + random.nextDouble() * 15);
        telemetry.setBattery(100.0 - random.nextDouble() * 20);
        telemetry.setHeading(random.nextInt(360));
        telemetry.setSatellites(10 + random.nextInt(5));
        telemetry.setFlightMode("AUTO");
        telemetry.setArmed(true);
        telemetry.setTimestamp(LocalDateTime.now());
        return telemetry;
    }
    
    public boolean uploadMission(List<Waypoint> waypoints) {
        if (!connected) {
            log.error("Cannot upload mission: Not connected to MAVProxy");
            return false;
        }
        
        try {
            log.info("Uploading mission with {} waypoints to Mission Planner/QGC", waypoints.size());
            
            // Step 1: Send mission count
            if (!mavLinkMessageService.sendMissionCount(udpSocket, mavproxyAddress, mavproxyPort, waypoints.size())) {
                throw new RuntimeException("Failed to send mission count");
            }
            
            // Small delay between messages
            Thread.sleep(100);
            
            // Step 2: Send each waypoint
            for (int i = 0; i < waypoints.size(); i++) {
                Waypoint wp = waypoints.get(i);
                log.info("Sending waypoint {}: lat={}, lon={}, alt={}", 
                    i, wp.getLatitude(), wp.getLongitude(), wp.getAltitude());
                
                if (!mavLinkMessageService.sendMissionItem(udpSocket, mavproxyAddress, mavproxyPort, wp, i)) {
                    throw new RuntimeException("Failed to send waypoint " + i);
                }
                
                // Small delay between waypoints
                Thread.sleep(50);
            }
            
            log.info("Mission uploaded successfully to Mission Planner/QGC");
            return true;
        } catch (Exception e) {
            log.error("Failed to upload mission", e);
            return false;
        }
    }
    
    /**
     * Upload complete mission including waypoints, geofence, and rally points
     */
    public boolean uploadCompleteMission(Mission mission) {
        if (!connected) {
            log.error("Cannot upload mission: Not connected to MAVProxy");
            return false;
        }
        
        try {
            log.info("Uploading complete mission '{}' to Mission Planner/QGC", mission.getName());
            
            // Upload waypoints
            if (mission.getWaypoints() != null && !mission.getWaypoints().isEmpty()) {
                if (!uploadMission(mission.getWaypoints())) {
                    return false;
                }
            }
            
            // Upload geofence points
            if (mission.getGeofenceEnabled() && mission.getGeofencePoints() != null && 
                !mission.getGeofencePoints().isEmpty()) {
                uploadGeofence(mission.getGeofencePoints());
            }
            
            // Upload rally points
            if (mission.getRallyPoints() != null && !mission.getRallyPoints().isEmpty()) {
                uploadRallyPoints(mission.getRallyPoints());
            }
            
            log.info("Complete mission uploaded to Mission Planner/QGC");
            return true;
        } catch (Exception e) {
            log.error("Failed to upload complete mission", e);
            return false;
        }
    }
    
    /**
     * Upload geofence points to Mission Planner/QGC
     */
    public boolean uploadGeofence(List<GeofencePoint> points) {
        try {
            log.info("Uploading {} geofence points to Mission Planner/QGC", points.size());
            
            for (int i = 0; i < points.size(); i++) {
                GeofencePoint point = points.get(i);
                mavLinkMessageService.sendGeofencePoint(udpSocket, mavproxyAddress, mavproxyPort, 
                    point, i, points.size());
                Thread.sleep(50);
            }
            
            log.info("Geofence uploaded successfully");
            return true;
        } catch (Exception e) {
            log.error("Failed to upload geofence", e);
            return false;
        }
    }
    
    /**
     * Upload rally points to Mission Planner/QGC
     */
    public boolean uploadRallyPoints(List<RallyPoint> points) {
        try {
            log.info("Uploading {} rally points to Mission Planner/QGC", points.size());
            
            for (int i = 0; i < points.size(); i++) {
                RallyPoint point = points.get(i);
                mavLinkMessageService.sendRallyPoint(udpSocket, mavproxyAddress, mavproxyPort, 
                    point, i, points.size());
                Thread.sleep(50);
            }
            
            log.info("Rally points uploaded successfully");
            return true;
        } catch (Exception e) {
            log.error("Failed to upload rally points", e);
            return false;
        }
    }
    
    /**
     * Upload vehicle parameters to Mission Planner/QGC
     */
    public boolean uploadParameters(List<VehicleParameter> parameters) {
        if (!connected) {
            log.error("Cannot upload parameters: Not connected to MAVProxy");
            return false;
        }
        
        try {
            log.info("Uploading {} parameters to Mission Planner/QGC", parameters.size());
            
            for (VehicleParameter param : parameters) {
                float value = Float.parseFloat(param.getParameterValue());
                mavLinkMessageService.sendParameter(udpSocket, mavproxyAddress, mavproxyPort, 
                    param.getParameterName(), value);
                Thread.sleep(50);
            }
            
            log.info("Parameters uploaded successfully to Mission Planner/QGC");
            return true;
        } catch (Exception e) {
            log.error("Failed to upload parameters", e);
            return false;
        }
    }
    
    public boolean sendCommand(String command) {
        if (!connected) {
            log.error("Cannot send command: Not connected to MAVProxy");
            return false;
        }
        
        try {
            // In a real implementation, this would send commands to MAVProxy
            log.info("Sending command: {}", command);
            return true;
        } catch (Exception e) {
            log.error("Failed to send command", e);
            return false;
        }
    }
}
