package com.turitours.backend.controller;

import com.turitours.backend.entity.Tour;
import com.turitours.backend.repository.TourRepository;
import jakarta.servlet.http.HttpServletRequest;
import com.turitours.backend.util.JsonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tours")
@CrossOrigin(origins = "*")
public class TourController {

    @Autowired
    private TourRepository tourRepository;

    @GetMapping
    public ResponseEntity<?> getTours(HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        List<Tour> tours = tourRepository.findByAgenciaId(agenciaId);
        return ResponseEntity.ok(Map.of("tours", tours));
    }

    @PostMapping
    public ResponseEntity<?> crearTour(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        
        String nombre = JsonUtil.getString(body, "nombre");
        Integer destinoId = JsonUtil.getInt(body, "destino_id");
        Integer categoriaId = JsonUtil.getInt(body, "categoria_id");
        Integer cupoMaximo = JsonUtil.getInt(body, "cupo_maximo");
        
        if (nombre == null || destinoId == null || categoriaId == null || cupoMaximo == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Faltan campos obligatorios"));
        }
        
        Tour tour = new Tour();
        tour.setAgenciaId(agenciaId);
        tour.setNombre(nombre);
        tour.setDestinoId(destinoId);
        tour.setCategoriaId(categoriaId);
        tour.setCupoMaximo(cupoMaximo);
        
        String descripcion = JsonUtil.getString(body, "descripcion");
        Integer duracionHoras = JsonUtil.getInt(body, "duracion_horas");
        
        if (descripcion != null) tour.setDescripcion(descripcion);
        if (duracionHoras != null) tour.setDuracionHoras(duracionHoras);
        
        return ResponseEntity.ok(Map.of("tour", tourRepository.save(tour)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarTour(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        Optional<Tour> opt = tourRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        
        Tour tour = opt.get();
        
        String nombre = JsonUtil.getString(body, "nombre");
        String estado = JsonUtil.getString(body, "estado");
        
        if (nombre != null) tour.setNombre(nombre);
        if (estado != null) tour.setEstado(estado);
        
        return ResponseEntity.ok(Map.of("tour", tourRepository.save(tour)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarTour(@PathVariable Integer id) {
        tourRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
