# Tarapoto Tours

Frontend del **Modelo Cliente** (portal publico del turista) — HTML + CSS + JavaScript vanilla.

Backend futuro: **Java + MySQL** usando el esquema en `database/bd_turismo_tarapoto.sql`.

## Como abrirlo

1. Copia la carpeta en `htdocs` (XAMPP).
2. Enciende Apache.
3. Abre:

```text
http://localhost/turitours/public/
```

## Arquitectura frontend (mock → Java)

```
public/
  js/
    data.js    → Datos mock con la misma estructura que las tablas MySQL
    schema.js  → Adaptadores BD → objetos para la UI
    api.js     → Capa API (USE_MOCK=true; luego fetch a /api/public/*)
    app.js     → Renderizado compartido
    auth.js    → Login/registro turista (tabla turistas)
database/
  bd_turismo_tarapoto.sql  → Esquema oficial del proyecto
```

### Flujo de datos

1. `data.js` simula filas de tablas: `tours`, `destinos`, `categorias_tour`, `turistas`, `reservas`, etc.
2. `schema.js` enriquece tours con imagenes (`tour_imagenes`), ratings (`resenas`), cupos y precios (`temporadas`).
3. `api.js` expone metodos que el backend Java implementara despues.
4. Las reservas mock se persisten en `localStorage` (`turismo_tarapoto_mock_db`).

### Cuenta demo

- Email: `kevin@example.com`
- Password: `demo1234`

### Migracion a Java

En `api.js`, cambiar:

```javascript
const USE_MOCK = false;
const BASE_URL = 'http://localhost:8080/api';
```

Los endpoints previstos estan documentados al inicio de `api.js`.

## Alcance actual (Modelo Cliente)

| Modulo informe | Estado frontend |
|---|---|
| RF-C01 Catalogo publico | Parcial (filtros + mock) |
| RF-C02 Detalle tour | Parcial (precio nacional/extranjero, itinerario) |
| RF-C03 Cotizador | Parcial (tipo turista en reserva) |
| RF-C04 Reserva + concurrencia | Mock (validacion cupos en JS) |
| RF-C05 Registro/login turista | Mock funcional |
| RF-C06 Mis reservas | Implementado (lista, voucher QR, anular, reprogramar mock) |
| RF-C07 Notificaciones email | Pendiente |
| RF-C08 Resenas | Solo lectura desde mock |

Modelo Negocio y SuperAdmin: pendientes (otro frontend / panel).

## Estructura legacy

- `archive/` — respaldo Next.js
- `lib/api.ts` — tipos TypeScript de referencia (no usado en public/)
