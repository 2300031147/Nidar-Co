package com.nidar.drone.repository;

import com.nidar.drone.model.MissionCommand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MissionCommandRepository extends JpaRepository<MissionCommand, Long> {
}
