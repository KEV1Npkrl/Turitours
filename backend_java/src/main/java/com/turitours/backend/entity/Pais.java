package com.turitours.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "paises")
public class Pais {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // using Integer for smallint since we don't do short usually

    @Column(length = 80, nullable = false, unique = true)
    private String nombre;
}
