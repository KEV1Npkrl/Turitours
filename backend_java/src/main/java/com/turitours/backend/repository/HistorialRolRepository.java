package com.turitours.backend.repository;

import com.turitours.backend.entity.HistorialRol;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistorialRolRepository extends JpaRepository<HistorialRol, Integer> {
    java.util.List<HistorialRol> findByUsuarioIdOrderByFechaDesc(Integer usuarioId);
}
