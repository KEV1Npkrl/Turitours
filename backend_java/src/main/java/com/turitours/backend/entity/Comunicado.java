package com.turitours.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comunicados")
public class Comunicado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "superadmin_id", nullable = false)
    private Integer superadminId;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String cuerpo;

    @Column(nullable = false)
    private String tipo = "informativo";

    @Column(name = "fecha_envio", insertable = false, updatable = false)
    private LocalDateTime fechaEnvio;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getSuperadminId() { return superadminId; }
    public void setSuperadminId(Integer superadminId) { this.superadminId = superadminId; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getCuerpo() { return cuerpo; }
    public void setCuerpo(String cuerpo) { this.cuerpo = cuerpo; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public LocalDateTime getFechaEnvio() { return fechaEnvio; }
}
