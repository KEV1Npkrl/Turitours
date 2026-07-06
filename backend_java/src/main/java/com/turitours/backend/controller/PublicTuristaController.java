package com.turitours.backend.controller;

import com.turitours.backend.entity.Reserva;
import com.turitours.backend.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/turistas")
@CrossOrigin(origins = "*")
public class PublicTuristaController {

    @Autowired
    private ReservaRepository reservaRepository;

    @GetMapping("/{turistaId}/reservas")
    public ResponseEntity<?> getReservasTurista(@PathVariable Integer turistaId) {
        List<Reserva> reservas = reservaRepository.findByTuristaId(turistaId);
        return ResponseEntity.ok(reservas);
    }
}
