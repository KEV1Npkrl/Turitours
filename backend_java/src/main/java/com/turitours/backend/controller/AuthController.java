package com.turitours.backend.controller;

import com.turitours.backend.entity.Superadmin;
import com.turitours.backend.entity.Usuario;
import com.turitours.backend.repository.SuperadminRepository;
import com.turitours.backend.repository.UsuarioRepository;
import com.turitours.backend.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.turitours.backend.entity.Agencia;
import com.turitours.backend.repository.AgenciaRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private SuperadminRepository superadminRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AgenciaRepository agenciaRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @jakarta.annotation.PostConstruct
    public void initSuperadmin() {
        if (superadminRepository.findByEmail("admin@superadmin.com").isEmpty()) {
            Superadmin sa = new Superadmin();
            sa.setNombre("Super Administrador");
            sa.setEmail("admin@superadmin.com");
            sa.setPasswordHash(passwordEncoder.encode("admin123"));
            sa.setActivo(true);
            superadminRepository.save(sa);
            System.out.println("Superadmin account created!");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();

        // Check Superadmin first
        Optional<Superadmin> superadminOpt = superadminRepository.findByEmail(email);
        if (superadminOpt.isPresent()) {
            Superadmin admin = superadminOpt.get();
            if (passwordEncoder.matches(password, admin.getPasswordHash())) {
                String token = jwtUtils.generateToken(admin.getEmail(), admin.getId(), 1); // 1 = default agencia
                return buildAuthResponse(token, admin.getId(), 99, admin.getNombre(), admin.getEmail(), false);
            }
        }

        // Check regular user
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isPresent()) {
            Usuario user = usuarioOpt.get();
            if (passwordEncoder.matches(password, user.getPasswordHash())) {
                
                if (!user.getActivo() || user.getBloqueado()) {
                    Map<String, String> error = new HashMap<>();
                    error.put("error", "Su cuenta está inactiva o bloqueada. Contacte a soporte.");
                    return ResponseEntity.status(403).body(error);
                }

                // VERIFICAR ESTADO DE LA AGENCIA
                Optional<Agencia> agenciaOpt = agenciaRepository.findById(user.getAgenciaId());
                if (agenciaOpt.isPresent()) {
                    Agencia agencia = agenciaOpt.get();
                    if (!"activa".equals(agencia.getEstado())) {
                        Map<String, String> error = new HashMap<>();
                        error.put("error", "La agencia se encuentra " + agencia.getEstado() + ". Contacte a soporte.");
                        return ResponseEntity.status(403).body(error);
                    }
                }

                boolean primerLogin = user.getUltimoLogin() == null;
                if (!primerLogin) {
                    user.setUltimoLogin(java.time.LocalDateTime.now());
                    usuarioRepository.save(user);
                }

                String token = jwtUtils.generateToken(user.getEmail(), user.getId(), user.getAgenciaId());
                return buildAuthResponse(token, user.getId(), user.getRolId(), user.getNombre(), user.getEmail(), primerLogin);
            }
        }

        Map<String, String> error = new HashMap<>();
        error.put("error", "Credenciales inválidas");
        return ResponseEntity.status(401).body(error);
    }

    private ResponseEntity<?> buildAuthResponse(String token, Integer id, Integer rolId, String nombre, String email, boolean primerLogin) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", id);
        userMap.put("rol_id", rolId);
        userMap.put("nombre", nombre);
        userMap.put("email", email);
        userMap.put("primer_login", primerLogin);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", userMap);
        
        return ResponseEntity.ok(response);
    }
}
