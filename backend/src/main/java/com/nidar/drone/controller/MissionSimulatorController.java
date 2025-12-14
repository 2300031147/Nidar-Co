package com.nidar.drone.controller;

import com.nidar.drone.model.Mission;
import com.nidar.drone.service.MissionService;
import com.nidar.drone.service.MissionSimulatorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/simulator")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class MissionSimulatorController {
    
    private final MissionSimulatorService simulatorService;
    private final MissionService missionService;
    
    @PostMapping("/validate/{missionId}")
    public ResponseEntity<MissionSimulatorService.SimulationResult> validateMission(
            @PathVariable Long missionId) {
        log.info("Validating mission: {}", missionId);
        
        Mission mission = missionService.getMissionById(missionId);
        if (mission == null) {
            return ResponseEntity.notFound().build();
        }
        
        MissionSimulatorService.SimulationResult result = simulatorService.simulateMission(mission);
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/validate")
    public ResponseEntity<MissionSimulatorService.SimulationResult> validateMissionData(
            @RequestBody Mission mission) {
        log.info("Validating mission data");
        
        MissionSimulatorService.SimulationResult result = simulatorService.simulateMission(mission);
        return ResponseEntity.ok(result);
    }
}
