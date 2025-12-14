package com.nidar.drone.controller;

import com.nidar.drone.model.GeofenceZone;
import com.nidar.drone.service.GeofenceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/geofence")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class GeofenceController {
    
    private final GeofenceService geofenceService;
    
    @GetMapping
    public ResponseEntity<List<GeofenceZone>> getAllZones() {
        return ResponseEntity.ok(geofenceService.getAllZones());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<GeofenceZone> getZoneById(@PathVariable Long id) {
        GeofenceZone zone = geofenceService.getZoneById(id);
        if (zone != null) {
            return ResponseEntity.ok(zone);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/mission/{missionId}")
    public ResponseEntity<List<GeofenceZone>> getZonesByMission(@PathVariable Long missionId) {
        return ResponseEntity.ok(geofenceService.getZonesByMission(missionId));
    }
    
    @PostMapping
    public ResponseEntity<GeofenceZone> createZone(@RequestBody GeofenceZone zone) {
        log.info("Creating geofence zone: {}", zone.getName());
        GeofenceZone created = geofenceService.createZone(zone);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<GeofenceZone> updateZone(@PathVariable Long id, @RequestBody GeofenceZone zone) {
        GeofenceZone updated = geofenceService.updateZone(id, zone);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteZone(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            geofenceService.deleteZone(id);
            response.put("success", true);
            response.put("message", "Geofence zone deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validatePosition(@RequestBody Map<String, Object> request) {
        Double latitude = ((Number) request.get("latitude")).doubleValue();
        Double longitude = ((Number) request.get("longitude")).doubleValue();
        Double altitude = ((Number) request.get("altitude")).doubleValue();
        Long missionId = ((Number) request.get("missionId")).longValue();
        
        Map<String, Object> result = geofenceService.validatePosition(latitude, longitude, altitude, missionId);
        return ResponseEntity.ok(result);
    }
}
