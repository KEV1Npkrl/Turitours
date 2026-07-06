package com.turitours.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "reserva_pasajeros")
@Data
public class ReservaPasajero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserva_id", nullable = false)
    private Reserva reserva;

    @ManyToOne(fetch = FetchType.EAGER) // Eager to fetch turista details for the UI
    @JoinColumn(name = "turista_id", nullable = false)
    private Turista turista;

    @Column(name = "es_titular", nullable = false)
    private Boolean esTitular;

    @Column(name = "asistio", nullable = false)
    private Boolean asistio;
}
