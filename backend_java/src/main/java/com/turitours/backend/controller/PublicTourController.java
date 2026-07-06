package com.turitours.backend.controller;

import com.turitours.backend.entity.Tour;
import com.turitours.backend.repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Map;

@RestController
@RequestMapping("/api/public/tours")
@CrossOrigin(origins = "*")
public class PublicTourController {

    @Autowired
    private TourRepository tourRepository;

    @GetMapping
    public ResponseEntity<?> getTours(
            @RequestParam(required = false) Integer categoria,
            @RequestParam(required = false) Integer destino,
            @RequestParam(required = false) String ordenar) {

        List<Tour> tours = tourRepository.findAll();

        // Aplicar filtros en memoria
        if (categoria != null) {
            tours = tours.stream().filter(t -> categoria.equals(t.getCategoriaId())).collect(Collectors.toList());
        }
        if (destino != null) {
            tours = tours.stream().filter(t -> destino.equals(t.getDestinoId())).collect(Collectors.toList());
        }

        // Ordenamiento
        if (ordenar != null) {
            switch (ordenar) {
                // Sorting by price requires querying the temporadas table, omitted for now
                // Add more cases if needed
            }
        }

        return ResponseEntity.ok(tours);
    }

    @GetMapping("/destacados")
    public ResponseEntity<?> getToursDestacados() {
        // En una app real filtraríamos por campo "destacado". Por ahora devolvemos los primeros 6
        List<Tour> tours = tourRepository.findAll().stream().limit(6).collect(Collectors.toList());
        return ResponseEntity.ok(tours);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTourById(@PathVariable Integer id) {
        Optional<Tour> tour = tourRepository.findById(id);
        if (tour.isPresent()) {
            return ResponseEntity.ok(tour.get());
        }
        return ResponseEntity.status(404).body(Map.of("error", "Tour no encontrado"));
    }

    @GetMapping("/{id}/disponibilidad")
    public ResponseEntity<?> getDisponibilidad(@PathVariable Integer id, @RequestParam String fecha) {
        // Retorno dummy para cumplir con la llamada del frontend
        Optional<Tour> tour = tourRepository.findById(id);
        if (tour.isPresent()) {
            return ResponseEntity.ok(Map.of(
                "tour_id", id,
                "fecha_servicio", fecha,
                "cupos_disponibles", tour.get().getCupoMaximo() != null ? tour.get().getCupoMaximo() : 15,
                "cupo_maximo", tour.get().getCupoMaximo() != null ? tour.get().getCupoMaximo() : 15,
                "precios", Map.of("nacional", 100.0, "extranjero", 150.0) // Dummy prices, should come from temporadas
            ));
        }
        return ResponseEntity.status(404).body(Map.of("error", "Tour no encontrado"));
    }
}
