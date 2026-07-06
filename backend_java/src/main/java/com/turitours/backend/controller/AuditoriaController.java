package com.turitours.backend.controller;

import com.turitours.backend.entity.LogAuditoria;
import com.turitours.backend.repository.LogAuditoriaRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auditoria")
@CrossOrigin(origins = "*")
public class AuditoriaController {

    @Autowired
    private LogAuditoriaRepository logAuditoriaRepository;

    @GetMapping("/logs")
    public ResponseEntity<?> getLogs(HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        List<LogAuditoria> logs = logAuditoriaRepository.findByAgenciaIdOrderByCreatedAtDesc(agenciaId);
        return ResponseEntity.ok(Map.of("logs_auditoria", logs));
    }
}
