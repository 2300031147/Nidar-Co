package com.nidar.drone.repository;

import com.nidar.drone.model.Telemetry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TelemetryRepository extends JpaRepository<Telemetry, Long> {
    List<Telemetry> findTop100ByOrderByTimestampDesc();
}
