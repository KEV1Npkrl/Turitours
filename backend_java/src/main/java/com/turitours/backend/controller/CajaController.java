package com.turitours.backend.controller;

import com.turitours.backend.entity.Caja;
import com.turitours.backend.entity.Pago;
import com.turitours.backend.entity.Usuario;
import com.turitours.backend.repository.CajaRepository;
import com.turitours.backend.repository.PagoRepository;
import com.turitours.backend.repository.UsuarioRepository;
import jakarta.servlet.http.HttpServletRequest;
import com.turitours.backend.util.JsonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/caja")
@CrossOrigin(origins = "*")
public class CajaController {

    @Autowired
    private CajaRepository cajaRepository;

    @Autowired
    private PagoRepository pagoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/activa")
    public ResponseEntity<?> getCajaActiva(HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        Optional<Caja> cajaOpt = cajaRepository.findFirstByAgenciaIdAndEstado(agenciaId, "abierta");
        return cajaOpt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.ok(null));
    }

    @GetMapping("/historial")
    public ResponseEntity<?> getHistorialCajas(HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        List<Caja> cajas = cajaRepository.findByAgenciaIdOrderByAbiertaAtDesc(agenciaId);
        return ResponseEntity.ok(cajas);
    }

    @GetMapping("/{id}/pagos")
    public ResponseEntity<?> getPagosCaja(@PathVariable Integer id, HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        List<Pago> pagos = pagoRepository.findByCajaIdAndAgenciaIdOrderByCreatedAtDesc(id, agenciaId);
        return ResponseEntity.ok(pagos);
    }

    @PostMapping("/abrir")
    public ResponseEntity<?> abrirCaja(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        Integer userId = (Integer) request.getAttribute("userId");
        
        Optional<Caja> cajaAbierta = cajaRepository.findFirstByAgenciaIdAndEstado(agenciaId, "abierta");
        if (cajaAbierta.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Ya existe una caja abierta"));
        }

        BigDecimal montoApertura = JsonUtil.getBigDecimal(body, "monto");
        if (montoApertura == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Falta monto_apertura"));
        }
        
        Optional<Usuario> usuario = usuarioRepository.findById(userId);
        if (usuario.isEmpty()) {
            usuario = usuarioRepository.findFirstByAgenciaId(agenciaId);
            if (usuario.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No hay usuarios en esta agencia"));
            }
            userId = usuario.get().getId();
        }

        Caja caja = new Caja();
        caja.setAgenciaId(agenciaId);
        caja.setCajeroId(userId);
        caja.setMontoApertura(montoApertura);
        
        Caja saved = cajaRepository.save(caja);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/pago")
    public ResponseEntity<?> registrarPago(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        Integer userId = (Integer) request.getAttribute("userId");

        Optional<Caja> cajaAbierta = cajaRepository.findFirstByAgenciaIdAndEstado(agenciaId, "abierta");
        if (cajaAbierta.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No hay caja abierta"));
        }

        Optional<Usuario> usuario = usuarioRepository.findById(userId);
        if (usuario.isEmpty()) {
            usuario = usuarioRepository.findFirstByAgenciaId(agenciaId);
            userId = usuario.get().getId();
        }

        BigDecimal monto = JsonUtil.getBigDecimal(body, "monto");
        String tipo = JsonUtil.getString(body, "tipo");
        String metodo = JsonUtil.getString(body, "metodo");
        
        if (monto == null || tipo == null || metodo == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Faltan campos obligatorios: monto, tipo, metodo"));
        }
        
        BigDecimal montoRecibido = null;
        BigDecimal vuelto = null;
        
        BigDecimal mr = JsonUtil.getBigDecimal(body, "monto_recibido");
        if (mr != null) {
            montoRecibido = mr;
            vuelto = montoRecibido.subtract(monto);
        }

        Pago pago = new Pago();
        pago.setAgenciaId(agenciaId);
        pago.setCajaId(cajaAbierta.get().getId());
        pago.setCajeroId(userId);
        pago.setTipo(tipo);
        pago.setMetodo(metodo);
        pago.setMonto(monto);
        pago.setMontoRecibido(montoRecibido);
        pago.setVuelto(vuelto);
        
        String concepto = JsonUtil.getString(body, "concepto");
        Integer reservaId = JsonUtil.getInt(body, "reserva_id");
        
        if (concepto != null) pago.setConcepto(concepto);
        if (reservaId != null) pago.setReservaId(reservaId);
        
        Pago saved = pagoRepository.save(pago);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/cerrar")
    public ResponseEntity<?> cerrarCaja(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        
        Optional<Caja> cajaAbierta = cajaRepository.findFirstByAgenciaIdAndEstado(agenciaId, "abierta");
        if (cajaAbierta.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No hay caja abierta"));
        }

        BigDecimal montoReal = JsonUtil.getBigDecimal(body, "monto_real");
        if (montoReal == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Falta monto_real"));
        }

        Caja caja = cajaAbierta.get();
        
        // Calcular monto esperado (apertura + ingresos - egresos)
        List<Pago> pagos = pagoRepository.findByCajaIdAndAgenciaIdOrderByCreatedAtDesc(caja.getId(), agenciaId);
        BigDecimal ingresos = pagos.stream().filter(p -> p.getTipo().equals("ingreso")).map(Pago::getMonto).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal egresos = pagos.stream().filter(p -> p.getTipo().equals("egreso")).map(Pago::getMonto).reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal montoEsperado = caja.getMontoApertura().add(ingresos).subtract(egresos);
        
        caja.setMontoCierreSistema(montoEsperado);
        caja.setMontoCierreReal(montoReal);
        caja.setDiferencia(montoReal.subtract(montoEsperado));
        caja.setEstado("cerrada");
        caja.setCerradaAt(LocalDateTime.now());
        
        Caja saved = cajaRepository.save(caja);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Caja cerrada exitosamente");
        response.put("caja", saved);
        return ResponseEntity.ok(response);
    }
}
