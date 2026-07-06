package com.turitours.backend.repository;

import com.turitours.backend.entity.Vehiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VehiculoRepository extends JpaRepository<Vehiculo, Integer> {
    List<Vehiculo> findByAgenciaId(Integer agenciaId);
}
