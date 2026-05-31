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
    const BASE_URL = '/api';
    const USE_MOCK = true;
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
            const error = await response.json();
            throw new Error(error.message || 'Error en la peticion');
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

            let enriched = tours.map((t) => Schema.enrichTour(t, state));

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

    async function getDisponibilidad(tourId, fecha) {
        if (USE_MOCK) {
            await mockDelay(150);
            const state = db();
            const cupos = Schema.getCupoDisponible(parseInt(tourId, 10), fecha, state);
            const tour = state.tours.find((t) => t.id === parseInt(tourId, 10));
            const precios = tour ? Schema.getPrecioTour(tour, fecha, state) : null;
            return {
                tour_id: parseInt(tourId, 10),
                fecha_servicio: fecha,
                cupos_disponibles: cupos,
                cupo_maximo: tour ? tour.cupo_maximo : 0,
                precios
            };
        }
        return request(`/public/tours/${tourId}/disponibilidad?fecha=${fecha}`);
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
            const cupos = Schema.getCupoDisponible(tour.id, fecha, state);

            if (personas > cupos) {
                throw new Error('No hay cupos suficientes para la fecha seleccionada');
            }

            const turistaId = datos.turista_id || getTuristaSessionId();
            if (!turistaId) throw new Error('Debes iniciar sesion para reservar');

            const tipoTurista = datos.tipo_turista || 'nacional';
            const precios = Schema.getPrecioTour(tour, fecha, state);
            const precioUnitario = tipoTurista === 'extranjero'
                ? precios.precio_extranjero
                : precios.precio_nacional;

            let descuento = 0;
            if (datos.codigo_cupon) {
                const cupon = state.cupones.find((c) =>
                    c.agencia_id === AGENCIA_ID &&
                    c.codigo.toUpperCase() === datos.codigo_cupon.toUpperCase() &&
                    c.activo === 1
                );
                if (cupon) {
                    const subtotal = precioUnitario * personas;
                    descuento = cupon.tipo === 'porcentaje'
                        ? subtotal * (cupon.valor / 100)
                        : cupon.valor;
                }
            }

            const total = Math.max(0, (precioUnitario * personas) - descuento);
            const adelanto = datos.monto_adelanto || 0;
            const saldo = Math.max(0, total - adelanto);

            const nuevaReserva = {
                id: state.reservas.length ? Math.max(...state.reservas.map((r) => r.id)) + 1 : 1,
                agencia_id: AGENCIA_ID,
                tour_id: tour.id,
                turista_id: turistaId,
                vendedor_id: null,
                cupon_id: null,
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
                created_at: new Date().toISOString()
            };

            state.reservas.push(nuevaReserva);
            persist(state);

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
        if (USE_MOCK) {
            await mockDelay();
            const state = db();
            const id = turistaId || getTuristaSessionId();
            if (!id) return [];
            return state.reservas
                .filter((r) => r.turista_id === id)
                .map((r) => Schema.enrichReserva(r, state));
        }
        return request(`/public/turistas/${turistaId}/reservas`);
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
            persist(state);
            return { success: true, reserva: Schema.enrichReserva(reserva, state) };
        }
        return request(`/public/reservas/${reservaId}/cancelar`, {
            method: 'PUT',
            body: JSON.stringify({ motivo })
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
        crearReserva,
        getReservasUsuario,
        getReservaById,
        cancelarReserva,
        reprogramarReserva,
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
