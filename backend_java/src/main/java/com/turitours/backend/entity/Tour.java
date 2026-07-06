package com.turitours.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "tours")
public class Tour {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "agencia_id", nullable = false)
    private Integer agenciaId;
    
    @Column(name = "destino_id", nullable = false)
    private Integer destinoId;
    
    @Column(name = "categoria_id", nullable = false)
    private Integer categoriaId;
    
    @Column(length = 150, nullable = false)
    private String nombre;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    @Column(columnDefinition = "TEXT")
    private String itinerario;
    
    @Column(name = "duracion_horas", nullable = false)
    private Integer duracionHoras = 8;
    
    @Column(name = "cupo_maximo", nullable = false)
    private Integer cupoMaximo;
    
    @Column(nullable = false)
    private String estado = "activo";
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agencia_id", insertable = false, updatable = false)
    private Agencia agencia;
}
