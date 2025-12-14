package com.nidar.drone.repository;

import com.nidar.drone.model.FlightLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FlightLogRepository extends JpaRepository<FlightLog, Long> {
    List<FlightLog> findByOrderByStartTimeDesc();
    List<FlightLog> findByFlightStatus(String status);
    List<FlightLog> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT SUM(f.totalDistance) FROM FlightLog f WHERE f.flightStatus = 'COMPLETED'")
    Double getTotalDistanceFlown();
    
    @Query("SELECT SUM(f.durationSeconds) FROM FlightLog f WHERE f.flightStatus = 'COMPLETED'")
    Long getTotalFlightTime();
    
    @Query("SELECT COUNT(f) FROM FlightLog f WHERE f.flightStatus = 'COMPLETED'")
    Long getCompletedFlightsCount();
}
