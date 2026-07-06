package com.turitours.backend.repository;

import com.turitours.backend.entity.LogAuditoria;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LogAuditoriaRepository extends JpaRepository<LogAuditoria, Long> {
    List<LogAuditoria> findByAgenciaIdOrderByCreatedAtDesc(Integer agenciaId);
}
