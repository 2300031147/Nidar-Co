package com.nidar.drone.repository;

import com.nidar.drone.model.GeofenceZone;
import com.nidar.drone.model.Mission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GeofenceZoneRepository extends JpaRepository<GeofenceZone, Long> {
    List<GeofenceZone> findByMission(Mission mission);
    List<GeofenceZone> findByMissionAndEnabled(Mission mission, Boolean enabled);
    List<GeofenceZone> findByZoneType(String zoneType);
}
