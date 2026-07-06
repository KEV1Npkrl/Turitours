package com.turitours.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "reservas")
public class Reserva {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "agencia_id", nullable = false)
    private Integer agenciaId;
    
    @Column(name = "tour_id", nullable = false)
    private Integer tourId;
    
    @Column(name = "turista_id", nullable = false)
    private Integer turistaId;
    
    @Column(name = "vendedor_id")
    private Integer vendedorId;
    
    @Column(name = "fecha_servicio", nullable = false)
    private LocalDate fechaServicio;
    
    @Column(name = "hora_recojo")
    private LocalTime horaRecojo;
    
    @Column(name = "lugar_recojo", length = 200)
    private String lugarRecojo;
    
    @Column(name = "num_personas", nullable = false)
    private Integer numPersonas = 1;
    
    @Column(name = "precio_unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal descuento = BigDecimal.ZERO;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;
    
    @Column(name = "saldo_pendiente", nullable = false, precision = 10, scale = 2)
    private BigDecimal saldoPendiente;
    
    @Column(length = 3, nullable = false)
    private String moneda = "PEN";
    
    @Column(nullable = false)
    private String estado = "pendiente";
    
    @Column(name = "codigo_qr", length = 100, unique = true)
    private String codigoQr;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agencia_id", insertable = false, updatable = false)
    private Agencia agencia;
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id", insertable = false, updatable = false)
    private Tour tour;
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendedor_id", insertable = false, updatable = false)
    private Usuario vendedor;
}
