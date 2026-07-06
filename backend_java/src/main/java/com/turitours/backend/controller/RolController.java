package com.turitours.backend.controller;

import com.turitours.backend.entity.Rol;
import com.turitours.backend.entity.Permiso;
import com.turitours.backend.repository.RolRepository;
import com.turitours.backend.repository.PermisoRepository;
import com.turitours.backend.repository.UsuarioRepository;
import com.turitours.backend.repository.HistorialRolRepository;
import com.turitours.backend.entity.Usuario;
import com.turitours.backend.entity.HistorialRol;
import jakarta.servlet.http.HttpServletRequest;
import com.turitours.backend.util.JsonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "*")
public class RolController {

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PermisoRepository permisoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private HistorialRolRepository historialRolRepository;

    @GetMapping
    public ResponseEntity<?> getRoles(HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        List<Rol> roles = rolRepository.findByAgenciaIdAndActivoTrue(agenciaId);
        
        List<Map<String, Object>> result = new ArrayList<>();
        for (Rol r : roles) {
            List<Permiso> permisos = permisoRepository.findByRolId(r.getId());
            result.add(Map.of(
                "id", r.getId(),
                "nombre", r.getNombre(),
                "descripcion", r.getDescripcion() != null ? r.getDescripcion() : "",
                "permisos", permisos
            ));
        }
        
        return ResponseEntity.ok(Map.of("roles", result));
    }
    
    @PostMapping
    public ResponseEntity<?> crearRol(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        
        String nombre = JsonUtil.getString(body, "nombre");
        String descripcion = JsonUtil.getString(body, "descripcion");
        
        if (nombre == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Falta el nombre del rol"));
        }
        
        Rol rol = new Rol();
        rol.setAgenciaId(agenciaId);
        rol.setNombre(nombre);
        rol.setDescripcion(descripcion);
        Rol saved = rolRepository.save(rol);
        
        return ResponseEntity.ok(Map.of("rol", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarRol(@PathVariable Integer id, @RequestBody Map<String, Object> body, HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        Optional<Rol> opt = rolRepository.findById(id);
        if (opt.isEmpty() || !opt.get().getAgenciaId().equals(agenciaId)) {
            return ResponseEntity.notFound().build();
        }
        
        Rol rol = opt.get();
        String nombre = JsonUtil.getString(body, "nombre");
        String descripcion = JsonUtil.getString(body, "descripcion");
        
        if (nombre != null) rol.setNombre(nombre);
        if (descripcion != null) rol.setDescripcion(descripcion);
        
        return ResponseEntity.ok(Map.of("rol", rolRepository.save(rol)));
    }

    @PostMapping("/{id}/desactivar-migrar")
    @Transactional
    public ResponseEntity<?> desactivarYMigrarRol(@PathVariable Integer id, @RequestBody Map<String, Object> body, HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        Integer adminId = (Integer) request.getAttribute("userId");
        
        Optional<Rol> opt = rolRepository.findById(id);
        if (opt.isEmpty() || !opt.get().getAgenciaId().equals(agenciaId)) {
            return ResponseEntity.notFound().build();
        }
        
        Rol rolViejo = opt.get();
        if ("ADMINISTRADOR".equalsIgnoreCase(rolViejo.getNombre())) { // Superadmin o rol base que no se borra
            return ResponseEntity.badRequest().body(Map.of("error", "No puedes desactivar el rol principal."));
        }

        Integer nuevoRolId = JsonUtil.getInt(body, "nuevo_rol_id");
        List<Usuario> usuarios = usuarioRepository.findByAgenciaId(agenciaId);
        
        if (nuevoRolId != null) {
            Optional<Rol> optNuevo = rolRepository.findById(nuevoRolId);
            if (optNuevo.isEmpty() || !optNuevo.get().getAgenciaId().equals(agenciaId)) {
                return ResponseEntity.badRequest().body(Map.of("error", "El rol de destino no es válido."));
            }
            
            for (Usuario u : usuarios) {
                if (u.getRolId().equals(id)) {
                    u.setRolId(nuevoRolId);
                    usuarioRepository.save(u);
                    
                    HistorialRol h = new HistorialRol();
                    h.setUsuarioId(u.getId());
                    h.setRolAnteriorId(id);
                    h.setRolNuevoId(nuevoRolId);
                    h.setRealizadoPor(adminId);
                    h.setFecha(java.time.LocalDateTime.now());
                    historialRolRepository.save(h);
                }
            }
        } else {
            // Eliminar usuarios del sistema (inhabilitar)
            for (Usuario u : usuarios) {
                if (u.getRolId().equals(id)) {
                    u.setActivo(false);
                    usuarioRepository.save(u);
                }
            }
        }
        
        rolViejo.setActivo(false);
        rolRepository.save(rolViejo);
        
        return ResponseEntity.ok(Map.of("success", true, "mensaje", "Rol desactivado y usuarios migrados correctamente."));
    }

    @PutMapping("/{id}/permisos")
    @Transactional
    public ResponseEntity<?> actualizarPermisos(@PathVariable Integer id, @RequestBody Map<String, Object> body, HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        Optional<Rol> opt = rolRepository.findById(id);
        if (opt.isEmpty() || !opt.get().getAgenciaId().equals(agenciaId)) {
            return ResponseEntity.notFound().build();
        }
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> permisosData = (List<Map<String, Object>>) body.get("permisos");
        
        if (permisosData == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Faltan permisos"));
        }
        
        permisoRepository.deleteByRolId(id);
        
        List<Permiso> savedPermisos = new ArrayList<>();
        for (Map<String, Object> pData : permisosData) {
            Permiso p = new Permiso();
            p.setRolId(id);
            p.setModulo(JsonUtil.getString(pData, "modulo"));
            p.setPuedeVer(JsonUtil.getInt(pData, "puede_ver") != null ? JsonUtil.getInt(pData, "puede_ver") : 0);
            p.setPuedeCrear(JsonUtil.getInt(pData, "puede_crear") != null ? JsonUtil.getInt(pData, "puede_crear") : 0);
            p.setPuedeEditar(JsonUtil.getInt(pData, "puede_editar") != null ? JsonUtil.getInt(pData, "puede_editar") : 0);
            p.setPuedeEliminar(JsonUtil.getInt(pData, "puede_eliminar") != null ? JsonUtil.getInt(pData, "puede_eliminar") : 0);
            savedPermisos.add(permisoRepository.save(p));
        }
        
        return ResponseEntity.ok(Map.of("permisos", savedPermisos));
    }
}
