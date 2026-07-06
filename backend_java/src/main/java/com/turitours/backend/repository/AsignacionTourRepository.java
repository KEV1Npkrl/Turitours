package com.turitours.backend.repository;

import com.turitours.backend.entity.AsignacionTour;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AsignacionTourRepository extends JpaRepository<AsignacionTour, Integer> {
    List<AsignacionTour> findByAgenciaId(Integer agenciaId);
    List<AsignacionTour> findByAgenciaIdAndGuiaId(Integer agenciaId, Integer guiaId);
}
