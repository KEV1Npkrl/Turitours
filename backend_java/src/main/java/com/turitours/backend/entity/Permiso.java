package com.turitours.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "permisos")
public class Permiso {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "rol_id", nullable = false)
    private Integer rolId;
    
    @Column(length = 60, nullable = false)
    private String modulo;
    
    @Column(name = "puede_ver", nullable = false)
    private Integer puedeVer = 0;
    
    @Column(name = "puede_crear", nullable = false)
    private Integer puedeCrear = 0;
    
    @Column(name = "puede_editar", nullable = false)
    private Integer puedeEditar = 0;
    
    @Column(name = "puede_eliminar", nullable = false)
    private Integer puedeEliminar = 0;
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rol_id", insertable = false, updatable = false)
    private Rol rol;
}
