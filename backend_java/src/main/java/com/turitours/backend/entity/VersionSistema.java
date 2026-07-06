package com.turitours.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "versiones_sistema")
public class VersionSistema {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(length = 20, nullable = false)
    private String version;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    @Column(name = "superadmin_id", nullable = false)
    private Integer superadminId;
    
    @Column(name = "desplegada_at", nullable = false, updatable = false)
    private LocalDateTime desplegadaAt = LocalDateTime.now();
}
