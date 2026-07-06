package com.turitours.backend.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

@Entity
@Table(name = "notificaciones")
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonProperty("agencia_id")
    @Column(name = "agencia_id", nullable = false)
    private Integer agenciaId = 1;

    @JsonProperty("turista_id")
    @Column(name = "turista_id")
    private Integer turistaId;

    @JsonProperty("usuario_id")
    @Column(name = "usuario_id")
    private Integer usuarioId;

    @Column(nullable = false, length = 50)
    private String tipo;

    @Column(nullable = false, length = 120)
    private String destinatario;

    @Column(nullable = false, length = 200)
    private String asunto;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String cuerpo;

    @Column(nullable = false)
    private Boolean enviado = false;

    @JsonProperty("enviado_at")
    @Column(name = "enviado_at")
    private LocalDateTime enviadoAt;

    @Column(length = 300)
    private String error;

    @JsonProperty("created_at")
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getAgenciaId() {
        return agenciaId;
    }

    public void setAgenciaId(Integer agenciaId) {
        this.agenciaId = agenciaId;
    }

    public Integer getTuristaId() {
        return turistaId;
    }

    public void setTuristaId(Integer turistaId) {
        this.turistaId = turistaId;
    }

    public Integer getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Integer usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getDestinatario() {
        return destinatario;
    }

    public void setDestinatario(String destinatario) {
        this.destinatario = destinatario;
    }

    public String getAsunto() {
        return asunto;
    }

    public void setAsunto(String asunto) {
        this.asunto = asunto;
    }

    public String getCuerpo() {
        return cuerpo;
    }

    public void setCuerpo(String cuerpo) {
        this.cuerpo = cuerpo;
    }

    public Boolean getEnviado() {
        return enviado;
    }

    public void setEnviado(Boolean enviado) {
        this.enviado = enviado;
    }

    public LocalDateTime getEnviadoAt() {
        return enviadoAt;
    }

    public void setEnviadoAt(LocalDateTime enviadoAt) {
        this.enviadoAt = enviadoAt;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
