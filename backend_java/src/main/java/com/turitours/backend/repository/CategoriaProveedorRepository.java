package com.turitours.backend.repository;

import com.turitours.backend.entity.CategoriaProveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoriaProveedorRepository extends JpaRepository<CategoriaProveedor, Integer> {
    List<CategoriaProveedor> findByAgenciaId(Integer agenciaId);
}
