package com.turitours.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "pagos")
public class Pago {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "agencia_id", nullable = false)
    private Integer agenciaId;
    
    @Column(name = "caja_id", nullable = false)
    private Integer cajaId;
    
    @Column(name = "reserva_id")
    private Integer reservaId;
    
    @Column(name = "cajero_id", nullable = false)
    private Integer cajeroId;
    
    @Column(nullable = false)
    private String tipo;
    
    @Column(nullable = false)
    private String metodo;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;
    
    @Column(name = "monto_recibido", precision = 10, scale = 2)
    private BigDecimal montoRecibido;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal vuelto;
    
    @Column(length = 200)
    private String concepto;
    
    @Column(name = "comprobante_ref", length = 100)
    private String comprobanteRef;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agencia_id", insertable = false, updatable = false)
    private Agencia agencia;
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caja_id", insertable = false, updatable = false)
    private Caja caja;
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cajero_id", insertable = false, updatable = false)
    private Usuario cajero;
}
