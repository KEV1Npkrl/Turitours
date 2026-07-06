package com.turitours.backend.repository;

import com.turitours.backend.entity.MovimientoInventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimientoInventarioRepository extends JpaRepository<MovimientoInventario, Long> {
    List<MovimientoInventario> findByAgenciaIdOrderByFechaDesc(Long agenciaId);
    List<MovimientoInventario> findByAgenciaIdAndEquipoIdOrderByFechaDesc(Long agenciaId, Long equipoId);
}
