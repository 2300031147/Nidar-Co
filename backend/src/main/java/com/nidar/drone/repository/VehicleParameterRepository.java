package com.nidar.drone.repository;

import com.nidar.drone.model.VehicleParameter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleParameterRepository extends JpaRepository<VehicleParameter, Long> {
    Optional<VehicleParameter> findByParameterName(String parameterName);
}
