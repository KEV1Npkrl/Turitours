package com.turitours.backend.repository;

import com.turitours.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findFirstByAgenciaId(Integer agenciaId);
    java.util.List<Usuario> findByAgenciaId(Integer agenciaId);
}
