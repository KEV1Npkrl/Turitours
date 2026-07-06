package com.turitours.backend.repository;

import com.turitours.backend.entity.Superadmin;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SuperadminRepository extends JpaRepository<Superadmin, Integer> {
    Optional<Superadmin> findByEmail(String email);
}
