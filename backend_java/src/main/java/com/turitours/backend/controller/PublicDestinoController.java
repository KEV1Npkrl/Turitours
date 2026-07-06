package com.turitours.backend.controller;

import com.turitours.backend.entity.Destino;
import com.turitours.backend.repository.DestinoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/public/destinos")
@CrossOrigin(origins = "*")
public class PublicDestinoController {

    @Autowired
    private DestinoRepository destinoRepository;

    @GetMapping
    public ResponseEntity<?> getDestinos() {
        List<Destino> destinos = destinoRepository.findAll();
        return ResponseEntity.ok(destinos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getDestinoById(@PathVariable Integer id) {
        Optional<Destino> destino = destinoRepository.findById(id);
        if (destino.isPresent()) {
            return ResponseEntity.ok(destino.get());
        }
        return ResponseEntity.status(404).body(java.util.Map.of("error", "Destino no encontrado"));
    }
}
