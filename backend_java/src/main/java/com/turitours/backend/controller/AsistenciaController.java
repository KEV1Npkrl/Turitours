package com.turitours.backend.controller;

import com.turitours.backend.entity.Reserva;
import com.turitours.backend.entity.ReservaPasajero;
import com.turitours.backend.entity.AsignacionTour;
import com.turitours.backend.repository.ReservaRepository;
import com.turitours.backend.repository.ReservaPasajeroRepository;
import com.turitours.backend.repository.AsignacionTourRepository;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/asistencia")
@CrossOrigin(origins = "*")
public class AsistenciaController {

    @Autowired
    private AsignacionTourRepository asignacionTourRepository;
    
    @Autowired
    private ReservaRepository reservaRepository;
    
    @Autowired
    private ReservaPasajeroRepository reservaPasajeroRepository;



    @GetMapping("/mis-tours")
    public ResponseEntity<?> getMisTours(HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        Integer guiaId = (Integer) request.getAttribute("userId");
        
        List<AsignacionTour> asignaciones = asignacionTourRepository.findByAgenciaIdAndGuiaId(agenciaId, guiaId);
        
        var response = asignaciones.stream().map(a -> {
            Optional<Reserva> resOpt = reservaRepository.findById(a.getReservaId());
            if (resOpt.isPresent()) {
                Reserva r = resOpt.get();
                // Filter only reservations for today (or future if needed), but we return all assigned for simplicity here
                return Map.of(
                    "asignacion_id", a.getId(),
                    "reserva_id", r.getId(),
                    "fecha_servicio", r.getFechaServicio(),
                    "estado_asignacion", a.getEstado(),
                    "pasajeros", r.getNumPersonas()
                );
            }
            return null;
        }).filter(x -> x != null).collect(Collectors.toList());
        
        return ResponseEntity.ok(Map.of("tours", response));
    }

    @PostMapping("/escanear")
    public ResponseEntity<?> escanearQr(HttpServletRequest request, @RequestBody Map<String, String> body) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        String codigoQr = body.get("codigo_qr");
        
        Optional<Reserva> resOpt = reservaRepository.findByCodigoQr(codigoQr);
        if (resOpt.isEmpty() || !resOpt.get().getAgenciaId().equals(agenciaId)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Código QR no válido o no pertenece a esta agencia."));
        }
        
        Reserva reserva = resOpt.get();
        List<ReservaPasajero> pasajeros = reservaPasajeroRepository.findByReservaId(reserva.getId().longValue());
        
        var pasList = pasajeros.stream().map(p -> Map.of(
            "id", p.getId(),
            "nombre", p.getTurista().getNombre() + " " + p.getTurista().getApellidos(),
            "documento", p.getTurista().getDocumento(),
            "es_titular", p.getEsTitular(),
            "asistio", p.getAsistio()
        )).toList();
        
        return ResponseEntity.ok(Map.of(
            "reserva_id", reserva.getId(),
            "pasajeros", pasList
        ));
    }

    @PostMapping("/marcar")
    public ResponseEntity<?> marcarAsistencia(HttpServletRequest request, @RequestBody Map<String, Object> body) {
        try {
            if (body.containsKey("pasajeros_ids")) {
                List<?> rawList = (List<?>) body.get("pasajeros_ids");
                for (Object rawId : rawList) {
                    Long pId;
                    if (rawId instanceof Number) {
                        pId = ((Number) rawId).longValue();
                    } else {
                        pId = Long.parseLong(rawId.toString());
                    }
                    Optional<ReservaPasajero> pOpt = reservaPasajeroRepository.findById(pId);
                    if (pOpt.isPresent()) {
                        ReservaPasajero p = pOpt.get();
                        p.setAsistio(true);
                        reservaPasajeroRepository.save(p);
                    }
                }
            }
            return ResponseEntity.ok(Map.of("success", true, "mensaje", "Asistencia registrada correctamente."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Error al procesar la solicitud."));
        }
    }
}
