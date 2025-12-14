package com.nidar.drone.service;

import com.nidar.drone.model.Mission;
import com.nidar.drone.model.Waypoint;
import com.nidar.drone.repository.MissionRepository;
import com.nidar.drone.repository.WaypointRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MissionService {
    
    private final MissionRepository missionRepository;
    private final WaypointRepository waypointRepository;
    private final MAVProxyService mavProxyService;
    
    @Transactional
    public Mission createMission(Mission mission) {
        mission.setCreatedAt(LocalDateTime.now());
        mission.setStatus("CREATED");
        
        Mission savedMission = missionRepository.save(mission);
        
        // Set mission reference for waypoints
        if (mission.getWaypoints() != null) {
            for (Waypoint waypoint : mission.getWaypoints()) {
                waypoint.setMission(savedMission);
            }
            waypointRepository.saveAll(mission.getWaypoints());
        }
        
        return savedMission;
    }
    
    public List<Mission> getAllMissions() {
        return missionRepository.findAll();
    }
    
    public Mission getMissionById(Long id) {
        return missionRepository.findById(id).orElse(null);
    }
    
    @Transactional
    public Mission deployMission(Long missionId) {
        Mission mission = missionRepository.findById(missionId)
            .orElseThrow(() -> new RuntimeException("Mission not found"));
        
        if (!mavProxyService.isConnected()) {
            throw new RuntimeException("Not connected to drone");
        }
        
        boolean success = mavProxyService.uploadMission(mission.getWaypoints());
        
        if (success) {
            mission.setStatus("DEPLOYED");
            mission.setDeployedAt(LocalDateTime.now());
            return missionRepository.save(mission);
        } else {
            throw new RuntimeException("Failed to deploy mission");
        }
    }
    
    @Transactional
    public Mission parseMissionFile(MultipartFile file) throws Exception {
        log.info("Parsing mission file: {}", file.getOriginalFilename());
        
        Mission mission = new Mission();
        mission.setName(file.getOriginalFilename());
        mission.setDescription("Imported from file");
        
        List<Waypoint> waypoints = new ArrayList<>();
        
        try (InputStream inputStream = file.getInputStream()) {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document document = builder.parse(inputStream);
            
            // Parse waypoints from XML
            NodeList waypointNodes = document.getElementsByTagName("waypoint");
            
            for (int i = 0; i < waypointNodes.getLength(); i++) {
                Element waypointElement = (Element) waypointNodes.item(i);
                
                Waypoint waypoint = new Waypoint();
                waypoint.setSequence(i);
                waypoint.setLatitude(Double.parseDouble(getElementValue(waypointElement, "lat")));
                waypoint.setLongitude(Double.parseDouble(getElementValue(waypointElement, "lon")));
                waypoint.setAltitude(Double.parseDouble(getElementValue(waypointElement, "alt")));
                waypoint.setCommand(getElementValue(waypointElement, "command"));
                
                waypoints.add(waypoint);
            }
        }
        
        mission.setWaypoints(waypoints);
        log.info("Parsed {} waypoints from mission file", waypoints.size());
        
        return createMission(mission);
    }
    
    private String getElementValue(Element parent, String tagName) {
        NodeList nodeList = parent.getElementsByTagName(tagName);
        if (nodeList.getLength() > 0) {
            return nodeList.item(0).getTextContent();
        }
        return "";
    }
}
