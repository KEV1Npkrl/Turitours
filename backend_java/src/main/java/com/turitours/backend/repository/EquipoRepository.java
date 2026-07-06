package com.turitours.backend.repository;

import com.turitours.backend.entity.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EquipoRepository extends JpaRepository<Equipo, Integer> {
    List<Equipo> findByAgenciaId(Integer agenciaId);
}
