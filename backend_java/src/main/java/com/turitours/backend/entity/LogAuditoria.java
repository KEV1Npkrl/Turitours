package com.turitours.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "logs_auditoria")
public class LogAuditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "agencia_id", nullable = false)
    private Integer agenciaId;

    @Column(name = "usuario_id")
    private Integer usuarioId;

    @Column(length = 80, nullable = false)
    private String accion;

    @Column(name = "tabla_afectada", length = 60, nullable = false)
    private String tablaAfectada;

    @Column(name = "registro_id")
    private Integer registroId;

    @Column(name = "valor_anterior", columnDefinition = "json")
    private String valorAnterior;

    @Column(name = "valor_nuevo", columnDefinition = "json")
    private String valorNuevo;

    @Column(length = 45)
    private String ip;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
