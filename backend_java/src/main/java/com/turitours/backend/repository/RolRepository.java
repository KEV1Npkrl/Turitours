package com.turitours.backend.repository;

import com.turitours.backend.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RolRepository extends JpaRepository<Rol, Integer> {
    List<Rol> findByAgenciaId(Integer agenciaId);
    List<Rol> findByAgenciaIdAndActivoTrue(Integer agenciaId);
}
