package com.turitours.backend.controller;

import com.turitours.backend.entity.Turista;
import com.turitours.backend.repository.TuristaRepository;
import com.turitours.backend.util.JsonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

import java.util.Map;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/public/auth")
@CrossOrigin(origins = "*")
public class PublicAuthController {

    @Autowired
    private TuristaRepository turistaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Map<String, Object> body) {
        // En un sistema real el agenciaId puede venir del header o ser fijo
        Integer agenciaId = 1; // Default
        
        String tipoDoc = JsonUtil.getString(body, "tipo_doc");
        String documento = JsonUtil.getString(body, "documento");
        String email = JsonUtil.getString(body, "email");
        String password = JsonUtil.getString(body, "password");

        if (tipoDoc == null || documento == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Faltan campos obligatorios."));
        }

        // Validate uniqueness
        Optional<Turista> existenteDoc = turistaRepository.findByAgenciaIdAndTipoDocAndDocumento(agenciaId, tipoDoc, documento);
        if (existenteDoc.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Ya existe un turista con ese documento."));
        }

        if (email != null && !email.trim().isEmpty()) {
            Optional<Turista> existenteEmail = turistaRepository.findByAgenciaIdAndEmail(agenciaId, email);
            if (existenteEmail.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Ya existe un turista con ese correo."));
            }
        }

        Turista turista = new Turista();
        turista.setAgenciaId(agenciaId);
        turista.setTipoDoc(tipoDoc);
        turista.setDocumento(documento);
        turista.setNombre(JsonUtil.getString(body, "nombre"));
        turista.setApellidos(JsonUtil.getString(body, "apellidos"));
        turista.setEmail(email);
        turista.setCelular(JsonUtil.getString(body, "celular"));
        
        String fechaNac = JsonUtil.getString(body, "fecha_nacimiento");
        if (fechaNac != null && !fechaNac.isEmpty()) {
            turista.setFechaNacimiento(LocalDate.parse(fechaNac));
        }
        
        turista.setPaisId(JsonUtil.getInt(body, "pais_id"));
        turista.setRestriccionesMedicas(JsonUtil.getString(body, "restricciones_medicas"));
        turista.setPasswordHash(passwordEncoder.encode(password));
        turista.setEmailVerificado(false);

        turistaRepository.save(turista);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Turista registrado exitosamente"
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> body) {
        Integer agenciaId = 1; // Default
        String email = JsonUtil.getString(body, "email");
        String password = JsonUtil.getString(body, "password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Faltan credenciales"));
        }

        Optional<Turista> opt = turistaRepository.findByAgenciaIdAndEmail(agenciaId, email);
        if (opt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Credenciales incorrectas"));
        }

        Turista turista = opt.get();
        if (!passwordEncoder.matches(password, turista.getPasswordHash())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Credenciales incorrectas"));
        }

        // For tourist, we will issue a token just in case, but they only use public APIs mostly
        // To be secure, we can append a prefix or use a custom claim if needed. 
        // Here we just return the Turista object so the frontend can save the session.
        String token = "turista_token_" + turista.getId(); // Simple token for now, or use jwtUtils

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("success", true);
        response.put("token", token);
        response.put("turista", turista);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(jakarta.servlet.http.HttpServletRequest request) {
        String auth = request.getHeader("Authorization");
        if (auth != null && auth.startsWith("Bearer turista_token_")) {
            try {
                Integer turistaId = Integer.parseInt(auth.substring("Bearer turista_token_".length()));
                Optional<Turista> opt = turistaRepository.findById(turistaId);
                if (opt.isPresent()) {
                    return ResponseEntity.ok(opt.get());
                }
            } catch (Exception e) {
                // Ignore
            }
        }
        return ResponseEntity.status(401).body(Map.of("error", "No autorizado"));
    }

    @Autowired
    private com.turitours.backend.repository.NotificacionRepository notificacionRepository;

    @GetMapping("/notificaciones")
    public ResponseEntity<?> getNotificaciones(jakarta.servlet.http.HttpServletRequest request) {
        String auth = request.getHeader("Authorization");
        if (auth != null && auth.startsWith("Bearer turista_token_")) {
            try {
                Integer turistaId = Integer.parseInt(auth.substring("Bearer turista_token_".length()));
                List<com.turitours.backend.entity.Notificacion> notificaciones = notificacionRepository.findByTuristaIdOrderByCreatedAtDesc(turistaId);
                return ResponseEntity.ok(notificaciones);
            } catch (Exception e) {
                // Ignore and return empty
            }
        }
        return ResponseEntity.ok(new java.util.ArrayList<>());
    }
}
