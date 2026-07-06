package com.turitours.backend.controller;

import com.turitours.backend.entity.CategoriaTour;
import com.turitours.backend.repository.CategoriaTourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/categorias")
@CrossOrigin(origins = "*")
public class PublicCategoriaController {

    @Autowired
    private CategoriaTourRepository categoriaTourRepository;

    @GetMapping
    public ResponseEntity<?> getCategorias() {
        List<CategoriaTour> categorias = categoriaTourRepository.findAll();
        return ResponseEntity.ok(categorias);
    }
}
