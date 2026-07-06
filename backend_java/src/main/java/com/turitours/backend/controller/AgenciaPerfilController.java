package com.turitours.backend.controller;

import com.turitours.backend.entity.Agencia;
import com.turitours.backend.repository.AgenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Optional;

@RestController
@RequestMapping("/api/agencia/perfil")
@CrossOrigin(origins = "*")
public class AgenciaPerfilController {

    @Autowired
    private AgenciaRepository agenciaRepository;

    @GetMapping
    public ResponseEntity<?> getPerfil(HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        if (agenciaId == null) return ResponseEntity.status(401).body("No autorizado");

        Optional<Agencia> opt = agenciaRepository.findById(agenciaId);
        if (opt.isPresent()) {
            return ResponseEntity.ok(opt.get());
        }
        return ResponseEntity.status(404).body("Agencia no encontrada");
    }

    @PutMapping
    public ResponseEntity<?> updatePerfil(HttpServletRequest request, @RequestBody Agencia dto) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        if (agenciaId == null) return ResponseEntity.status(401).body("No autorizado");

        Optional<Agencia> opt = agenciaRepository.findById(agenciaId);
        if (opt.isPresent()) {
            Agencia ag = opt.get();
            ag.setNombre(dto.getNombre());
            ag.setRuc(dto.getRuc());
            ag.setTelefono(dto.getTelefono());
            ag.setDireccion(dto.getDireccion());
            ag.setEmail(dto.getEmail());
            // No permitimos actualizar el plan, límite de usuarios, o estado desde este portal.
            return ResponseEntity.ok(agenciaRepository.save(ag));
        }
        return ResponseEntity.status(404).body("Agencia no encontrada");
    }
}
