package com.turitours.backend.repository;

import com.turitours.backend.entity.ParametroGlobal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ParametroGlobalRepository extends JpaRepository<ParametroGlobal, Integer> {
    Optional<ParametroGlobal> findByClave(String clave);
}
