package com.turitours.backend.repository;

import com.turitours.backend.entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TourRepository extends JpaRepository<Tour, Integer> {
    List<Tour> findByAgenciaId(Integer agenciaId);
}
