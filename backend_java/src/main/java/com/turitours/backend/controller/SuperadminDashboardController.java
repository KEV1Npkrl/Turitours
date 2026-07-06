package com.turitours.backend.controller;

import com.turitours.backend.repository.AgenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/superadmin/dashboard")
@CrossOrigin(origins = "*")
public class SuperadminDashboardController {

    @Autowired
    private AgenciaRepository agenciaRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long agenciasActivas = agenciaRepository.findAll().stream()
                .filter(a -> "activa".equals(a.getEstado()))
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("agencias_activas", agenciasActivas);
        stats.put("transacciones_mes", 0); // Mock for now
        stats.put("ingresos_mes", 0.0); // Mock for now
        
        return ResponseEntity.ok(stats);
    }
}
