package com.turitours.backend.repository;

import com.turitours.backend.entity.CategoriaTour;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoriaTourRepository extends JpaRepository<CategoriaTour, Integer> {
    List<CategoriaTour> findByAgenciaId(Integer agenciaId);
}
