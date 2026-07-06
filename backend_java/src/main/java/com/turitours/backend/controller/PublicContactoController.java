package com.turitours.backend.controller;

import com.turitours.backend.entity.Notificacion;
import com.turitours.backend.repository.NotificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/public/contacto")
@CrossOrigin(origins = "*")
public class PublicContactoController {

    @Autowired
    private NotificacionRepository notificacionRepository;

    @PostMapping
    public ResponseEntity<?> enviarMensajeContacto(@RequestBody Map<String, String> payload) {
        String nombre = payload.get("nombre");
        String email = payload.get("email");
        String telefono = payload.get("telefono");
        String asunto = payload.get("asunto");
        String mensaje = payload.get("mensaje");
        // En un entorno multi-tenant real sacaríamos esto del dominio o de un parámetro. Por ahora usamos 1.
        Integer agenciaId = payload.containsKey("agenciaId") ? Integer.parseInt(payload.get("agenciaId")) : 1; 

        if (nombre == null || email == null || mensaje == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Faltan datos obligatorios"));
        }

        Notificacion notif = new Notificacion();
        notif.setAgenciaId(agenciaId);
        notif.setAsunto("Nuevo mensaje de contacto: " + asunto);
        
        String contenido = "Nombre: " + nombre + "\n" +
                           "Email: " + email + "\n" +
                           "Teléfono: " + (telefono != null ? telefono : "No especificado") + "\n\n" +
                           mensaje;
                           
        notif.setCuerpo(contenido);
        notif.setDestinatario("agencia"); // Internal agency notification
        notif.setTipo("contacto");
        notif.setEnviado(false);
        notif.setCreatedAt(LocalDateTime.now());

        notificacionRepository.save(notif);

        return ResponseEntity.ok(Map.of("success", true, "message", "Mensaje enviado exitosamente. Te contactaremos pronto."));
    }
}
