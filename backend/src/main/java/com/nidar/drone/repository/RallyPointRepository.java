package com.nidar.drone.repository;

import com.nidar.drone.model.RallyPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RallyPointRepository extends JpaRepository<RallyPoint, Long> {
}
