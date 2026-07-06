package com.turitours.backend.controller;

import com.turitours.backend.entity.CategoriaTour;
import com.turitours.backend.repository.CategoriaTourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/agencia/categorias")
@CrossOrigin(origins = "*")
public class CategoriaTourController {

    @Autowired
    private CategoriaTourRepository categoriaTourRepository;

    @GetMapping
    public ResponseEntity<?> getCategorias(HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        if (agenciaId == null) return ResponseEntity.status(401).body("No autorizado");

        List<CategoriaTour> categorias = categoriaTourRepository.findByAgenciaId(agenciaId);
        return ResponseEntity.ok(categorias);
    }

    @PostMapping
    public ResponseEntity<?> createCategoria(HttpServletRequest request, @RequestBody CategoriaTour dto) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        if (agenciaId == null) return ResponseEntity.status(401).body("No autorizado");

        dto.setAgenciaId(agenciaId);
        CategoriaTour saved = categoriaTourRepository.save(dto);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategoria(HttpServletRequest request, @PathVariable Integer id) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        if (agenciaId == null) return ResponseEntity.status(401).body("No autorizado");

        categoriaTourRepository.findById(id).ifPresent(cat -> {
            if (cat.getAgenciaId().equals(agenciaId)) {
                categoriaTourRepository.delete(cat);
            }
        });
        return ResponseEntity.ok().build();
    }
}
