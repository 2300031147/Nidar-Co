package com.nidar.drone.controller;

import com.nidar.drone.model.FlightLog;
import com.nidar.drone.repository.FlightLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class FlightLogController {
    
    private final FlightLogRepository flightLogRepository;
    
    @GetMapping
    public ResponseEntity<List<FlightLog>> getAllLogs() {
        return ResponseEntity.ok(flightLogRepository.findByOrderByStartTimeDesc());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<FlightLog> getLogById(@PathVariable Long id) {
        return flightLogRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<FlightLog>> getLogsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(flightLogRepository.findByFlightStatus(status));
    }
    
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalFlights", flightLogRepository.getCompletedFlightsCount());
        stats.put("totalDistance", flightLogRepository.getTotalDistanceFlown());
        stats.put("totalFlightTime", flightLogRepository.getTotalFlightTime());
        
        List<FlightLog> recentLogs = flightLogRepository.findByOrderByStartTimeDesc();
        if (!recentLogs.isEmpty()) {
            stats.put("lastFlight", recentLogs.get(0));
        }
        
        return ResponseEntity.ok(stats);
    }
    
    @PostMapping
    public ResponseEntity<FlightLog> createLog(@RequestBody FlightLog log) {
        FlightLog saved = flightLogRepository.save(log);
        return ResponseEntity.ok(saved);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<FlightLog> updateLog(@PathVariable Long id, @RequestBody FlightLog log) {
        return flightLogRepository.findById(id)
            .map(existing -> {
                log.setId(id);
                FlightLog updated = flightLogRepository.save(log);
                return ResponseEntity.ok(updated);
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteLog(@PathVariable Long id) {
        flightLogRepository.deleteById(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Flight log deleted");
        
        return ResponseEntity.ok(response);
    }
}
