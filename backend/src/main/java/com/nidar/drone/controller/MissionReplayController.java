package com.nidar.drone.controller;

import com.nidar.drone.model.Telemetry;
import com.nidar.drone.service.MissionReplayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/replay")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class MissionReplayController {
    
    private final MissionReplayService missionReplayService;
    
    @GetMapping("/mission/{missionId}")
    public ResponseEntity<Map<String, Object>> getMissionReplayData(@PathVariable Long missionId) {
        log.info("Getting replay data for mission: {}", missionId);
        Map<String, Object> data = missionReplayService.getMissionReplayData(missionId);
        
        if (data.containsKey("error")) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(data);
    }
    
    @GetMapping("/telemetry/{missionId}")
    public ResponseEntity<List<Telemetry>> getTelemetryByMission(@PathVariable Long missionId) {
        List<Telemetry> telemetry = missionReplayService.getTelemetryByMission(missionId);
        return ResponseEntity.ok(telemetry);
    }
}
