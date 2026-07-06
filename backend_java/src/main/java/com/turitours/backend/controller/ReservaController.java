package com.turitours.backend.controller;

import com.turitours.backend.entity.Reserva;
import com.turitours.backend.entity.Pago;
import com.turitours.backend.entity.Caja;
import com.turitours.backend.repository.ReservaRepository;
import com.turitours.backend.repository.PagoRepository;
import com.turitours.backend.repository.CajaRepository;
import jakarta.servlet.http.HttpServletRequest;
import com.turitours.backend.util.JsonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
public class ReservaController {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private PagoRepository pagoRepository;
    
    @Autowired
    private CajaRepository cajaRepository;

    @GetMapping
    public ResponseEntity<?> getReservas(HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        List<Reserva> reservas = reservaRepository.findByAgenciaId(agenciaId);
        return ResponseEntity.ok(Map.of("reservas", reservas));
    }

    @PostMapping
    public ResponseEntity<?> crearReserva(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        Integer userId = (Integer) request.getAttribute("userId");
        
        Integer tourId = JsonUtil.getInt(body, "tour_id");
        Integer turistaId = JsonUtil.getInt(body, "turista_id");
        LocalDate fechaServicio = JsonUtil.getLocalDate(body, "fecha_servicio");
        BigDecimal precioUnitario = JsonUtil.getBigDecimal(body, "precio_unitario");
        
        if (tourId == null || turistaId == null || fechaServicio == null || precioUnitario == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Faltan campos obligatorios: tour_id, turista_id, fecha_servicio, precio_unitario"));
        }
        
        Reserva reserva = new Reserva();
        reserva.setAgenciaId(agenciaId);
        reserva.setVendedorId(userId);
        reserva.setTourId(tourId);
        reserva.setTuristaId(turistaId);
        reserva.setFechaServicio(fechaServicio);
        
        Integer numPersonas = JsonUtil.getInt(body, "num_personas");
        if (numPersonas != null) reserva.setNumPersonas(numPersonas);
        
        reserva.setPrecioUnitario(precioUnitario);
        
        BigDecimal total = precioUnitario.multiply(new BigDecimal(reserva.getNumPersonas()));
        reserva.setTotal(total);
        reserva.setSaldoPendiente(total);
        
        String estado = JsonUtil.getString(body, "estado");
        if (estado != null) reserva.setEstado(estado);
        
        return ResponseEntity.ok(Map.of("reserva", reservaRepository.save(reserva)));
    }

    @PutMapping("/{id}/anular")
    public ResponseEntity<?> anularReserva(@PathVariable Integer id) {
        Optional<Reserva> opt = reservaRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        
        Reserva reserva = opt.get();
        reserva.setEstado("anulada");
        return ResponseEntity.ok(Map.of("reserva", reservaRepository.save(reserva)));
    }

    @PutMapping("/{id}/confirmar")
    public ResponseEntity<?> confirmarReserva(@PathVariable Integer id) {
        Optional<Reserva> opt = reservaRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        
        Reserva reserva = opt.get();
        reserva.setEstado("confirmada");
        return ResponseEntity.ok(Map.of("reserva", reservaRepository.save(reserva)));
    }

    @PostMapping("/{id}/pago")
    public ResponseEntity<?> confirmarPago(@PathVariable Integer id, @RequestBody Map<String, Object> body, HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        Integer userId = (Integer) request.getAttribute("userId");

        Optional<Reserva> optRes = reservaRepository.findById(id);
        if (optRes.isEmpty()) return ResponseEntity.notFound().build();
        
        Optional<Caja> cajaAbierta = cajaRepository.findFirstByAgenciaIdAndEstado(agenciaId, "abierta");
        if (cajaAbierta.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No hay caja abierta para registrar el pago"));
        }

        BigDecimal monto = JsonUtil.getBigDecimal(body, "monto");
        String metodo = JsonUtil.getString(body, "metodo");
        
        if (monto == null || metodo == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Faltan campos obligatorios: monto, metodo"));
        }
        
        Pago pago = new Pago();
        pago.setAgenciaId(agenciaId);
        pago.setCajaId(cajaAbierta.get().getId());
        pago.setReservaId(id);
        pago.setCajeroId(userId);
        pago.setTipo("ingreso");
        pago.setMetodo(metodo);
        pago.setMonto(monto);
        
        Pago saved = pagoRepository.save(pago);
        
        // Update Reserva Saldo
        Reserva reserva = optRes.get();
        reserva.setSaldoPendiente(reserva.getSaldoPendiente().subtract(monto));
        if (reserva.getSaldoPendiente().compareTo(BigDecimal.ZERO) <= 0) {
            reserva.setEstado("confirmada");
        }
        reservaRepository.save(reserva);
        
        return ResponseEntity.ok(saved);
    }
}
