package com.turitours.backend.repository;

import com.turitours.backend.entity.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificacionRepository extends JpaRepository<Notificacion, Integer> {
    List<Notificacion> findByTuristaIdOrderByCreatedAtDesc(Integer turistaId);
    List<Notificacion> findByAgenciaIdOrderByCreatedAtDesc(Integer agenciaId);
}
