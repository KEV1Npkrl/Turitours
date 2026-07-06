package com.turitours.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "equipos")
public class Equipo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "agencia_id", nullable = false)
    private Integer agenciaId;

    @Column(length = 100, nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "cantidad_total", nullable = false)
    private Integer cantidadTotal = 0;

    @Column(name = "cantidad_disponible", nullable = false)
    private Integer cantidadDisponible = 0;

    @Column(length = 20, nullable = false)
    private String estado = "saludable";

    @Column(length = 60)
    private String ubicacion;
}
