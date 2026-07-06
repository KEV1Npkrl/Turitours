package com.turitours.backend.controller;

import com.turitours.backend.entity.Usuario;
import com.turitours.backend.repository.UsuarioRepository;
import jakarta.servlet.http.HttpServletRequest;
import com.turitours.backend.util.JsonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<?> getUsuarios(HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        List<Usuario> usuarios = usuarioRepository.findByAgenciaId(agenciaId);
        
        // Remove passwords before returning
        for(Usuario u : usuarios) {
            u.setPasswordHash(null);
        }
        
        return ResponseEntity.ok(Map.of("usuarios", usuarios));
    }

    @PostMapping
    public ResponseEntity<?> crearUsuario(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        
        String nombre = JsonUtil.getString(body, "nombre");
        String email = JsonUtil.getString(body, "email");
        Integer rolId = JsonUtil.getInt(body, "rol_id");
        String dni = JsonUtil.getString(body, "dni");
        String password = JsonUtil.getString(body, "password");
        
        if (nombre == null || email == null || rolId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Faltan campos obligatorios: nombre, email, rol_id"));
        }
        
        Usuario user = new Usuario();
        user.setAgenciaId(agenciaId);
        user.setNombre(nombre);
        user.setEmail(email);
        user.setRolId(rolId);
        if (dni != null) user.setDni(dni);
        if (password != null) user.setPasswordHash(passwordEncoder.encode(password));
        
        Usuario saved = usuarioRepository.save(user);
        saved.setPasswordHash(null);
        return ResponseEntity.ok(Map.of("usuario", saved));
    }

    @PutMapping("/{id}/inhabilitar")
    public ResponseEntity<?> inhabilitarUsuario(@PathVariable Integer id, HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        Optional<Usuario> opt = usuarioRepository.findById(id);
        if (opt.isEmpty() || !opt.get().getAgenciaId().equals(agenciaId)) {
            return ResponseEntity.notFound().build();
        }
        Usuario user = opt.get();
        user.setActivo(false);
        usuarioRepository.save(user);
        return ResponseEntity.ok(Map.of("success", true));
    }
    
    @PutMapping("/{id}/reactivar")
    public ResponseEntity<?> reactivarUsuario(@PathVariable Integer id, HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        Optional<Usuario> opt = usuarioRepository.findById(id);
        if (opt.isPresent() && opt.get().getAgenciaId().equals(agenciaId)) {
            Usuario u = opt.get();
            u.setActivo(true);
            usuarioRepository.save(u);
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/cambiar-password-inicial")
    public ResponseEntity<?> cambiarPasswordInicial(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        Integer usuarioId = (Integer) request.getAttribute("userId");
        String newPassword = JsonUtil.getString(body, "password");
        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "La contraseña no puede estar vacía"));
        }
        
        Optional<Usuario> opt = usuarioRepository.findById(usuarioId);
        if (opt.isPresent()) {
            Usuario u = opt.get();
            u.setPasswordHash(passwordEncoder.encode(newPassword));
            u.setUltimoLogin(java.time.LocalDateTime.now());
            usuarioRepository.save(u);
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.status(401).body(Map.of("error", "No autorizado"));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Integer id, @RequestBody Map<String, Object> body, HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        Optional<Usuario> opt = usuarioRepository.findById(id);
        if (opt.isEmpty() || !opt.get().getAgenciaId().equals(agenciaId)) {
            return ResponseEntity.notFound().build();
        }
        Usuario user = opt.get();
        
        if (body.containsKey("nombre")) user.setNombre(JsonUtil.getString(body, "nombre"));
        if (body.containsKey("dni")) user.setDni(JsonUtil.getString(body, "dni"));
        if (body.containsKey("email")) user.setEmail(JsonUtil.getString(body, "email"));
        if (body.containsKey("telefono")) user.setTelefono(JsonUtil.getString(body, "telefono"));
        if (body.containsKey("rol_id")) user.setRolId(JsonUtil.getInt(body, "rol_id"));
        
        usuarioRepository.save(user);
        return ResponseEntity.ok(Map.of("success", true, "usuario", user));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Integer id, HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        Optional<Usuario> opt = usuarioRepository.findById(id);
        if (opt.isEmpty() || !opt.get().getAgenciaId().equals(agenciaId)) {
            return ResponseEntity.notFound().build();
        }
        usuarioRepository.delete(opt.get());
        return ResponseEntity.ok(Map.of("success", true));
    }
}
