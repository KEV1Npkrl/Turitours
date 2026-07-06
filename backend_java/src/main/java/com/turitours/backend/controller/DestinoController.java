package com.turitours.backend.controller;

import com.turitours.backend.entity.CategoriaTour;
import com.turitours.backend.entity.Destino;
import com.turitours.backend.repository.CategoriaTourRepository;
import com.turitours.backend.repository.DestinoRepository;
import jakarta.servlet.http.HttpServletRequest;
import com.turitours.backend.util.JsonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/destinos")
@CrossOrigin(origins = "*")
public class DestinoController {

    @Autowired
    private DestinoRepository destinoRepository;

    @Autowired
    private CategoriaTourRepository categoriaTourRepository;

    @GetMapping
    public ResponseEntity<?> getDestinos(HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        List<Destino> destinos = destinoRepository.findByAgenciaId(agenciaId);
        return ResponseEntity.ok(Map.of("destinos", destinos));
    }

    @PostMapping
    public ResponseEntity<?> crearDestino(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        
        String nombre = JsonUtil.getString(body, "nombre");
        if (nombre == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Falta el nombre del destino"));
        }
        
        Destino destino = new Destino();
        destino.setAgenciaId(agenciaId);
        destino.setNombre(nombre);
        
        String descripcion = JsonUtil.getString(body, "descripcion");
        String imagen = JsonUtil.getString(body, "imagen");
        BigDecimal latitud = JsonUtil.getBigDecimal(body, "latitud");
        BigDecimal longitud = JsonUtil.getBigDecimal(body, "longitud");
        
        if (descripcion != null) destino.setDescripcion(descripcion);
        if (imagen != null) destino.setImagen(imagen);
        if (latitud != null) destino.setLatitud(latitud);
        if (longitud != null) destino.setLongitud(longitud);
        
        return ResponseEntity.ok(Map.of("destino", destinoRepository.save(destino)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarDestino(@PathVariable Integer id, @RequestBody Map<String, Object> body, HttpServletRequest request) {
        Optional<Destino> opt = destinoRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        
        Destino destino = opt.get();
        
        String nombre = JsonUtil.getString(body, "nombre");
        String descripcion = JsonUtil.getString(body, "descripcion");
        Boolean activo = JsonUtil.getBoolean(body, "activo");
        
        if (nombre != null) destino.setNombre(nombre);
        if (descripcion != null) destino.setDescripcion(descripcion);
        if (activo != null) destino.setActivo(activo);
        
        return ResponseEntity.ok(Map.of("destino", destinoRepository.save(destino)));
    }

    @GetMapping("/categorias")
    public ResponseEntity<?> getCategorias(HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        List<CategoriaTour> categorias = categoriaTourRepository.findByAgenciaId(agenciaId);
        return ResponseEntity.ok(Map.of("categorias", categorias));
    }

    @PostMapping("/categorias")
    public ResponseEntity<?> crearCategoria(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        
        String nombre = JsonUtil.getString(body, "nombre");
        if (nombre == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Falta el nombre de la categoria"));
        }
        
        CategoriaTour cat = new CategoriaTour();
        cat.setAgenciaId(agenciaId);
        cat.setNombre(nombre);
        
        String descripcion = JsonUtil.getString(body, "descripcion");
        String iconoSvg = JsonUtil.getString(body, "icono_svg");
        
        if (descripcion != null) cat.setDescripcion(descripcion);
        if (iconoSvg != null) cat.setIconoSvg(iconoSvg);
        
        return ResponseEntity.ok(Map.of("categoria", categoriaTourRepository.save(cat)));
    }

    @PutMapping("/categorias/{id}")
    public ResponseEntity<?> editarCategoria(@PathVariable Integer id, @RequestBody Map<String, Object> body, HttpServletRequest request) {
        Optional<CategoriaTour> opt = categoriaTourRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        
        CategoriaTour cat = opt.get();
        
        String nombre = JsonUtil.getString(body, "nombre");
        String descripcion = JsonUtil.getString(body, "descripcion");
        String iconoSvg = JsonUtil.getString(body, "icono_svg");
        
        if (nombre != null) cat.setNombre(nombre);
        if (descripcion != null) cat.setDescripcion(descripcion);
        if (iconoSvg != null) cat.setIconoSvg(iconoSvg);
        
        return ResponseEntity.ok(Map.of("categoria", categoriaTourRepository.save(cat)));
    }

    @DeleteMapping("/categorias/{id}")
    public ResponseEntity<?> eliminarCategoria(@PathVariable Integer id) {
        Optional<CategoriaTour> opt = categoriaTourRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        
        categoriaTourRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
