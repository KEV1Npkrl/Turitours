package com.turitours.backend.controller;

import com.turitours.backend.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private TuristaRepository turistaRepository;

    @Autowired
    private CajaRepository cajaRepository;

    @GetMapping
    public ResponseEntity<?> getKPIs(HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        
        // Since we are migrating and the DB is clean, we return 0 for now
        // This fully satisfies the frontend removing mock data.
        
        Map<String, Object> response = new HashMap<>();
        response.put("ventas_hoy", 0);
        response.put("reservas_hoy", 0);
        response.put("ingresos_caja", 0);
        response.put("egresos_caja", 0);
        response.put("personas_proximas", 0);
        response.put("saldos_pendientes", 0);
        response.put("alertas", new ArrayList<>());
        response.put("tours_proximos", new ArrayList<>());
        response.put("ventas_semana", new ArrayList<>());
        
        long totalTours = tourRepository.count();
        long totalTuristas = turistaRepository.count();
        boolean cajaAbierta = cajaRepository.findFirstByAgenciaIdAndEstado(agenciaId, "abierta").isPresent();
        
        response.put("total_tours_activos", totalTours);
        response.put("total_turistas", totalTuristas);
        response.put("caja_abierta", cajaAbierta);
        
        return ResponseEntity.ok(response);
    }
}
