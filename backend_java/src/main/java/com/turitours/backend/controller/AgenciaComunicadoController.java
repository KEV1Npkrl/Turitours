package com.turitours.backend.controller;

import com.turitours.backend.entity.Comunicado;
import com.turitours.backend.repository.ComunicadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agencia/comunicados")
@CrossOrigin(origins = "*")
public class AgenciaComunicadoController {

    @Autowired
    private ComunicadoRepository comunicadoRepository;

    @GetMapping
    public ResponseEntity<List<Comunicado>> getComunicados() {
        return ResponseEntity.ok(comunicadoRepository.findAll(Sort.by(Sort.Direction.DESC, "fechaEnvio")));
    }
}
