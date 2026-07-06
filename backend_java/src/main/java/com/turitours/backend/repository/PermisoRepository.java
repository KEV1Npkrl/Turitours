package com.turitours.backend.repository;

import com.turitours.backend.entity.Permiso;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PermisoRepository extends JpaRepository<Permiso, Integer> {
    List<Permiso> findByRolId(Integer rolId);
    
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM Permiso p WHERE p.rolId = :rolId")
    void borrarPorRolId(@Param("rolId") Integer rolId);
}
