package com.nidar.drone.service;

import com.nidar.drone.model.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.DataOutputStream;
import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.List;

/**
 * Service for creating and sending MAVLink messages to Mission Planner/QGC
 */
@Service
@Slf4j
public class MAVLinkMessageService {
    
    // MAVLink message IDs
    private static final int MAVLINK_MSG_ID_MISSION_COUNT = 44;
    private static final int MAVLINK_MSG_ID_MISSION_ITEM = 39;
    private static final int MAVLINK_MSG_ID_MISSION_ITEM_INT = 73;
    private static final int MAVLINK_MSG_ID_MISSION_CLEAR_ALL = 45;
    private static final int MAVLINK_MSG_ID_MISSION_REQUEST = 40;
    private static final int MAVLINK_MSG_ID_PARAM_SET = 23;
    private static final int MAVLINK_MSG_ID_COMMAND_LONG = 76;
    private static final int MAVLINK_MSG_ID_FENCE_POINT = 160;
    private static final int MAVLINK_MSG_ID_RALLY_POINT = 175;
    
    // MAVLink commands
    private static final int MAV_CMD_NAV_WAYPOINT = 16;
    private static final int MAV_CMD_NAV_TAKEOFF = 22;
    private static final int MAV_CMD_NAV_LAND = 21;
    private static final int MAV_CMD_NAV_LOITER_UNLIM = 17;
    private static final int MAV_CMD_NAV_LOITER_TIME = 19;
    private static final int MAV_CMD_NAV_RETURN_TO_LAUNCH = 20;
    
    private static final byte MAVLINK_STX = (byte) 0xFD; // MAVLink 2.0
    private byte sequenceNumber = 0;
    
    /**
     * Send mission count to Mission Planner/QGC
     */
    public boolean sendMissionCount(DatagramSocket socket, InetAddress address, int port, int count) {
        try {
            ByteBuffer buffer = ByteBuffer.allocate(280);
            buffer.order(ByteOrder.LITTLE_ENDIAN);
            
            // MAVLink header
            buffer.put(MAVLINK_STX);
            buffer.put((byte) 4); // Payload length
            buffer.put((byte) 0); // Incompat flags
            buffer.put((byte) 0); // Compat flags
            buffer.put(sequenceNumber++);
            buffer.put((byte) 1); // System ID
            buffer.put((byte) 1); // Component ID
            buffer.put((byte) (MAVLINK_MSG_ID_MISSION_COUNT & 0xFF));
            buffer.put((byte) ((MAVLINK_MSG_ID_MISSION_COUNT >> 8) & 0xFF));
            buffer.put((byte) ((MAVLINK_MSG_ID_MISSION_COUNT >> 16) & 0xFF));
            
            // Payload
            buffer.putShort((short) count); // Mission count
            buffer.put((byte) 0); // Target system
            buffer.put((byte) 0); // Target component
            
            // CRC (simplified - in production use proper CRC calculation)
            buffer.putShort((short) 0);
            
            byte[] message = new byte[buffer.position()];
            buffer.rewind();
            buffer.get(message);
            
            DatagramPacket packet = new DatagramPacket(message, message.length, address, port);
            socket.send(packet);
            
            log.info("Sent MISSION_COUNT: {} items", count);
            return true;
            
        } catch (IOException e) {
            log.error("Failed to send mission count", e);
            return false;
        }
    }
    
    /**
     * Send mission item to Mission Planner/QGC
     */
    public boolean sendMissionItem(DatagramSocket socket, InetAddress address, int port, 
                                   Waypoint waypoint, int sequence) {
        try {
            ByteBuffer buffer = ByteBuffer.allocate(280);
            buffer.order(ByteOrder.LITTLE_ENDIAN);
            
            // MAVLink header
            buffer.put(MAVLINK_STX);
            buffer.put((byte) 37); // Payload length for MISSION_ITEM_INT
            buffer.put((byte) 0); // Incompat flags
            buffer.put((byte) 0); // Compat flags
            buffer.put(sequenceNumber++);
            buffer.put((byte) 1); // System ID
            buffer.put((byte) 1); // Component ID
            buffer.put((byte) (MAVLINK_MSG_ID_MISSION_ITEM_INT & 0xFF));
            buffer.put((byte) ((MAVLINK_MSG_ID_MISSION_ITEM_INT >> 8) & 0xFF));
            buffer.put((byte) ((MAVLINK_MSG_ID_MISSION_ITEM_INT >> 16) & 0xFF));
            
            // Payload - MISSION_ITEM_INT
            buffer.putFloat(waypoint.getSpeed() != null ? waypoint.getSpeed().floatValue() : 0f); // param1
            buffer.putFloat(waypoint.getAcceptanceRadius() != null ? waypoint.getAcceptanceRadius().floatValue() : 0f); // param2
            buffer.putFloat(waypoint.getPassRadius() != null ? waypoint.getPassRadius().floatValue() : 0f); // param3
            buffer.putFloat(waypoint.getYaw() != null ? waypoint.getYaw().floatValue() : 0f); // param4
            buffer.putInt((int) (waypoint.getLatitude() * 1e7)); // x (latitude as int)
            buffer.putInt((int) (waypoint.getLongitude() * 1e7)); // y (longitude as int)
            buffer.putFloat(waypoint.getAltitude().floatValue()); // z (altitude)
            buffer.putShort((short) sequence); // seq
            buffer.putShort((short) getCommandId(waypoint.getCommand())); // command
            buffer.put((byte) 0); // target_system
            buffer.put((byte) 0); // target_component
            buffer.put((byte) (waypoint.getFrame() != null ? waypoint.getFrame() : 3)); // frame (3 = MAV_FRAME_GLOBAL_RELATIVE_ALT)
            buffer.put((byte) (sequence == 0 ? 1 : 0)); // current (1 for first waypoint)
            buffer.put((byte) (waypoint.getAutocontinue() != null ? waypoint.getAutocontinue() : 1)); // autocontinue
            
            // CRC (simplified)
            buffer.putShort((short) 0);
            
            byte[] message = new byte[buffer.position()];
            buffer.rewind();
            buffer.get(message);
            
            DatagramPacket packet = new DatagramPacket(message, message.length, address, port);
            socket.send(packet);
            
            log.info("Sent MISSION_ITEM {}: {} at {},{},{}", 
                sequence, waypoint.getCommand(), waypoint.getLatitude(), 
                waypoint.getLongitude(), waypoint.getAltitude());
            return true;
            
        } catch (IOException e) {
            log.error("Failed to send mission item", e);
            return false;
        }
    }
    
    /**
     * Send parameter value to Mission Planner/QGC
     */
    public boolean sendParameter(DatagramSocket socket, InetAddress address, int port, 
                                 String paramName, float paramValue) {
        try {
            ByteBuffer buffer = ByteBuffer.allocate(280);
            buffer.order(ByteOrder.LITTLE_ENDIAN);
            
            // MAVLink header
            buffer.put(MAVLINK_STX);
            buffer.put((byte) 23); // Payload length for PARAM_SET
            buffer.put((byte) 0);
            buffer.put((byte) 0);
            buffer.put(sequenceNumber++);
            buffer.put((byte) 1);
            buffer.put((byte) 1);
            buffer.put((byte) (MAVLINK_MSG_ID_PARAM_SET & 0xFF));
            buffer.put((byte) ((MAVLINK_MSG_ID_PARAM_SET >> 8) & 0xFF));
            buffer.put((byte) ((MAVLINK_MSG_ID_PARAM_SET >> 16) & 0xFF));
            
            // Payload
            buffer.put((byte) 0); // target_system
            buffer.put((byte) 0); // target_component
            
            // param_id (16 chars, null-padded)
            byte[] paramBytes = new byte[16];
            byte[] nameBytes = paramName.getBytes();
            System.arraycopy(nameBytes, 0, paramBytes, 0, Math.min(nameBytes.length, 16));
            buffer.put(paramBytes);
            
            buffer.putFloat(paramValue); // param_value
            buffer.put((byte) 1); // param_type (1 = MAV_PARAM_TYPE_REAL32)
            
            // CRC
            buffer.putShort((short) 0);
            
            byte[] message = new byte[buffer.position()];
            buffer.rewind();
            buffer.get(message);
            
            DatagramPacket packet = new DatagramPacket(message, message.length, address, port);
            socket.send(packet);
            
            log.info("Sent PARAM_SET: {}={}", paramName, paramValue);
            return true;
            
        } catch (IOException e) {
            log.error("Failed to send parameter", e);
            return false;
        }
    }
    
    /**
     * Send geofence point to Mission Planner/QGC
     */
    public boolean sendGeofencePoint(DatagramSocket socket, InetAddress address, int port,
                                    GeofencePoint point, int sequence, int totalPoints) {
        try {
            ByteBuffer buffer = ByteBuffer.allocate(280);
            buffer.order(ByteOrder.LITTLE_ENDIAN);
            
            // MAVLink header
            buffer.put(MAVLINK_STX);
            buffer.put((byte) 12); // Payload length
            buffer.put((byte) 0);
            buffer.put((byte) 0);
            buffer.put(sequenceNumber++);
            buffer.put((byte) 1);
            buffer.put((byte) 1);
            buffer.put((byte) (MAVLINK_MSG_ID_FENCE_POINT & 0xFF));
            buffer.put((byte) ((MAVLINK_MSG_ID_FENCE_POINT >> 8) & 0xFF));
            buffer.put((byte) ((MAVLINK_MSG_ID_FENCE_POINT >> 16) & 0xFF));
            
            // Payload
            buffer.put((byte) 0); // target_system
            buffer.put((byte) 0); // target_component
            buffer.put((byte) sequence); // idx
            buffer.put((byte) totalPoints); // count
            buffer.putFloat(point.getLatitude().floatValue()); // lat
            buffer.putFloat(point.getLongitude().floatValue()); // lng
            
            // CRC
            buffer.putShort((short) 0);
            
            byte[] message = new byte[buffer.position()];
            buffer.rewind();
            buffer.get(message);
            
            DatagramPacket packet = new DatagramPacket(message, message.length, address, port);
            socket.send(packet);
            
            log.info("Sent FENCE_POINT {}/{}", sequence, totalPoints);
            return true;
            
        } catch (IOException e) {
            log.error("Failed to send geofence point", e);
            return false;
        }
    }
    
    /**
     * Send rally point to Mission Planner/QGC
     */
    public boolean sendRallyPoint(DatagramSocket socket, InetAddress address, int port,
                                 RallyPoint point, int sequence, int totalPoints) {
        try {
            ByteBuffer buffer = ByteBuffer.allocate(280);
            buffer.order(ByteOrder.LITTLE_ENDIAN);
            
            // MAVLink header
            buffer.put(MAVLINK_STX);
            buffer.put((byte) 19); // Payload length
            buffer.put((byte) 0);
            buffer.put((byte) 0);
            buffer.put(sequenceNumber++);
            buffer.put((byte) 1);
            buffer.put((byte) 1);
            buffer.put((byte) (MAVLINK_MSG_ID_RALLY_POINT & 0xFF));
            buffer.put((byte) ((MAVLINK_MSG_ID_RALLY_POINT >> 8) & 0xFF));
            buffer.put((byte) ((MAVLINK_MSG_ID_RALLY_POINT >> 16) & 0xFF));
            
            // Payload
            buffer.put((byte) 0); // target_system
            buffer.put((byte) 0); // target_component
            buffer.put((byte) sequence); // idx
            buffer.put((byte) totalPoints); // count
            buffer.putInt((int) (point.getLatitude() * 1e7)); // lat
            buffer.putInt((int) (point.getLongitude() * 1e7)); // lng
            buffer.putShort(point.getAltitude().shortValue()); // alt
            buffer.putShort(point.getBreakAltitude() != null ? point.getBreakAltitude().shortValue() : 0); // break_alt
            buffer.putShort(point.getLandDirection() != null ? point.getLandDirection().shortValue() : 0); // land_dir
            buffer.put((byte) 0); // flags
            
            // CRC
            buffer.putShort((short) 0);
            
            byte[] message = new byte[buffer.position()];
            buffer.rewind();
            buffer.get(message);
            
            DatagramPacket packet = new DatagramPacket(message, message.length, address, port);
            socket.send(packet);
            
            log.info("Sent RALLY_POINT {}/{}", sequence, totalPoints);
            return true;
            
        } catch (IOException e) {
            log.error("Failed to send rally point", e);
            return false;
        }
    }
    
    /**
     * Send command (ARM, TAKEOFF, etc) to Mission Planner/QGC
     */
    public boolean sendCommand(DatagramSocket socket, InetAddress address, int port,
                              int command, float param1, float param2, float param3, 
                              float param4, float param5, float param6, float param7) {
        try {
            ByteBuffer buffer = ByteBuffer.allocate(280);
            buffer.order(ByteOrder.LITTLE_ENDIAN);
            
            // MAVLink header
            buffer.put(MAVLINK_STX);
            buffer.put((byte) 33); // Payload length for COMMAND_LONG
            buffer.put((byte) 0);
            buffer.put((byte) 0);
            buffer.put(sequenceNumber++);
            buffer.put((byte) 1);
            buffer.put((byte) 1);
            buffer.put((byte) (MAVLINK_MSG_ID_COMMAND_LONG & 0xFF));
            buffer.put((byte) ((MAVLINK_MSG_ID_COMMAND_LONG >> 8) & 0xFF));
            buffer.put((byte) ((MAVLINK_MSG_ID_COMMAND_LONG >> 16) & 0xFF));
            
            // Payload
            buffer.put((byte) 0); // target_system
            buffer.put((byte) 0); // target_component
            buffer.putShort((short) command); // command
            buffer.put((byte) 0); // confirmation
            buffer.putFloat(param1);
            buffer.putFloat(param2);
            buffer.putFloat(param3);
            buffer.putFloat(param4);
            buffer.putFloat(param5);
            buffer.putFloat(param6);
            buffer.putFloat(param7);
            
            // CRC
            buffer.putShort((short) 0);
            
            byte[] message = new byte[buffer.position()];
            buffer.rewind();
            buffer.get(message);
            
            DatagramPacket packet = new DatagramPacket(message, message.length, address, port);
            socket.send(packet);
            
            log.info("Sent COMMAND_LONG: command={}", command);
            return true;
            
        } catch (IOException e) {
            log.error("Failed to send command", e);
            return false;
        }
    }
    
    /**
     * Convert command string to MAVLink command ID
     */
    private int getCommandId(String command) {
        if (command == null) return MAV_CMD_NAV_WAYPOINT;
        
        switch (command.toUpperCase()) {
            case "WAYPOINT": return MAV_CMD_NAV_WAYPOINT;
            case "TAKEOFF": return MAV_CMD_NAV_TAKEOFF;
            case "LAND": return MAV_CMD_NAV_LAND;
            case "LOITER_UNLIMITED": return MAV_CMD_NAV_LOITER_UNLIM;
            case "LOITER_TIME": return MAV_CMD_NAV_LOITER_TIME;
            case "RTL":
            case "RETURN_TO_LAUNCH": return MAV_CMD_NAV_RETURN_TO_LAUNCH;
            default: return MAV_CMD_NAV_WAYPOINT;
        }
    }
}
