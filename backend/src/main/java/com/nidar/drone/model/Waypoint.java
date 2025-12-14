package com.nidar.drone.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "waypoints")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Waypoint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Integer sequence;
    private Double latitude;
    private Double longitude;
    private Double altitude;
    private String command;
    
    @ManyToOne
    @JoinColumn(name = "mission_id")
    private Mission mission;
}
