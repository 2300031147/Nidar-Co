package com.nidar.drone.service;

import com.nidar.drone.model.Telemetry;
import com.nidar.drone.repository.TelemetryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TelemetryService {
    
    private final TelemetryRepository telemetryRepository;
    
    public Telemetry saveTelemetry(Telemetry telemetry) {
        return telemetryRepository.save(telemetry);
    }
    
    public List<Telemetry> getRecentTelemetry() {
        return telemetryRepository.findTop100ByOrderByTimestampDesc();
    }
    
    public Telemetry getLatestTelemetry() {
        List<Telemetry> telemetryList = telemetryRepository.findTop100ByOrderByTimestampDesc();
        return telemetryList.isEmpty() ? null : telemetryList.get(0);
    }
}
