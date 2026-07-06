package com.turitours.backend.repository;

import com.turitours.backend.entity.Destino;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DestinoRepository extends JpaRepository<Destino, Integer> {
    List<Destino> findByAgenciaId(Integer agenciaId);
}
