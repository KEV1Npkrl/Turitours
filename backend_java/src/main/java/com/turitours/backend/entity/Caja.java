package com.turitours.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "cajas")
public class Caja {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "agencia_id", nullable = false)
    private Integer agenciaId;
    
    @Column(name = "cajero_id", nullable = false)
    private Integer cajeroId;
    
    @Column(name = "nombre_caja", length = 60, nullable = false)
    private String nombreCaja = "Caja Principal";
    
    @Column(name = "monto_apertura", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoApertura;
    
    @Column(name = "monto_cierre_sistema", precision = 10, scale = 2)
    private BigDecimal montoCierreSistema;
    
    @Column(name = "monto_cierre_real", precision = 10, scale = 2)
    private BigDecimal montoCierreReal;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal diferencia;
    
    @Column(nullable = false)
    private String estado = "abierta";
    
    @Column(name = "abierta_at", nullable = false, updatable = false)
    private LocalDateTime abiertaAt = LocalDateTime.now();
    
    @Column(name = "cerrada_at")
    private LocalDateTime cerradaAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agencia_id", insertable = false, updatable = false)
    @JsonIgnore
    private Agencia agencia;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cajero_id", insertable = false, updatable = false)
    @JsonIgnore
    private Usuario cajero;
}
