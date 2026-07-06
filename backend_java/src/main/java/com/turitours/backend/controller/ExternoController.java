package com.turitours.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.ParameterizedTypeReference;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/externo")
@CrossOrigin(origins = "*")
public class ExternoController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String API_KEY = "inti_live_222964297c8269d6159d995e53e15d62";

    @GetMapping("/dni/{dni}")
    public ResponseEntity<?> consultarDNI(@PathVariable String dni) {
        if (dni == null || dni.length() != 8) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "DNI inválido"));
        }

        try {
            String url = "https://app.apiinti.dev/api/v1/dni/" + dni;
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + API_KEY);
            HttpEntity<String> entity = new HttpEntity<>("parameters", headers);
            
            ResponseEntity<Map<String, Object>> responseEntity = restTemplate.exchange(
                url, 
                HttpMethod.GET, 
                entity, 
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            Map<String, Object> apiRes = responseEntity.getBody();
            
            if (apiRes != null && Boolean.TRUE.equals(apiRes.get("success"))) {
                @SuppressWarnings("unchecked")
                Map<String, Object> data = (Map<String, Object>) apiRes.get("data");
                String nombres = (String) data.get("nombres");
                String apellidoP = (String) data.get("apellidoPaterno");
                String apellidoM = (String) data.get("apellidoMaterno");
                
                String nombreCompleto = nombres + " " + apellidoP + " " + apellidoM;
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("nombre", nombreCompleto.trim());
                response.put("raw", data);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "DNI no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "Error conectando a RENIEC"));
        }
    }

    @GetMapping("/ruc/{ruc}")
    public ResponseEntity<?> consultarRUC(@PathVariable String ruc) {
        if (ruc == null || ruc.length() != 11) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "RUC inválido"));
        }

        try {
            String url = "https://app.apiinti.dev/api/v1/ruc/" + ruc;
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + API_KEY);
            HttpEntity<String> entity = new HttpEntity<>("parameters", headers);
            
            ResponseEntity<Map<String, Object>> responseEntity = restTemplate.exchange(
                url, 
                HttpMethod.GET, 
                entity, 
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            Map<String, Object> apiRes = responseEntity.getBody();
            
            if (apiRes != null && Boolean.TRUE.equals(apiRes.get("success"))) {
                @SuppressWarnings("unchecked")
                Map<String, Object> data = (Map<String, Object>) apiRes.get("data");
                String razonSocial = (String) data.get("razonSocial");
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("nombre", razonSocial);
                response.put("raw", data);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "RUC no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "Error conectando a SUNAT"));
        }
    }
}
