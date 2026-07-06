package com.turitours.backend.repository;

import com.turitours.backend.entity.Turista;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TuristaRepository extends JpaRepository<Turista, Integer> {
    List<Turista> findByAgenciaId(Integer agenciaId);
    java.util.Optional<Turista> findByAgenciaIdAndTipoDocAndDocumento(Integer agenciaId, String tipoDoc, String documento);
    java.util.Optional<Turista> findByAgenciaIdAndEmail(Integer agenciaId, String email);
}
