package com.turitours.backend.controller;

import com.turitours.backend.entity.ParametroGlobal;
import com.turitours.backend.entity.VersionSistema;
import com.turitours.backend.entity.Pais;
import com.turitours.backend.entity.LogAuditoria;
import com.turitours.backend.repository.ParametroGlobalRepository;
import com.turitours.backend.repository.VersionSistemaRepository;
import com.turitours.backend.repository.PaisRepository;
import com.turitours.backend.repository.LogAuditoriaRepository;
import com.turitours.backend.repository.ComunicadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/superadmin/sistema")
@CrossOrigin(origins = "*")
public class SuperadminSistemaController {

    @Autowired
    private ParametroGlobalRepository parametroGlobalRepository;
    
    @Autowired
    private VersionSistemaRepository versionSistemaRepository;
    
    @Autowired
    private PaisRepository paisRepository;
    
    @Autowired
    private LogAuditoriaRepository logAuditoriaRepository;

    @Autowired
    private ComunicadoRepository comunicadoRepository;

    @GetMapping("/parametros")
    public ResponseEntity<List<ParametroGlobal>> getParametros() {
        return ResponseEntity.ok(parametroGlobalRepository.findAll());
    }

    @PostMapping("/parametros")
    public ResponseEntity<?> saveParametro(@RequestBody ParametroGlobal param) {
        java.util.Optional<ParametroGlobal> opt = parametroGlobalRepository.findByClave(param.getClave());
        ParametroGlobal p;
        if (opt.isPresent()) {
            p = opt.get();
            p.setValor(param.getValor());
            if (param.getDescripcion() != null) p.setDescripcion(param.getDescripcion());
        } else {
            p = param;
        }
        return ResponseEntity.ok(parametroGlobalRepository.save(p));
    }
    
    @PostMapping("/comunicados")
    public ResponseEntity<?> enviarComunicado(@RequestBody com.turitours.backend.entity.Comunicado comunicado) {
        // Hardcoding superadmin_id to 1
        comunicado.setSuperadminId(1);
        if(comunicado.getTipo() == null) comunicado.setTipo("informativo");
        comunicadoRepository.save(comunicado);
        return ResponseEntity.ok(java.util.Map.of("message", "Comunicado enviado"));
    }

    @GetMapping("/versiones")
    public ResponseEntity<List<VersionSistema>> getVersiones() {
        return ResponseEntity.ok(versionSistemaRepository.findAll());
    }

    @PostMapping("/versiones")
    public ResponseEntity<VersionSistema> saveVersion(@RequestBody VersionSistema version) {
        return ResponseEntity.ok(versionSistemaRepository.save(version));
    }

    @GetMapping("/paises")
    public ResponseEntity<List<Pais>> getPaises() {
        return ResponseEntity.ok(paisRepository.findAll());
    }

    @PostMapping("/paises")
    public ResponseEntity<Pais> savePais(@RequestBody Pais pais) {
        return ResponseEntity.ok(paisRepository.save(pais));
    }

    @GetMapping("/auditoria")
    public ResponseEntity<List<LogAuditoria>> getAuditoria() {
        // En un sistema real se paginaría y ordenaría desc
        return ResponseEntity.ok(logAuditoriaRepository.findAll());
    }
}
