package com.turitours.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "categorias_tour")
public class CategoriaTour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "agencia_id", nullable = false)
    private Integer agenciaId;

    @Column(length = 80, nullable = false)
    private String nombre;

    @Column(length = 200)
    private String descripcion;

    @Column(name = "icono_svg", columnDefinition = "TEXT")
    private String iconoSvg;
}
