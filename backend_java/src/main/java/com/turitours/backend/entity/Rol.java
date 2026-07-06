package com.turitours.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "roles")
public class Rol {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "agencia_id", nullable = false)
    private Integer agenciaId;
    
    @Column(length = 60, nullable = false)
    private String nombre;
    
    @Column(length = 200)
    private String descripcion;
    
    @Column(name = "activo", nullable = false)
    private Boolean activo = true;
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agencia_id", insertable = false, updatable = false)
    private Agencia agencia;
    
    @OneToMany(mappedBy = "rol", fetch = FetchType.LAZY)
    private java.util.List<Permiso> permisos;
}
