package com.turitours.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "asignaciones_tour")
public class AsignacionTour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "agencia_id", nullable = false)
    private Integer agenciaId;

    @Column(name = "reserva_id", nullable = false)
    private Integer reservaId;

    @Column(name = "guia_id")
    private Integer guiaId;

    @Column(name = "vehiculo_id")
    private Integer vehiculoId;

    @Column(length = 20, nullable = false)
    private String estado = "programado";
}
