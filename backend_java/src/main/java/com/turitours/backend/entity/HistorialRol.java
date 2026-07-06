package com.turitours.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial_roles")
@Data
public class HistorialRol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "usuario_id", nullable = false)
    private Integer usuarioId;

    @Column(name = "rol_anterior_id")
    private Integer rolAnteriorId;

    @Column(name = "rol_nuevo_id", nullable = false)
    private Integer rolNuevoId;

    @Column(name = "fecha", nullable = false)
    private LocalDateTime fecha = LocalDateTime.now();

    @Column(name = "realizado_por")
    private Integer realizadoPor;
}
