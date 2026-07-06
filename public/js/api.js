/**
 * API Service — Modelo Cliente (portal publico)
 * Mock alineado con database/bd_turismo_tarapoto.sql
 * Backend futuro: Java + MySQL en BASE_URL
 *
 * Endpoints previstos:
 * GET  /api/public/categorias
 * GET  /api/public/destinos
 * GET  /api/public/tours
 * GET  /api/public/tours/:id
 * GET  /api/public/tours/:id/disponibilidad?fecha=
 * POST /api/public/reservas
 * POST /api/public/auth/login
 * POST /api/public/auth/registro
 * GET  /api/public/auth/me
 * GET  /api/public/turistas/:id/reservas
 */

const API = (function() {
    const BASE_URL = 'http://localhost:3000/api';
    const USE_MOCK = false;
    const AGENCIA_ID = Schema.AGENCIA_DEFAULT_ID;

    const mockDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    function db() {
        return getMockDb();
    }

    function persist(dbState) {
        saveMockDb(dbState);
    }

    async function request(endpoint, options = {}) {
        const url = `${BASE_URL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` })
            }
        };

        const response = await fetch(url, { ...defaultOptions, ...options });
        if (!response.ok) {
            let errorData;
            try { errorData = await response.json(); } catch(e) { errorData = {}; }
            throw new Error(errorData.message || errorData.error || 'Error en la peticion');
        }
        return response.json();
    }

    function getAuthToken() {
        return localStorage.getItem('authToken');
    }

    function setAuthToken(token) {
        localStorage.setItem('authToken', token);
    }

    function removeAuthToken() {
        localStorage.removeItem('authToken');
    }

    function getTuristaSessionId() {
        const raw = localStorage.getItem('turistaSession');
        return raw ? JSON.parse(raw).id : null;
    }

    function setTuristaSession(turista) {
        localStorage.setItem('turistaSession', JSON.stringify({ id: turista.id }));
    }

    function clearTuristaSession() {
        localStorage.removeItem('turistaSession');
    }

    function toursActivos(state) {
        return state.tours.filter((t) => t.agencia_id === AGENCIA_ID && t.estado === 'activo');
    }

    function findDestinoByNombre(state, nombre) {
        return state.destinos.find((d) =>
            d.agencia_id === AGENCIA_ID &&
            d.nombre.toLowerCase().includes(String(nombre).toLowerCase())
        );
    }

    // --- Categorias (tabla: categorias_tour) ---

    async function getCategorias() {
        if (USE_MOCK) {
            await mockDelay();
            return db().categorias_tour
                .filter((c) => c.agencia_id === AGENCIA_ID)
                .map(Schema.enrichCategoria);
        }
        return request('/public/categorias');
    }

    // --- Destinos (tabla: destinos) ---

    async function getDestinos() {
        if (USE_MOCK) {
            await mockDelay();
            const state = db();
            return state.destinos
                .filter((d) => d.agencia_id === AGENCIA_ID && d.activo === 1)
                .map((d) => Schema.enrichDestino(d, state));
        }
        return request('/public/destinos');
    }

    async function getDestinoById(id) {
        if (USE_MOCK) {
            await mockDelay();
            const state = db();
            const destino = state.destinos.find((d) => d.id === parseInt(id, 10));
            return destino ? Schema.enrichDestino(destino, state) : null;
        }
        return request(`/public/destinos/${id}`);
    }

    // --- Tours (tabla: tours + tour_imagenes + resenas) ---

    async function getTours(filtros = {}) {
        if (USE_MOCK) {
            await mockDelay(400);
            const state = db();
            let tours = toursActivos(state);

            if (filtros.categoria) {
                tours = tours.filter((t) => t.categoria_id === parseInt(filtros.categoria, 10));
            }

            if (filtros.destino) {
                const destino = findDestinoByNombre(state, filtros.destino);
                if (destino) {
                    tours = tours.filter((t) => t.destino_id === destino.id);
                } else {
                    tours = tours.filter((t) => {
                        const d = state.destinos.find((x) => x.id === t.destino_id);
                        return d && d.nombre.toLowerCase().includes(String(filtros.destino).toLowerCase());
                    });
                }
            }

            if (filtros.precio_min) {
                tours = tours.filter((t) => t.precio_nacional >= parseFloat(filtros.precio_min));
            }

            if (filtros.precio_max) {
                tours = tours.filter((t) => t.precio_nacional <= parseFloat(filtros.precio_max));
            }

            if (filtros.busqueda) {
                const q = filtros.busqueda.toLowerCase();
                tours = tours.filter((t) =>
                    t.nombre.toLowerCase().includes(q) ||
                    (t.descripcion && t.descripcion.toLowerCase().includes(q))
                );
            }

            const fechaFiltro = filtros.fecha || null;
            let enriched = tours.map((t) => Schema.enrichTour(t, state, { fecha: fechaFiltro }));

            if (fechaFiltro && filtros.solo_disponibles) {
                enriched = enriched.filter((t) => t.cupos_disponibles > 0);
            }

            if (filtros.ordenar) {
                switch (filtros.ordenar) {
                    case 'precio_asc':
                        enriched.sort((a, b) => a.precio_nacional - b.precio_nacional);
                        break;
                    case 'precio_desc':
                        enriched.sort((a, b) => b.precio_nacional - a.precio_nacional);
                        break;
                    case 'rating':
                        enriched.sort((a, b) => b.rating - a.rating);
                        break;
                    case 'popularidad':
                        enriched.sort((a, b) => b.total_resenas - a.total_resenas);
                        break;
                }
            }

            return enriched;
        }

        const params = new URLSearchParams();
        Object.entries(filtros).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        return request(`/public/tours?${params.toString()}`);
    }

    async function getToursDestacados() {
        if (USE_MOCK) {
            await mockDelay();
            const state = db();
            return toursActivos(state)
                .map((t) => Schema.enrichTour(t, state))
                .filter((t) => t.destacado)
                .slice(0, 6);
        }
        return request('/public/tours/destacados');
    }

    async function getTourById(id, options = {}) {
        if (USE_MOCK) {
            await mockDelay(200);
            const state = db();
            const tour = state.tours.find((t) => t.id === parseInt(id, 10));
            if (!tour) throw new Error('Tour no encontrado');
            return Schema.enrichTour(tour, state, options);
        }
        const qs = options.fecha ? `?fecha=${options.fecha}` : '';
        return request(`/public/tours/${id}${qs}`);
    }

    async function getToursByCategoria(categoriaId) {
        return getTours({ categoria: categoriaId });
    }

    async function getDisponibilidad(tourId, fecha, excludeBloqueoId) {
        if (USE_MOCK) {
            await mockDelay(150);
            const state = db();
            const tid = parseInt(tourId, 10);
            const cupos = Schema.getCupoDisponible(tid, fecha, state, excludeBloqueoId);
            const tour = state.tours.find((t) => t.id === tid);
            const precios = tour ? Schema.getPrecioTour(tour, fecha, state) : null;
        
    async function enviarContacto(datos) {
        if (USE_MOCK) {
            await mockDelay(300);
            return { success: true, message: 'Mensaje enviado mock' };
        }
        return request('/public/contacto', {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    }

    return {
                tour_id: tid,
                fecha_servicio: fecha,
                cupos_disponibles: cupos,
                cupo_maximo: tour ? tour.cupo_maximo : 0,
                precios
            };
        }
        return request(`/public/tours/${tourId}/disponibilidad?fecha=${fecha}`);
    }

    function getBloqueoMinutos(state) {
        const min = state.parametros_globales && state.parametros_globales.reserva_bloqueo_min;
        return parseInt(min, 10) || 10;
    }

    function crearNotificacion(state, datos) {
        if (!state.notificaciones) state.notificaciones = [];
        const notif = {
            id: state.notificaciones.length
                ? Math.max(...state.notificaciones.map((n) => n.id)) + 1
                : 1,
            agencia_id: AGENCIA_ID,
            turista_id: datos.turista_id || null,
            usuario_id: null,
            tipo: datos.tipo,
            destinatario: datos.destinatario,
            asunto: datos.asunto,
            cuerpo: datos.cuerpo,
            enviado: 1,
            enviado_at: new Date().toISOString(),
            error: null,
            created_at: new Date().toISOString()
        };
        state.notificaciones.push(notif);
        return notif;
    }

    async function validarCupon(codigo, subtotal) {
        if (USE_MOCK) {
            await mockDelay(200);
            if (!codigo || !codigo.trim()) {
                throw new Error('Ingresa un codigo de cupon');
            }
            const state = db();
            const hoy = new Date().toISOString().slice(0, 10);
            const cupon = state.cupones.find((c) =>
                c.agencia_id === AGENCIA_ID &&
                c.codigo.toUpperCase() === codigo.trim().toUpperCase() &&
                c.activo === 1
            );
            if (!cupon) throw new Error('Cupon no valido');
            if (cupon.fecha_inicio && hoy < cupon.fecha_inicio) {
                throw new Error('Este cupon aun no esta vigente');
            }
            if (cupon.fecha_fin && hoy > cupon.fecha_fin) {
                throw new Error('Este cupon ha expirado');
            }
            if (cupon.usos_max && cupon.usos_actuales >= cupon.usos_max) {
                throw new Error('Este cupon ya no tiene usos disponibles');
            }
            const descuento = cupon.tipo === 'porcentaje'
                ? subtotal * (cupon.valor / 100)
                : cupon.valor;
        
    async function enviarContacto(datos) {
        if (USE_MOCK) {
            await mockDelay(300);
            return { success: true, message: 'Mensaje enviado mock' };
        }
        return request('/public/contacto', {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    }

    return {
                valido: true,
                cupon_id: cupon.id,
                codigo: cupon.codigo,
                descuento: Math.min(descuento, subtotal),
                descripcion: cupon.descripcion
            };
        }
        return request('/public/cupones/validar', {
            method: 'POST',
            body: JSON.stringify({ codigo, subtotal })
        });
    }

    async function bloquearCupo(datos) {
        if (USE_MOCK) {
            await mockDelay(200);
            const state = db();
            const tourId = parseInt(datos.tour_id, 10);
            const fecha = datos.fecha_servicio;
            const personas = parseInt(datos.num_personas, 10);
            const turistaId = getTuristaSessionId();
            if (!turistaId) throw new Error('Debes iniciar sesion');

            const cupos = Schema.getCupoDisponible(tourId, fecha, state);
            if (personas > cupos) {
                throw new Error('No hay cupos suficientes para bloquear');
            }

            if (!state.bloqueos_cupo) state.bloqueos_cupo = [];
            const minutos = getBloqueoMinutos(state);
            const expira = new Date(Date.now() + minutos * 60 * 1000);

            const bloqueo = {
                id: state.bloqueos_cupo.length
                    ? Math.max(...state.bloqueos_cupo.map((b) => b.id)) + 1
                    : 1,
                agencia_id: AGENCIA_ID,
                tour_id: tourId,
                turista_id: turistaId,
                fecha_servicio: fecha,
                num_personas: personas,
                expira_at: expira.toISOString(),
                created_at: new Date().toISOString()
            };
            state.bloqueos_cupo.push(bloqueo);
            persist(state);

        
    async function enviarContacto(datos) {
        if (USE_MOCK) {
            await mockDelay(300);
            return { success: true, message: 'Mensaje enviado mock' };
        }
        return request('/public/contacto', {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    }

    return {
                bloqueo_id: bloqueo.id,
                expira_at: bloqueo.expira_at,
                minutos_bloqueo: minutos
            };
        }
        return request('/public/reservas/bloquear-cupo', {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    }

    async function liberarBloqueo(bloqueoId) {
        if (USE_MOCK) {
            const state = db();
            if (!state.bloqueos_cupo) return { success: true };
            state.bloqueos_cupo = state.bloqueos_cupo.filter(
                (b) => b.id !== parseInt(bloqueoId, 10)
            );
            persist(state);
        
    async function enviarContacto(datos) {
        if (USE_MOCK) {
            await mockDelay(300);
            return { success: true, message: 'Mensaje enviado mock' };
        }
        return request('/public/contacto', {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    }

    return { success: true };
        }
        return request(`/public/reservas/bloqueos/${bloqueoId}`, { method: 'DELETE' });
    }

    // --- Reservas (tabla: reservas) ---

    async function crearReserva(datos) {
        if (USE_MOCK) {
            await mockDelay(500);
            const state = db();
            const tourId = datos.tour_id || datos.id_tour;
            const tour = state.tours.find((t) => t.id === parseInt(tourId, 10));
            if (!tour) throw new Error('Tour no encontrado');

            const fecha = datos.fecha_servicio || datos.fecha_reserva;
            const personas = parseInt(datos.num_personas, 10);
            const turistaId = datos.turista_id || getTuristaSessionId();
            if (!turistaId) throw new Error('Debes iniciar sesion para reservar');

            let excludeBloqueoId = null;
            if (datos.bloqueo_id) {
                const bloqueo = (state.bloqueos_cupo || []).find(
                    (b) => b.id === parseInt(datos.bloqueo_id, 10)
                );
                if (!bloqueo) throw new Error('El bloqueo de cupo expiro. Intenta de nuevo.');
                if (new Date(bloqueo.expira_at).getTime() <= Date.now()) {
                    throw new Error('El tiempo de reserva expiro. Selecciona de nuevo.');
                }
                if (bloqueo.turista_id !== turistaId || bloqueo.tour_id !== tour.id ||
                    bloqueo.fecha_servicio !== fecha || bloqueo.num_personas !== personas) {
                    throw new Error('Datos de reserva no coinciden con el bloqueo');
                }
                excludeBloqueoId = bloqueo.id;
            }

            const cupos = Schema.getCupoDisponible(tour.id, fecha, state, excludeBloqueoId);
            if (personas > cupos) {
                throw new Error('No hay cupos suficientes para la fecha seleccionada');
            }

            const tipoTurista = datos.tipo_turista || 'nacional';
            const precios = Schema.getPrecioTour(tour, fecha, state);
            const precioUnitario = tipoTurista === 'extranjero'
                ? precios.precio_extranjero
                : precios.precio_nacional;

            let descuento = parseFloat(datos.descuento) || 0;
            let cuponId = datos.cupon_id || null;
            if (datos.codigo_cupon) {
                const subtotal = precioUnitario * personas;
                const cuponCheck = await validarCupon(datos.codigo_cupon, subtotal);
                descuento = cuponCheck.descuento;
                cuponId = cuponCheck.cupon_id;
                const cupon = state.cupones.find((c) => c.id === cuponId);
                if (cupon) cupon.usos_actuales += 1;
            }

            const total = Math.max(0, (precioUnitario * personas) - descuento);
            const tipoPago = datos.tipo_pago || 'adelanto';
            let adelanto = parseFloat(datos.monto_adelanto) || 0;
            if (tipoPago === 'completo') {
                adelanto = total;
            } else if (!adelanto && tipoPago === 'adelanto') {
                adelanto = Math.round(total * 0.5 * 100) / 100;
            }
            const saldo = Math.max(0, total - adelanto);

            const nuevaReserva = {
                id: state.reservas.length ? Math.max(...state.reservas.map((r) => r.id)) + 1 : 1,
                agencia_id: AGENCIA_ID,
                tour_id: tour.id,
                turista_id: turistaId,
                vendedor_id: null,
                cupon_id: cuponId,
                fecha_servicio: fecha,
                hora_recojo: datos.hora_recojo || '08:00:00',
                lugar_recojo: datos.lugar_recojo || null,
                num_personas: personas,
                precio_unitario: precioUnitario,
                descuento,
                total,
                saldo_pendiente: saldo,
                moneda: 'PEN',
                canal: 'web',
                estado: adelanto >= total ? 'confirmada' : 'pendiente',
                motivo_anulacion: null,
                codigo_qr: Schema.generarCodigoQr(),
                created_at: new Date().toISOString(),
                solicitud_cambio: null
            };

            state.reservas.push(nuevaReserva);

            if (state.bloqueos_cupo && datos.bloqueo_id) {
                state.bloqueos_cupo = state.bloqueos_cupo.filter(
                    (b) => b.id !== parseInt(datos.bloqueo_id, 10)
                );
            }

            const turista = state.turistas.find((t) => t.id === turistaId);
            const email = turista && turista.email ? turista.email : 'turista@example.com';
            crearNotificacion(state, {
                turista_id: turistaId,
                tipo: 'confirmacion_reserva',
                destinatario: email,
                asunto: 'Confirmacion de reserva — ' + tour.nombre,
                cuerpo: 'Tu reserva ' + nuevaReserva.codigo_qr + ' para el ' + fecha +
                    ' fue registrada. Personas: ' + personas + '. Total: S/ ' + total.toFixed(2) +
                    (saldo > 0 ? '. Saldo pendiente: S/ ' + saldo.toFixed(2) : '.')
            });


            persist(state);

        
    async function enviarContacto(datos) {
        if (USE_MOCK) {
            await mockDelay(300);
            return { success: true, message: 'Mensaje enviado mock' };
        }
        return request('/public/contacto', {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    }

    return {
                success: true,
                reserva: Schema.enrichReserva(nuevaReserva, state)
            };
        }

        return request('/public/reservas', {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    }

    async function getReservasUsuario(turistaId) {
        const id = turistaId || getTuristaSessionId();
        if (!id) return [];

        if (USE_MOCK) {
            await mockDelay();
            const state = db();
            return state.reservas
                .filter((r) => r.turista_id === id)
                .map((r) => Schema.enrichReserva(r, state));
        }
        return request(`/public/turistas/${id}/reservas`);
    }

    async function cancelarReserva(reservaId, motivo) {
        if (USE_MOCK) {
            await mockDelay();
            const state = db();
            const reserva = state.reservas.find((r) => r.id === parseInt(reservaId, 10));
            if (!reserva) throw new Error('Reserva no encontrada');
            if (reserva.estado === 'anulada' || reserva.estado === 'completada') {
                throw new Error('Esta reserva no puede anularse');
            }
            reserva.estado = 'anulada';
            reserva.motivo_anulacion = motivo || 'Cancelada por el turista';
            const turista = state.turistas.find((t) => t.id === reserva.turista_id);
            if (turista && turista.email) {
                crearNotificacion(state, {
                    turista_id: reserva.turista_id,
                    tipo: 'anulacion',
                    destinatario: turista.email,
                    asunto: 'Reserva anulada — ' + reserva.codigo_qr,
                    cuerpo: 'Tu reserva ha sido anulada. Motivo: ' + reserva.motivo_anulacion
                });
            }
            persist(state);
        
    async function enviarContacto(datos) {
        if (USE_MOCK) {
            await mockDelay(300);
            return { success: true, message: 'Mensaje enviado mock' };
        }
        return request('/public/contacto', {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    }

    return { success: true, reserva: Schema.enrichReserva(reserva, state) };
        }
        return request(`/public/reservas/${reservaId}/cancelar`, {
            method: 'PUT',
            body: JSON.stringify({ motivo })
        });
    }

    async function solicitarReprogramacion(reservaId, fechaNueva, motivo) {
        if (USE_MOCK) {
            await mockDelay(400);
            const state = db();
            const reserva = state.reservas.find((r) => r.id === parseInt(reservaId, 10));
            if (!reserva) throw new Error('Reserva no encontrada');
            if (reserva.turista_id !== getTuristaSessionId()) {
                throw new Error('No tienes acceso a esta reserva');
            }
            if (reserva.estado === 'anulada' || reserva.estado === 'completada') {
                throw new Error('Esta reserva no puede modificarse');
            }
            if (reserva.solicitud_cambio && reserva.solicitud_cambio.estado === 'pendiente') {
                throw new Error('Ya tienes una solicitud de cambio pendiente');
            }

            const cupos = Schema.getCupoDisponible(reserva.tour_id, fechaNueva, state);
            if (reserva.num_personas > cupos) {
                throw new Error('No hay cupos suficientes para la fecha solicitada');
            }

            reserva.solicitud_cambio = {
                fecha_nueva: fechaNueva,
                motivo: motivo || 'Solicitud del turista',
                estado: 'pendiente',
                created_at: new Date().toISOString()
            };

            const turista = state.turistas.find((t) => t.id === reserva.turista_id);
            if (turista && turista.email) {
                crearNotificacion(state, {
                    turista_id: reserva.turista_id,
                    tipo: 'comunicado',
                    destinatario: turista.email,
                    asunto: 'Solicitud de cambio de fecha recibida',
                    cuerpo: 'Recibimos tu solicitud para cambiar al ' + fechaNueva +
                        '. La agencia la revisara pronto. Reserva: ' + reserva.codigo_qr
                });
            }

            persist(state);
        
    async function enviarContacto(datos) {
        if (USE_MOCK) {
            await mockDelay(300);
            return { success: true, message: 'Mensaje enviado mock' };
        }
        return request('/public/contacto', {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    }

    return { success: true, reserva: Schema.enrichReserva(reserva, state) };
        }
        return request(`/public/reservas/${reservaId}/solicitar-reprogramacion`, {
            method: 'POST',
            body: JSON.stringify({ fecha_servicio: fechaNueva, motivo })
        });
    }

    async function reprogramarReserva(reservaId, fechaNueva, motivo) {
        if (USE_MOCK) {
            await mockDelay(400);
            const state = db();
            const reserva = state.reservas.find((r) => r.id === parseInt(reservaId, 10));
            if (!reserva) throw new Error('Reserva no encontrada');
            if (reserva.estado === 'anulada' || reserva.estado === 'completada') {
                throw new Error('Esta reserva no puede reprogramarse');
            }

            const tour = state.tours.find((t) => t.id === reserva.tour_id);
            const cupos = Schema.getCupoDisponible(reserva.tour_id, fechaNueva, state);
            if (reserva.num_personas > cupos) {
                throw new Error('No hay cupos suficientes para la nueva fecha');
            }

            if (!state.reprogramaciones) state.reprogramaciones = [];

            state.reprogramaciones.push({
                id: state.reprogramaciones.length + 1,
                reserva_id: reserva.id,
                fecha_anterior: reserva.fecha_servicio,
                fecha_nueva: fechaNueva,
                motivo: motivo || 'Solicitud del turista',
                usuario_id: reserva.turista_id,
                created_at: new Date().toISOString()
            });

            reserva.fecha_servicio = fechaNueva;
            reserva.estado = 'reprogramada';
            persist(state);

        
    async function enviarContacto(datos) {
        if (USE_MOCK) {
            await mockDelay(300);
            return { success: true, message: 'Mensaje enviado mock' };
        }
        return request('/public/contacto', {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    }

    return { success: true, reserva: Schema.enrichReserva(reserva, state) };
        }

        return request(`/public/reservas/${reservaId}/reprogramar`, {
            method: 'PUT',
            body: JSON.stringify({ fecha_servicio: fechaNueva, motivo })
        });
    }

    async function getReservaById(reservaId) {
        if (USE_MOCK) {
            await mockDelay(150);
            const state = db();
            const reserva = state.reservas.find((r) => r.id === parseInt(reservaId, 10));
            if (!reserva) return null;
            const turistaId = getTuristaSessionId();
            if (turistaId && reserva.turista_id !== turistaId) {
                throw new Error('No tienes acceso a esta reserva');
            }
            return Schema.enrichReserva(reserva, state);
        }
        return request(`/public/reservas/${reservaId}`);
    }

    async function getResenasTour(tourId) {
        if (USE_MOCK) {
            await mockDelay(150);
            const state = db();
            const tid = parseInt(tourId, 10);
            return state.resenas
                .filter((r) => r.tour_id === tid && r.visible === 1)
                .map((r) => {
                    const turista = state.turistas.find((t) => t.id === r.turista_id);
                    return Object.assign({}, r, {
                        autor: turista ? turista.nombre : 'Turista'
                    });
                })
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
        return request(`/public/tours/${tourId}/resenas`);
    }

    async function publicarResena(reservaId, calificacion, comentario) {
        if (USE_MOCK) {
            await mockDelay(400);
            const state = db();
            const turistaId = getTuristaSessionId();
            if (!turistaId) throw new Error('Debes iniciar sesion');

            const reserva = state.reservas.find((r) => r.id === parseInt(reservaId, 10));
            if (!reserva || reserva.turista_id !== turistaId) {
                throw new Error('Reserva no encontrada');
            }
            if (reserva.estado !== 'completada') {
                throw new Error('Solo puedes reseñar tours completados');
            }

            const existente = state.resenas.find((r) => r.reserva_id === reserva.id);
            if (existente) throw new Error('Ya publicaste una reseña para esta reserva');

            const cal = parseInt(calificacion, 10);
            if (cal < 1 || cal > 5) throw new Error('La calificacion debe ser entre 1 y 5');

            const reseña = {
                id: state.resenas.length ? Math.max(...state.resenas.map((r) => r.id)) + 1 : 1,
                agencia_id: AGENCIA_ID,
                tour_id: reserva.tour_id,
                turista_id: turistaId,
                reserva_id: reserva.id,
                calificacion: cal,
                comentario: (comentario || '').trim(),
                visible: 1,
                created_at: new Date().toISOString().slice(0, 10)
            };
            state.resenas.push(reseña);
            persist(state);
        
    async function enviarContacto(datos) {
        if (USE_MOCK) {
            await mockDelay(300);
            return { success: true, message: 'Mensaje enviado mock' };
        }
        return request('/public/contacto', {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    }

    return { success: true, resena: reseña };
        }
        return request('/public/resenas', {
            method: 'POST',
            body: JSON.stringify({ reserva_id: reservaId, calificacion, comentario })
        });
    }

    async function getNotificacionesTurista() {
        if (USE_MOCK) {
            await mockDelay(150);
            const turistaId = getTuristaSessionId();
            if (!turistaId) return [];
            const state = db();
            const turista = state.turistas.find(t => t.id === turistaId);
            const email = turista ? turista.email : '';
            
            // Generate real notifications dynamically based on dates
            const hoyStr = new Date().toISOString().split('T')[0];
            const manana = new Date();
            manana.setDate(manana.getDate() + 1);
            const mananaStr = manana.toISOString().split('T')[0];
            
            let changed = false;
            if (state.reservas) {
                state.reservas.filter(r => r.turista_id === turistaId && r.estado !== 'anulada').forEach(r => {
                    // 24h Reminder
                    if (r.fecha_servicio === mananaStr) {
                        const hasReminder = state.notificaciones.some(n => n.turista_id === turistaId && n.tipo === 'recordatorio_24h' && n.cuerpo.includes(r.codigo_qr));
                        if (!hasReminder) {
                            const tour = state.tours.find(t => t.id === r.tour_id);
                            crearNotificacion(state, {
                                turista_id: turistaId,
                                tipo: 'recordatorio_24h',
                                destinatario: email,
                                asunto: 'Recordatorio mañana — ' + (tour ? tour.nombre : 'Tour'),
                                cuerpo: 'Recordatorio para tu tour mañana ' + r.fecha_servicio + '. Codigo: ' + r.codigo_qr
                            });
                            changed = true;
                        }
                    }
                    // Post-tour review request
                    if (r.fecha_servicio < hoyStr) {
                        const hasReviewReq = state.notificaciones.some(n => n.turista_id === turistaId && n.tipo === 'comunicado' && n.cuerpo.includes(r.codigo_qr));
                        if (!hasReviewReq) {
                            const tour = state.tours.find(t => t.id === r.tour_id);
                            crearNotificacion(state, {
                                turista_id: turistaId,
                                tipo: 'comunicado',
                                destinatario: email,
                                asunto: '¿Qué tal te pareció ' + (tour ? tour.nombre : 'el tour') + '?',
                                cuerpo: 'Esperamos que hayas disfrutado tu viaje. Déjanos una reseña para tu reserva ' + r.codigo_qr
                            });
                            changed = true;
                        }
                    }
                });
            }
            if (changed) persist(state);

            return (state.notificaciones || [])
                .filter((n) => n.turista_id === turistaId)
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
        return request('/public/auth/notificaciones');
    }

    // --- Auth turista (tabla: turistas) ---

    async function login(email, password) {
        if (USE_MOCK) {
            await mockDelay(500);
            const state = db();
            const turista = state.turistas.find((t) =>
                t.agencia_id === AGENCIA_ID &&
                t.email &&
                t.email.toLowerCase() === email.toLowerCase()
            );

            if (!turista || turista.password !== password) {
                throw new Error('Credenciales incorrectas');
            }

            const token = 'mock_token_' + Date.now();
            setAuthToken(token);
            setTuristaSession(turista);

        
    async function enviarContacto(datos) {
        if (USE_MOCK) {
            await mockDelay(300);
            return { success: true, message: 'Mensaje enviado mock' };
        }
        return request('/public/contacto', {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    }

    return {
                success: true,
                token,
                turista: Schema.enrichTurista(turista, state)
            };
        }

        const response = await request('/public/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        if (response.token) setAuthToken(response.token);
        if (response.turista) setTuristaSession(response.turista);
        return response;
    }

    async function registro(datosUsuario) {
        if (typeof TuristaValidacion !== 'undefined') {
            const check = TuristaValidacion.validarRegistro({
                tipo_doc: datosUsuario.tipo_doc,
                documento: datosUsuario.documento,
                nombre: datosUsuario.nombre,
                apellidos: datosUsuario.apellidos,
                email: datosUsuario.email || '',
                celular: datosUsuario.celular || '',
                password: datosUsuario.password,
                confirmPassword: datosUsuario.password,
                politica: true
            });
            if (!check.valido) {
                const msg = Object.values(check.errores)[0];
                throw new Error(msg);
            }
        }

        const payload = {
            tipo_doc: datosUsuario.tipo_doc || 'DNI',
            documento: (datosUsuario.documento || '').trim(),
            nombre: (datosUsuario.nombre || '').trim(),
            apellidos: (datosUsuario.apellidos || datosUsuario.apellido || '').trim(),
            email: datosUsuario.email ? String(datosUsuario.email).trim() : null,
            celular: datosUsuario.celular ? String(datosUsuario.celular).trim() : null,
            fecha_nacimiento: datosUsuario.fecha_nacimiento || null,
            pais_id: datosUsuario.pais_id ? parseInt(datosUsuario.pais_id, 10) : null,
            restricciones_medicas: datosUsuario.restricciones_medicas || null,
            password: datosUsuario.password
        };

        if (USE_MOCK) {
            await mockDelay(500);
            const state = db();

            const duplicado = state.turistas.find((t) =>
                t.agencia_id === AGENCIA_ID &&
                ((payload.email && t.email && t.email.toLowerCase() === payload.email.toLowerCase()) ||
                 (t.tipo_doc === payload.tipo_doc && t.documento === payload.documento))
            );

            if (duplicado) {
                throw new Error('Ya existe un turista con ese correo o documento');
            }

            const nuevoTurista = {
                id: state.turistas.length ? Math.max(...state.turistas.map((t) => t.id)) + 1 : 1,
                agencia_id: AGENCIA_ID,
                tipo_doc: payload.tipo_doc,
                documento: payload.documento,
                nombre: payload.nombre,
                apellidos: payload.apellidos,
                email: payload.email,
                celular: payload.celular,
                fecha_nacimiento: payload.fecha_nacimiento,
                pais_id: payload.pais_id,
                restricciones_medicas: payload.restricciones_medicas,
                notas_crm: null,
                segmento: 'normal',
                email_verificado: 0,
                password: payload.password
            };

            state.turistas.push(nuevoTurista);
            persist(state);

        
    async function enviarContacto(datos) {
        if (USE_MOCK) {
            await mockDelay(300);
            return { success: true, message: 'Mensaje enviado mock' };
        }
        return request('/public/contacto', {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    }

    return {
                success: true,
                message: 'Turista registrado exitosamente',
                turista: Schema.enrichTurista(nuevoTurista, state)
            };
        }

        return request('/public/auth/registro', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    function logout() {
        removeAuthToken();
        clearTuristaSession();
        window.location.href = 'index.html';
    }

    function isAuthenticated() {
        return !!getAuthToken() && !!getTuristaSessionId();
    }

    async function getUsuarioActual() {
        if (USE_MOCK) {
            await mockDelay();
            if (!isAuthenticated()) return null;
            const state = db();
            const turista = state.turistas.find((t) => t.id === getTuristaSessionId());
            return turista ? Schema.enrichTurista(turista, state) : null;
        }
        return request('/public/auth/me');
    }

    async function getPaises() {
        if (USE_MOCK) {
            await mockDelay(100);
            if (typeof PAISES_CATALOGO !== 'undefined' && PAISES_CATALOGO.length) {
                return PAISES_CATALOGO;
            }
            return db().paises;
        }
        return request('/public/paises');
    }

    async function getAgenciaPublica() {
        if (USE_MOCK) {
            await mockDelay(100);
            return db().agencias.find((a) => a.id === AGENCIA_ID);
        }
        return request('/public/agencia');
    }

    async function getParametrosGlobales() {
        if (USE_MOCK) {
            await mockDelay(50);
            return db().parametros_globales;
        }
        return request('/public/parametros');
    }

    async function actualizarPerfil(datos) {
        if (typeof TuristaValidacion !== 'undefined') {
            const check = TuristaValidacion.validarPerfil(datos);
            if (!check.valido) {
                throw new Error(Object.values(check.errores)[0]);
            }
        }

        const turistaId = getTuristaSessionId();
        if (!turistaId) throw new Error('Debes iniciar sesion');

        const payload = {
            nombre: (datos.nombre || '').trim(),
            apellidos: (datos.apellidos || '').trim(),
            email: datos.email ? String(datos.email).trim() : null,
            celular: datos.celular ? String(datos.celular).trim() : null,
            pais_id: datos.pais_id ? parseInt(datos.pais_id, 10) : null,
            restricciones_medicas: datos.restricciones_medicas ? String(datos.restricciones_medicas).trim() : null,
            fecha_nacimiento: datos.fecha_nacimiento || null,
            password_actual: datos.password_actual || null,
            password_nueva: datos.password_nueva || null
        };

        if (USE_MOCK) {
            await mockDelay(400);
            const state = db();
            const index = state.turistas.findIndex((t) =>
                t.id === turistaId && t.agencia_id === AGENCIA_ID
            );
            if (index === -1) throw new Error('Turista no encontrado');

            const turista = state.turistas[index];

            if (payload.email) {
                const emailDuplicado = state.turistas.find((t) =>
                    t.id !== turistaId &&
                    t.agencia_id === AGENCIA_ID &&
                    t.email &&
                    t.email.toLowerCase() === payload.email.toLowerCase()
                );
                if (emailDuplicado) throw new Error('Ya existe otra cuenta con ese correo');
            }

            if (payload.password_nueva) {
                if (turista.password !== payload.password_actual) {
                    throw new Error('La contrasena actual no es correcta');
                }
                turista.password = payload.password_nueva;
            }

            turista.nombre = payload.nombre;
            turista.apellidos = payload.apellidos;
            turista.email = payload.email;
            turista.celular = payload.celular;
            turista.pais_id = payload.pais_id;
            turista.restricciones_medicas = payload.restricciones_medicas;
            turista.fecha_nacimiento = payload.fecha_nacimiento;

            state.turistas[index] = turista;
            persist(state);

        
    async function enviarContacto(datos) {
        if (USE_MOCK) {
            await mockDelay(300);
            return { success: true, message: 'Mensaje enviado mock' };
        }
        return request('/public/contacto', {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    }

    return {
                success: true,
                message: 'Perfil actualizado',
                turista: Schema.enrichTurista(turista, state)
            };
        }

        return request('/public/auth/perfil', {
            method: 'PUT',
            body: JSON.stringify(payload)
        });
    }


    async function enviarContacto(datos) {
        if (USE_MOCK) {
            await mockDelay(300);
            return { success: true, message: 'Mensaje enviado mock' };
        }
        return request('/public/contacto', {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    }

    return {
        AGENCIA_ID,
        USE_MOCK,
        getCategorias,
        getDestinos,
        getDestinoById,
        getTours,
        getToursDestacados,
        getTourById,
        getToursByCategoria,
        getDisponibilidad,
        validarCupon,
        enviarContacto,
        bloquearCupo,
        liberarBloqueo,
        crearReserva,
        getReservasUsuario,
        getReservaById,
        cancelarReserva,
        solicitarReprogramacion,
        reprogramarReserva,
        getResenasTour,
        publicarResena,
        getNotificacionesTurista,
        login,
        registro,
        logout,
        isAuthenticated,
        getUsuarioActual,
        actualizarPerfil,
        getPaises,
        getAgenciaPublica,
        getParametrosGlobales
    };
})();

if (typeof window !== 'undefined') {
    window.API = API;
}
