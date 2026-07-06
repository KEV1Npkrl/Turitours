package com.turitours.backend.controller;

import com.turitours.backend.entity.Vehiculo;
import com.turitours.backend.entity.AsignacionTour;
import com.turitours.backend.repository.VehiculoRepository;
import com.turitours.backend.repository.AsignacionTourRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/operaciones")
@CrossOrigin(origins = "*")
public class OperacionesController {

    @Autowired
    private VehiculoRepository vehiculoRepository;

    @Autowired
    private AsignacionTourRepository asignacionTourRepository;

    @GetMapping("/vehiculos")
    public ResponseEntity<?> getVehiculos(HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        List<Vehiculo> vehiculos = vehiculoRepository.findByAgenciaId(agenciaId);
        return ResponseEntity.ok(Map.of("vehiculos", vehiculos));
    }

    @GetMapping("/asignaciones")
    public ResponseEntity<?> getAsignaciones(HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        List<AsignacionTour> asignaciones = asignacionTourRepository.findByAgenciaId(agenciaId);
        return ResponseEntity.ok(Map.of("asignaciones_tour", asignaciones));
    }

    @GetMapping("/mis-tours")
    public ResponseEntity<?> getMisToursOperativos(HttpServletRequest request) {
        // Return empty list since we have no data
        return ResponseEntity.ok(new ArrayList<>());
    }
}
