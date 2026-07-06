package com.turitours.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "vehiculos")
public class Vehiculo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "agencia_id", nullable = false)
    private Integer agenciaId;

    @Column(length = 15, nullable = false)
    private String placa;

    @Column(length = 60)
    private String marca;

    @Column(length = 60)
    private String modelo;

    private Integer capacidad;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "soat_vence")
    private LocalDate soatVence;
}
