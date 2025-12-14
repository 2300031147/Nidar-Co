package com.nidar.drone.repository;

import com.nidar.drone.model.Drone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DroneRepository extends JpaRepository<Drone, Long> {
    List<Drone> findByConnected(Boolean connected);
    List<Drone> findByStatus(String status);
    Drone findBySerialNumber(String serialNumber);
}
