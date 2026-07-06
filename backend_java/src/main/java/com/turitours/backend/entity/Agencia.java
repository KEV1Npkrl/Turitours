package com.turitours.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "agencias")
public class Agencia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(length = 120, nullable = false)
    private String nombre;
    
    @Column(length = 11, nullable = false, unique = true)
    private String ruc;
    
    @Column(length = 80, nullable = false)
    private String ciudad = "Tarapoto";
    
    @Column(length = 200)
    private String direccion;
    
    @Column(length = 20)
    private String telefono;
    
    @Column(length = 120)
    private String email;
    
    @Column(length = 300)
    private String logoUrl;
    
    @Column(name = "max_usuarios", nullable = false)
    private Integer maxUsuarios = 3;
    
    @Column(columnDefinition = "json", nullable = false)
    private String modulos;
    
    @Column(nullable = false)
    private String estado = "activa";
    
    @Column(name = "fecha_alta", nullable = false)
    private LocalDate fechaAlta;
    
    @Column(name = "fecha_baja")
    private LocalDate fechaBaja;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
