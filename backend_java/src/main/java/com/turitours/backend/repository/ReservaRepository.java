package com.turitours.backend.repository;

import com.turitours.backend.entity.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Integer> {
    List<Reserva> findByAgenciaId(Integer agenciaId);
    List<Reserva> findByTuristaId(Integer turistaId);
    java.util.Optional<Reserva> findByCodigoQr(String codigoQr);
}
