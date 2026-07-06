package com.turitours.backend.service;

import com.turitours.backend.entity.Notificacion;
import com.turitours.backend.entity.Reserva;
import com.turitours.backend.entity.Tour;
import com.turitours.backend.entity.Turista;
import com.turitours.backend.repository.NotificacionRepository;
import com.turitours.backend.repository.ReservaRepository;
import com.turitours.backend.repository.TourRepository;
import com.turitours.backend.repository.TuristaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificacionService {

    @Autowired
    private NotificacionRepository notificacionRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private TuristaRepository turistaRepository;

    public void crearNotificacion(Integer turistaId, String tipo, String asunto, String cuerpo) {
        Turista turista = turistaRepository.findById(turistaId).orElse(null);
        if (turista == null || turista.getEmail() == null || turista.getEmail().isEmpty()) {
            return;
        }
        
        Notificacion notif = new Notificacion();
        notif.setAgenciaId(turista.getAgenciaId());
        notif.setTuristaId(turistaId);
        notif.setTipo(tipo);
        notif.setDestinatario(turista.getEmail());
        notif.setAsunto(asunto);
        notif.setCuerpo(cuerpo);
        notif.setEnviado(false); // Can be picked up by a mailer later
        
        notificacionRepository.save(notif);
    }

    // Cron expression: everyday at 8:00 AM
    @Scheduled(cron = "0 0 8 * * ?")
    public void generarRecordatoriosYComunicados() {
        LocalDate hoy = LocalDate.now();
        LocalDate manana = hoy.plusDays(1);
        
        List<Reserva> reservas = reservaRepository.findAll();
        
        for (Reserva r : reservas) {
            if ("anulada".equals(r.getEstado())) continue;
            
            // 24h Reminder
            if (r.getFechaServicio() != null && r.getFechaServicio().equals(manana)) {
                String cuerpo = "Recordatorio para tu tour mañana " + r.getFechaServicio() + ". Codigo: " + r.getCodigoQr();
                boolean yaEnviado = yaTieneNotificacion(r.getTuristaId(), "recordatorio_24h", r.getCodigoQr());
                if (!yaEnviado) {
                    Tour tour = tourRepository.findById(r.getTourId()).orElse(null);
                    String tourName = tour != null ? tour.getNombre() : "Tour";
                    crearNotificacion(r.getTuristaId(), "recordatorio_24h", "Recordatorio mañana — " + tourName, cuerpo);
                }
            }
            
            // Post-tour review request
            if (r.getFechaServicio() != null && r.getFechaServicio().isBefore(hoy)) {
                String cuerpo = "Esperamos que hayas disfrutado tu viaje. Déjanos una reseña para tu reserva " + r.getCodigoQr();
                boolean yaEnviado = yaTieneNotificacion(r.getTuristaId(), "comunicado", r.getCodigoQr());
                if (!yaEnviado) {
                    Tour tour = tourRepository.findById(r.getTourId()).orElse(null);
                    String tourName = tour != null ? tour.getNombre() : "el tour";
                    crearNotificacion(r.getTuristaId(), "comunicado", "¿Qué tal te pareció " + tourName + "?", cuerpo);
                }
            }
        }
    }
    
    private boolean yaTieneNotificacion(Integer turistaId, String tipo, String keyword) {
        List<Notificacion> notificaciones = notificacionRepository.findByTuristaIdOrderByCreatedAtDesc(turistaId);
        for (Notificacion n : notificaciones) {
            if (tipo.equals(n.getTipo()) && n.getCuerpo().contains(keyword)) {
                return true;
            }
        }
        return false;
    }
}
