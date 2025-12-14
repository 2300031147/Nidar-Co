package com.nidar.drone.repository;

import com.nidar.drone.model.GeofencePoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GeofencePointRepository extends JpaRepository<GeofencePoint, Long> {
}
