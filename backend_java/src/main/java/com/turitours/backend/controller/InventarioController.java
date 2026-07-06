package com.turitours.backend.controller;

import com.turitours.backend.entity.Equipo;
import com.turitours.backend.entity.Proveedor;
import com.turitours.backend.entity.CategoriaProveedor;
import com.turitours.backend.repository.EquipoRepository;
import com.turitours.backend.repository.ProveedorRepository;
import com.turitours.backend.repository.CategoriaProveedorRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventario")
@CrossOrigin(origins = "*")
public class InventarioController {

    @Autowired
    private EquipoRepository equipoRepository;

    @Autowired
    private ProveedorRepository proveedorRepository;

    @Autowired
    private CategoriaProveedorRepository categoriaProveedorRepository;

    @Autowired
    private com.turitours.backend.repository.MovimientoInventarioRepository movimientoInventarioRepository;

    @Autowired
    private com.turitours.backend.repository.UsuarioRepository usuarioRepository;

    @GetMapping("/equipos")
    public ResponseEntity<?> getEquipos(HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        List<Equipo> equipos = equipoRepository.findByAgenciaId(agenciaId);
        return ResponseEntity.ok(Map.of("equipos", equipos));
    }

    @GetMapping("/proveedores")
    public ResponseEntity<?> getProveedores(HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        List<Proveedor> proveedores = proveedorRepository.findByAgenciaId(agenciaId);
        return ResponseEntity.ok(Map.of("proveedores", proveedores));
    }

    @GetMapping("/categorias-proveedor")
    public ResponseEntity<?> getCategoriasProveedor(HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        List<CategoriaProveedor> categorias = categoriaProveedorRepository.findByAgenciaId(agenciaId);
        return ResponseEntity.ok(Map.of("categorias_proveedor", categorias));
    }

    @GetMapping("/movimientos")
    public ResponseEntity<?> getMovimientos(HttpServletRequest request) {
        Integer agenciaId = (Integer) request.getAttribute("agenciaId");
        List<com.turitours.backend.entity.MovimientoInventario> movimientos = movimientoInventarioRepository.findByAgenciaIdOrderByFechaDesc(agenciaId.longValue());
        
        var responseList = movimientos.stream().map(m -> Map.of(
            "id", m.getId(),
            "equipo_nombre", m.getEquipo().getNombre(),
            "usuario_nombre", m.getUsuario().getNombre(),
            "tipo", m.getTipo(),
            "cantidad", m.getCantidad(),
            "motivo", m.getMotivo(),
            "fecha", m.getFecha().toString()
        )).toList();
        
        return ResponseEntity.ok(Map.of("movimientos", responseList));
    }

    @PostMapping("/movimientos")
    public ResponseEntity<?> registrarMovimiento(HttpServletRequest request, @RequestBody Map<String, Object> body) {
        try {
            Integer agenciaId = (Integer) request.getAttribute("agenciaId");
            Integer usuarioId = (Integer) request.getAttribute("userId");

            Integer equipoId = Integer.valueOf(body.get("equipo_id").toString());
            String tipo = body.get("tipo").toString();
            Integer cantidad = Integer.valueOf(body.get("cantidad").toString());
            String motivo = body.get("motivo").toString();

            Equipo equipo = equipoRepository.findById(equipoId).orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
            
            // Actualizar stock
            if ("salida".equals(tipo)) {
                if (equipo.getCantidadDisponible() < cantidad) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Stock insuficiente"));
                }
                equipo.setCantidadDisponible(equipo.getCantidadDisponible() - cantidad);
            } else if ("entrada".equals(tipo)) {
                equipo.setCantidadDisponible(equipo.getCantidadDisponible() + cantidad);
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Tipo de movimiento inválido"));
            }
            equipoRepository.save(equipo);

            com.turitours.backend.entity.MovimientoInventario mov = new com.turitours.backend.entity.MovimientoInventario();
            mov.setAgenciaId(agenciaId.longValue());
            mov.setEquipo(equipo);
            mov.setUsuario(usuarioRepository.findById(usuarioId).orElseThrow());
            mov.setTipo(tipo);
            mov.setCantidad(cantidad);
            mov.setMotivo(motivo);
            mov.setFecha(java.time.LocalDateTime.now());

            movimientoInventarioRepository.save(mov);

            return ResponseEntity.ok(Map.of("success", true, "mensaje", "Movimiento registrado"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
