package com.nidar.drone.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "geofence_points")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeofencePoint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Integer sequence;
    private Double latitude;
    private Double longitude;
    private String fenceType; // INCLUSION or EXCLUSION
    
    @ManyToOne
    @JoinColumn(name = "mission_id")
    private Mission mission;
}
