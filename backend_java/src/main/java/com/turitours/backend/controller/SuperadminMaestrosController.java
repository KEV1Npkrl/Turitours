package com.turitours.backend.controller;

import com.turitours.backend.entity.Agencia;
import com.turitours.backend.entity.Usuario;
import com.turitours.backend.repository.AgenciaRepository;
import com.turitours.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/superadmin/maestros")
@CrossOrigin(origins = "*")
public class SuperadminMaestrosController {

    @Autowired
    private AgenciaRepository agenciaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<?> getMaestros() {
        List<Agencia> agencias = agenciaRepository.findAll();
        List<Map<String, Object>> response = new ArrayList<>();
        
        for (Agencia ag : agencias) {
            Map<String, Object> map = new HashMap<>();
            map.put("agenciaId", ag.getId());
            map.put("nombre", ag.getNombre());
            map.put("email", ag.getEmail());
            map.put("estado", ag.getEstado());
            
            // Get root user (assuming ID 1 or the one with lowest ID / role for this agency)
            // Or get the one matching agency email
            List<Usuario> users = usuarioRepository.findByAgenciaId(ag.getId());
            if (!users.isEmpty()) {
                // Find admin (assuming rol_id 1 is Admin in this agency, or just the first user)
                Usuario root = users.get(0); 
                map.put("usuarioId", root.getId());
                map.put("ultimoLogin", root.getUltimoLogin());
                map.put("bloqueado", root.getBloqueado());
            } else {
                map.put("usuarioId", null);
                map.put("ultimoLogin", null);
                map.put("bloqueado", false);
            }
            
            response.add(map);
        }
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{usuarioId}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable Integer usuarioId) {
        Optional<Usuario> opt = usuarioRepository.findById(usuarioId);
        if (opt.isPresent()) {
            Usuario user = opt.get();
            // Reset to a default password (e.g., '123456')
            user.setPasswordHash(passwordEncoder.encode("123456"));
            // In a real system, you'd send an email here instead of just resetting
            usuarioRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Contraseña reiniciada a 123456"));
        }
        return ResponseEntity.status(404).body("Usuario no encontrado");
    }
    
    @PutMapping("/{usuarioId}/toggle-bloqueo")
    public ResponseEntity<?> toggleBloqueo(@PathVariable Integer usuarioId) {
        Optional<Usuario> opt = usuarioRepository.findById(usuarioId);
        if (opt.isPresent()) {
            Usuario user = opt.get();
            user.setBloqueado(user.getBloqueado() != null && user.getBloqueado() ? false : true);
            usuarioRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Estado de bloqueo actualizado", "bloqueado", user.getBloqueado()));
        }
        return ResponseEntity.status(404).body("Usuario no encontrado");
    }
}
