package com.turitours.backend.repository;

import com.turitours.backend.entity.ReservaPasajero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservaPasajeroRepository extends JpaRepository<ReservaPasajero, Long> {
    List<ReservaPasajero> findByReservaId(Long reservaId);
}
