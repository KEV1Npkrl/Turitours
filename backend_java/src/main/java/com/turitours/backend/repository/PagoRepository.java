package com.turitours.backend.repository;

import com.turitours.backend.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PagoRepository extends JpaRepository<Pago, Integer> {
    List<Pago> findByCajaIdAndAgenciaIdOrderByCreatedAtDesc(Integer cajaId, Integer agenciaId);
    List<Pago> findByCajaId(Integer cajaId);
}
