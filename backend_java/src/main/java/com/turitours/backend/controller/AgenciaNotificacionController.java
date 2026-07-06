package com.turitours.backend.controller;

import com.turitours.backend.entity.Notificacion;
import com.turitours.backend.repository.NotificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

@RestController
@RequestMapping("/api/agencia/notificaciones")
@CrossOrigin(origins = "*")
public class AgenciaNotificacionController {

    @Autowired
    private NotificacionRepository notificacionRepository;

    @GetMapping
    public ResponseEntity<List<Notificacion>> getNotificaciones(HttpServletRequest request) {
        Integer agenciaId = 1;
        List<Notificacion> notificaciones = notificacionRepository.findByAgenciaIdOrderByCreatedAtDesc(agenciaId);
        return ResponseEntity.ok(notificaciones);
    }

    @PutMapping("/{id}/leer")
    public ResponseEntity<?> marcarComoLeida(@PathVariable Integer id) {
        return notificacionRepository.findById(id).map(notificacion -> {
            notificacion.setLeida(true);
            notificacionRepository.save(notificacion);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/leer-todas")
    public ResponseEntity<?> marcarTodasComoLeidas(HttpServletRequest request) {
        Integer agenciaId = 1;
        List<Notificacion> notificaciones = notificacionRepository.findByAgenciaIdOrderByCreatedAtDesc(agenciaId);
        for (Notificacion n : notificaciones) {
            if (!n.getLeida()) {
                n.setLeida(true);
                notificacionRepository.save(n);
            }
        }
        return ResponseEntity.ok().build();
    }
}
