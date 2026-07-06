package com.turitours.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Entity
@Table(name = "turistas")
public class Turista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonProperty("agencia_id")
    @Column(name = "agencia_id", nullable = false)
    private Integer agenciaId;

    @JsonProperty("tipo_doc")
    @Column(name = "tipo_doc", nullable = false)
    private String tipoDoc;

    @Column(length = 20, nullable = false)
    private String documento;

    @Column(length = 60, nullable = false)
    private String nombre;

    @Column(length = 80, nullable = false)
    private String apellidos;

    @Column(length = 120)
    private String email;

    @Column(length = 20)
    private String celular;

    @JsonProperty("fecha_nacimiento")
    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @JsonProperty("pais_id")
    @Column(name = "pais_id")
    private Integer paisId;

    @JsonProperty("restricciones_medicas")
    @Column(name = "restricciones_medicas", columnDefinition = "TEXT")
    private String restriccionesMedicas;

    @JsonProperty("notas_crm")
    @Column(name = "notas_crm", columnDefinition = "TEXT")
    private String notasCrm;

    @Column(length = 20, nullable = false)
    private String segmento = "normal";

    @JsonProperty("password_hash")
    @Column(name = "password_hash")
    private String passwordHash;

    @JsonProperty("email_verificado")
    @Column(name = "email_verificado", nullable = false)
    private Boolean emailVerificado = false;

    @JsonProperty("created_at")
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
