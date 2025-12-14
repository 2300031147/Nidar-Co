package com.nidar.drone.service;

import com.nidar.drone.model.Telemetry;
import com.nidar.drone.model.Waypoint;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.Socket;
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
    private Socket socket;
    private boolean connected = false;
    private Random random = new Random();
    
    public MAVProxyService(SimpMessagingTemplate messagingTemplate, TelemetryService telemetryService) {
        this.messagingTemplate = messagingTemplate;
        this.telemetryService = telemetryService;
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
            if (socket != null && !socket.isClosed()) {
                socket.close();
            }
            connected = false;
            log.info("Disconnected from MAVProxy");
        } catch (IOException e) {
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
            // In a real implementation, this would send mission commands to MAVProxy
            log.info("Uploading mission with {} waypoints", waypoints.size());
            
            for (Waypoint wp : waypoints) {
                log.info("Waypoint {}: lat={}, lon={}, alt={}", 
                    wp.getSequence(), wp.getLatitude(), wp.getLongitude(), wp.getAltitude());
            }
            
            log.info("Mission uploaded successfully");
            return true;
        } catch (Exception e) {
            log.error("Failed to upload mission", e);
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
