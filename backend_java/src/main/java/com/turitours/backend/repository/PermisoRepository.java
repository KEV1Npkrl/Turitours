package com.turitours.backend.repository;

import com.turitours.backend.entity.Permiso;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PermisoRepository extends JpaRepository<Permiso, Integer> {
    List<Permiso> findByRolId(Integer rolId);
    void deleteByRolId(Integer rolId);
}
