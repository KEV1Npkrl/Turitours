package com.turitours.backend.controller;

import com.turitours.backend.entity.Turista;
import com.turitours.backend.repository.TuristaRepository;
import jakarta.servlet.http.HttpServletRequest;
import com.turitours.backend.util.JsonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/turistas")
@CrossOrigin(origins = "*")
public class TuristaController {

    @Autowired
    private TuristaRepository turistaRepository;

    @GetMapping
    public ResponseEntity<?> getTuristas(HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        List<Turista> turistas = turistaRepository.findByAgenciaId(agenciaId);
        return ResponseEntity.ok(Map.of("turistas", turistas));
    }

    @PostMapping
    public ResponseEntity<?> crearTurista(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        
        String tipoDoc = JsonUtil.getString(body, "tipo_doc");
        String documento = JsonUtil.getString(body, "documento");
        String nombre = JsonUtil.getString(body, "nombre");
        String apellidos = JsonUtil.getString(body, "apellidos");
        
        if (tipoDoc == null || documento == null || nombre == null || apellidos == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Faltan campos obligatorios: tipo_doc, documento, nombre, apellidos"));
        }
        
        Turista turista = new Turista();
        turista.setAgenciaId(agenciaId);
        turista.setTipoDoc(tipoDoc);
        turista.setDocumento(documento);
        turista.setNombre(nombre);
        turista.setApellidos(apellidos);
        
        String email = JsonUtil.getString(body, "email");
        String celular = JsonUtil.getString(body, "celular");
        String notas = JsonUtil.getString(body, "notas_crm");
        
        if (email != null) turista.setEmail(email);
        if (celular != null) turista.setCelular(celular);
        if (notas != null) turista.setNotasCrm(notas);
        
        return ResponseEntity.ok(Map.of("turista", turistaRepository.save(turista)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarTurista(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        Optional<Turista> opt = turistaRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        
        Turista turista = opt.get();
        
        String nombre = JsonUtil.getString(body, "nombre");
        String apellidos = JsonUtil.getString(body, "apellidos");
        String email = JsonUtil.getString(body, "email");
        String celular = JsonUtil.getString(body, "celular");
        
        if (nombre != null) turista.setNombre(nombre);
        if (apellidos != null) turista.setApellidos(apellidos);
        if (email != null) turista.setEmail(email);
        if (celular != null) turista.setCelular(celular);
        
        return ResponseEntity.ok(Map.of("turista", turistaRepository.save(turista)));
    }
}
