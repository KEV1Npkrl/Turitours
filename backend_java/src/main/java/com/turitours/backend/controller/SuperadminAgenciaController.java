package com.turitours.backend.controller;

import com.turitours.backend.entity.Agencia;
import com.turitours.backend.repository.AgenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/superadmin/agencias")
@CrossOrigin(origins = "*")
public class SuperadminAgenciaController {

    @Autowired
    private AgenciaRepository agenciaRepository;

    @GetMapping
    public ResponseEntity<List<Agencia>> getAllAgencias() {
        return ResponseEntity.ok(agenciaRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createAgencia(@RequestBody Agencia agencia) {
        // En un sistema real se validarían los datos primero
        agencia.setEstado("activa");
        Agencia saved = agenciaRepository.save(agencia);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/toggle-estado")
    public ResponseEntity<?> toggleEstadoAgencia(@PathVariable Integer id) {
        Optional<Agencia> opt = agenciaRepository.findById(id);
        if (opt.isPresent()) {
            Agencia ag = opt.get();
            ag.setEstado("activa".equals(ag.getEstado()) ? "suspendida" : "activa");
            return ResponseEntity.ok(agenciaRepository.save(ag));
        }
        return ResponseEntity.status(404).body("Agencia no encontrada");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAgencia(@PathVariable Integer id, @RequestBody Agencia dto) {
        Optional<Agencia> opt = agenciaRepository.findById(id);
        if (opt.isPresent()) {
            Agencia ag = opt.get();
            ag.setNombre(dto.getNombre());
            ag.setRuc(dto.getRuc());
            ag.setEmail(dto.getEmail());
            ag.setMaxUsuarios(dto.getMaxUsuarios());
            ag.setModulos(dto.getModulos());
            return ResponseEntity.ok(agenciaRepository.save(ag));
        }
        return ResponseEntity.status(404).body("Agencia no encontrada");
    }
}
