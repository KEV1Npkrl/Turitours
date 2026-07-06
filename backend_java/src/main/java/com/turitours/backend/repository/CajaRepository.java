package com.turitours.backend.repository;

import com.turitours.backend.entity.Caja;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CajaRepository extends JpaRepository<Caja, Integer> {
    Optional<Caja> findFirstByAgenciaIdAndEstado(Integer agenciaId, String estado);
    List<Caja> findByAgenciaIdOrderByAbiertaAtDesc(Integer agenciaId);
}
