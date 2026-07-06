package com.turitours.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Entity
@Table(name = "usuarios")
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @JsonProperty("agencia_id")
    @Column(name = "agencia_id", nullable = false)
    private Integer agenciaId;
    
    @JsonProperty("rol_id")
    @Column(name = "rol_id", nullable = false)
    private Integer rolId;
    
    @Column(length = 100, nullable = false)
    private String nombre;
    
    @Column(length = 8, nullable = false)
    private String dni;
    
    @Column(length = 120, nullable = false)
    private String email;
    
    @Column(length = 20)
    private String telefono;
    
    @JsonIgnore
    @Column(name = "password_hash", length = 255, nullable = false)
    private String passwordHash;
    
    @JsonProperty("intentos_fallidos")
    @Column(name = "intentos_fallidos", nullable = false)
    private Integer intentosFallidos = 0;
    
    @Column(name = "bloqueado", nullable = false)
    private Boolean bloqueado = false;
    
    @Column(name = "activo", nullable = false)
    private Boolean activo = true;
    
    @JsonProperty("ultimo_login")
    @Column(name = "ultimo_login")
    private LocalDateTime ultimoLogin;
    
    @JsonProperty("created_at")
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agencia_id", insertable = false, updatable = false)
    private Agencia agencia;
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rol_id", insertable = false, updatable = false)
    private Rol rol;
}
