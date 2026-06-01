/**
 * Admin API Service — Modelo Negocio
 * Mock alineado con database/bd_turismo_tarapoto.sql
 * Backend futuro: Java + MySQL en BASE_URL
 */
const AdminAPI = (function () {
    const AGENCIA_ID = 1;
    const MAX_INTENTOS = 3;
    const delay = (ms) => new Promise((r) => setTimeout(r, ms || 200));

    function adb() { return getAdminDb(); }
    function cdb() { return getMockDb(); }
    function saveA(s) { saveAdminDb(s); }
    function saveC(s) { saveMockDb(s); }

    /* ─── Session helpers ─── */
    function setSession(user) {
        localStorage.setItem('admin_session', JSON.stringify({
            id: user.id, rol_id: user.rol_id, nombre: user.nombre, email: user.email
        }));
    }
    function getSession() {
        try { return JSON.parse(localStorage.getItem('admin_session')); } catch (_) { return null; }
    }
    function clearSession() { localStorage.removeItem('admin_session'); }
    function isAdminAuth() { return !!getSession(); }

    function getUsuarioActualSync() { return getSession(); }

    /* ─── Audit log helper ─── */
    function registrarLog(state, datos) {
        if (!state.logs_auditoria) state.logs_auditoria = [];
        state.logs_auditoria.push({
            id: state.logs_auditoria.length ? Math.max(...state.logs_auditoria.map(l => l.id)) + 1 : 1,
            agencia_id: AGENCIA_ID,
            usuario_id: datos.usuario_id || (getSession() ? getSession().id : null),
            accion: datos.accion,
            tabla_afectada: datos.tabla,
            registro_id: datos.registro_id || null,
            valor_anterior: datos.anterior || null,
            valor_nuevo: datos.nuevo || null,
            ip: '192.168.1.' + Math.floor(Math.random() * 50 + 10),
            created_at: new Date().toISOString()
        });
    }

    /* ═══════════════════════════════════════
       AUTH
       ═══════════════════════════════════════ */
    async function login(email, password) {
        await delay(500);
        const state = adb();
        const user = state.usuarios.find(u =>
            u.agencia_id === AGENCIA_ID &&
            u.email.toLowerCase() === email.toLowerCase()
        );
        if (!user) throw new Error('Credenciales incorrectas');
        if (user.bloqueado) throw new Error('Cuenta bloqueada. Contacte al administrador.');
        if (!user.activo) throw new Error('Cuenta inhabilitada.');

        if (user.password_hash !== password) {
            user.intentos_fallidos = (user.intentos_fallidos || 0) + 1;
            if (user.intentos_fallidos >= MAX_INTENTOS) {
                user.bloqueado = 1;
                registrarLog(state, { accion: 'BLOQUEO', tabla: 'usuarios', registro_id: user.id, nuevo: JSON.stringify({ motivo: 'Max intentos fallidos' }) });
            }
            saveA(state);
            const restantes = MAX_INTENTOS - user.intentos_fallidos;
            if (user.bloqueado) throw new Error('Cuenta bloqueada por multiples intentos fallidos.');
            throw new Error('Credenciales incorrectas. ' + restantes + ' intento(s) restante(s).');
        }

        user.intentos_fallidos = 0;
        user.ultimo_login = new Date().toISOString();
        // Registrar sesion
        if (!state.sesiones) state.sesiones = [];
        state.sesiones.push({
            id: state.sesiones.length ? Math.max(...state.sesiones.map(s => s.id)) + 1 : 1,
            usuario_id: user.id,
            ip: '192.168.1.' + Math.floor(Math.random() * 50 + 10),
            dispositivo: navigator.userAgent.substring(0, 80),
            login_at: new Date().toISOString(),
            logout_at: null
        });
        registrarLog(state, { accion: 'LOGIN', tabla: 'sesiones', registro_id: user.id, usuario_id: user.id });
        saveA(state);
        setSession(user);

        const rol = state.roles.find(r => r.id === user.rol_id);
        return { success: true, usuario: { ...user, rol_nombre: rol ? rol.nombre : 'Sin rol' } };
    }

    function logout() {
        const session = getSession();
        if (session) {
            const state = adb();
            const activa = (state.sesiones || []).filter(s => s.usuario_id === session.id && !s.logout_at).pop();
            if (activa) activa.logout_at = new Date().toISOString();
            registrarLog(state, { accion: 'LOGOUT', tabla: 'sesiones', registro_id: session.id, usuario_id: session.id });
            saveA(state);
        }
        clearSession();
        window.location.href = 'login.html';
    }

    /* ═══════════════════════════════════════
       PERMISOS
       ═══════════════════════════════════════ */
    function tienePermiso(modulo, accion) {
        const session = getSession();
        if (!session) return false;
        const state = adb();
        const permiso = state.permisos.find(p => p.rol_id === session.rol_id && p.modulo === modulo);
        if (!permiso) return false;
        const mapa = { ver: 'puede_ver', crear: 'puede_crear', editar: 'puede_editar', eliminar: 'puede_eliminar' };
        return permiso[mapa[accion] || 'puede_ver'] === 1;
    }

    function getPermisosRol(rolId) {
        const state = adb();
        return state.permisos.filter(p => p.rol_id === rolId);
    }

    function getModulosPermitidos() {
        const session = getSession();
        if (!session) return [];
        const state = adb();
        return state.permisos
            .filter(p => p.rol_id === session.rol_id && p.puede_ver === 1)
            .map(p => p.modulo);
    }

    /* ═══════════════════════════════════════
       USUARIOS (PERSONAL)
       ═══════════════════════════════════════ */
    async function getUsuarios() {
        await delay();
        const state = adb();
        return state.usuarios
            .filter(u => u.agencia_id === AGENCIA_ID)
            .map(u => {
                const rol = state.roles.find(r => r.id === u.rol_id);
                return { ...u, rol_nombre: rol ? rol.nombre : 'Sin rol' };
            });
    }

    async function crearUsuario(datos) {
        await delay(400);
        const state = adb();
        if (state.usuarios.find(u => u.agencia_id === AGENCIA_ID && u.dni === datos.dni))
            throw new Error('Ya existe un usuario con ese DNI');
        if (state.usuarios.find(u => u.agencia_id === AGENCIA_ID && u.email.toLowerCase() === datos.email.toLowerCase()))
            throw new Error('Ya existe un usuario con ese email');

        const nuevo = {
            id: state.usuarios.length ? Math.max(...state.usuarios.map(u => u.id)) + 1 : 1,
            agencia_id: AGENCIA_ID,
            rol_id: parseInt(datos.rol_id, 10),
            nombre: datos.nombre.trim(),
            dni: datos.dni.trim(),
            email: datos.email.trim().toLowerCase(),
            telefono: datos.telefono || null,
            password_hash: datos.password || 'temp1234',
            intentos_fallidos: 0, bloqueado: 0, activo: 1,
            ultimo_login: null,
            created_at: new Date().toISOString()
        };
        state.usuarios.push(nuevo);
        registrarLog(state, { accion: 'CREATE', tabla: 'usuarios', registro_id: nuevo.id, nuevo: JSON.stringify({ nombre: nuevo.nombre, dni: nuevo.dni }) });
        saveA(state);
        return { success: true, usuario: nuevo };
    }

    async function inhabilitarUsuario(userId) {
        await delay(300);
        const state = adb();
        const user = state.usuarios.find(u => u.id === parseInt(userId, 10));
        if (!user) throw new Error('Usuario no encontrado');
        const anterior = JSON.stringify({ activo: user.activo, bloqueado: user.bloqueado });
        user.activo = 0;
        user.bloqueado = 1;
        registrarLog(state, { accion: 'INHABILITAR', tabla: 'usuarios', registro_id: user.id, anterior, nuevo: JSON.stringify({ activo: 0, bloqueado: 1 }) });
        saveA(state);
        return { success: true };
    }

    async function reactivarUsuario(userId) {
        await delay(300);
        const state = adb();
        const user = state.usuarios.find(u => u.id === parseInt(userId, 10));
        if (!user) throw new Error('Usuario no encontrado');
        user.activo = 1;
        user.bloqueado = 0;
        user.intentos_fallidos = 0;
        registrarLog(state, { accion: 'REACTIVAR', tabla: 'usuarios', registro_id: user.id, nuevo: JSON.stringify({ activo: 1, bloqueado: 0 }) });
        saveA(state);
        return { success: true };
    }

    async function getRoles() {
        await delay(100);
        return adb().roles.filter(r => r.agencia_id === AGENCIA_ID);
    }

    /* ═══════════════════════════════════════
       RESERVAS INTERNAS
       ═══════════════════════════════════════ */
    async function getReservasInternas(filtros) {
        await delay(300);
        const cs = cdb();
        const as = adb();
        filtros = filtros || {};
        let reservas = cs.reservas.filter(r => r.agencia_id === AGENCIA_ID);

        if (filtros.estado) reservas = reservas.filter(r => r.estado === filtros.estado);
        if (filtros.tour_id) reservas = reservas.filter(r => r.tour_id === parseInt(filtros.tour_id, 10));
        if (filtros.fecha) reservas = reservas.filter(r => r.fecha_servicio === filtros.fecha);
        if (filtros.busqueda) {
            const q = filtros.busqueda.toLowerCase();
            reservas = reservas.filter(r => {
                const turista = cs.turistas.find(t => t.id === r.turista_id);
                const tour = cs.tours.find(t => t.id === r.tour_id);
                return (r.codigo_qr && r.codigo_qr.toLowerCase().includes(q)) ||
                    (turista && (turista.nombre + ' ' + turista.apellidos).toLowerCase().includes(q)) ||
                    (tour && tour.nombre.toLowerCase().includes(q));
            });
        }

        return reservas.map(r => {
            const turista = cs.turistas.find(t => t.id === r.turista_id);
            const tour = cs.tours.find(t => t.id === r.tour_id);
            const vendedor = r.vendedor_id ? as.usuarios.find(u => u.id === r.vendedor_id) : null;
            return {
                ...r,
                turista_nombre: turista ? turista.nombre + ' ' + turista.apellidos : 'Desconocido',
                turista_doc: turista ? turista.tipo_doc + ' ' + turista.documento : '',
                tour_nombre: tour ? tour.nombre : 'Tour eliminado',
                vendedor_nombre: vendedor ? vendedor.nombre : (r.canal === 'web' ? 'Portal web' : '—')
            };
        }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    async function anularReserva(reservaId, motivo) {
        await delay(400);
        const cs = cdb();
        const as = adb();
        const reserva = cs.reservas.find(r => r.id === parseInt(reservaId, 10));
        if (!reserva) throw new Error('Reserva no encontrada');
        if (reserva.estado === 'anulada') throw new Error('Ya esta anulada');
        if (reserva.estado === 'completada') throw new Error('No se puede anular una reserva completada');
        const anterior = JSON.stringify({ estado: reserva.estado });
        reserva.estado = 'anulada';
        reserva.motivo_anulacion = motivo || 'Anulada por el personal';
        saveC(cs);
        registrarLog(as, { accion: 'ANULAR', tabla: 'reservas', registro_id: reserva.id, anterior, nuevo: JSON.stringify({ estado: 'anulada', motivo: reserva.motivo_anulacion }) });
        saveA(as);
        return { success: true };
    }

    async function confirmarReserva(reservaId) {
        await delay(300);
        const cs = cdb();
        const as = adb();
        const reserva = cs.reservas.find(r => r.id === parseInt(reservaId, 10));
        if (!reserva) throw new Error('Reserva no encontrada');
        if (reserva.estado !== 'pendiente') throw new Error('Solo se pueden confirmar reservas pendientes');
        const anterior = JSON.stringify({ estado: reserva.estado });
        reserva.estado = 'confirmada';
        saveC(cs);
        registrarLog(as, { accion: 'CONFIRMAR', tabla: 'reservas', registro_id: reserva.id, anterior, nuevo: JSON.stringify({ estado: 'confirmada' }) });
        saveA(as);
        return { success: true };
    }

    async function crearReservaInterna(datos) {
        await delay(400);
        const cs = cdb();
        const as = adb();
        const session = getSession();

        let turista = cs.turistas.find(t => t.documento === datos.documento && t.tipo_doc === datos.tipo_doc);
        if (!turista) {
            turista = {
                id: cs.turistas.length ? Math.max(...cs.turistas.map(t => t.id)) + 1 : 1,
                agencia_id: AGENCIA_ID,
                tipo_doc: datos.tipo_doc,
                documento: datos.documento,
                nombre: datos.nombre,
                apellidos: datos.apellidos || '',
                email: datos.email || null,
                telefono: datos.telefono || null,
                fecha_nacimiento: null, pais_id: 1,
                segmento: 'normal', email_verificado: 0,
                password: null
            };
            cs.turistas.push(turista);
            registrarLog(as, { accion: 'CREATE', tabla: 'turistas', registro_id: turista.id, nuevo: JSON.stringify({ documento: turista.documento }) });
        }

        const tour = cs.tours.find(t => t.id === parseInt(datos.tour_id, 10));
        if (!tour) throw new Error('Tour no encontrado');

        const numPersonas = parseInt(datos.num_personas, 10);
        const total = numPersonas * tour.precio_nacional;

        const reserva = {
            id: cs.reservas.length ? Math.max(...cs.reservas.map(r => r.id)) + 1 : 1,
            agencia_id: AGENCIA_ID,
            tour_id: tour.id,
            turista_id: turista.id,
            vendedor_id: session ? session.id : null,
            cupon_id: null,
            fecha_servicio: datos.fecha_servicio,
            hora_recojo: datos.hora_recojo || null,
            lugar_recojo: datos.lugar_recojo || null,
            num_personas: numPersonas,
            precio_unitario: tour.precio_nacional,
            descuento: 0,
            total: total,
            saldo_pendiente: total,
            moneda: 'PEN',
            canal: 'interno',
            estado: 'confirmada',
            motivo_anulacion: null,
            codigo_qr: 'QR-TPT-INT' + Math.floor(Math.random() * 10000),
            created_at: new Date().toISOString()
        };
        cs.reservas.push(reserva);
        saveC(cs);
        registrarLog(as, { accion: 'CREATE', tabla: 'reservas', registro_id: reserva.id, nuevo: JSON.stringify({ total: reserva.total }) });
        saveA(as);
        
        return { success: true, reserva };
    }

    /* ═══════════════════════════════════════
       CAJA Y TESORERIA
       ═══════════════════════════════════════ */
    async function getCajaActiva() {
        await delay(100);
        const state = adb();
        return state.cajas.find(c => c.agencia_id === AGENCIA_ID && c.estado === 'abierta') || null;
    }

    async function abrirCaja(montoApertura) {
        await delay(400);
        const state = adb();
        const existente = state.cajas.find(c => c.agencia_id === AGENCIA_ID && c.estado === 'abierta');
        if (existente) throw new Error('Ya hay una caja abierta');
        const session = getSession();
        const nueva = {
            id: state.cajas.length ? Math.max(...state.cajas.map(c => c.id)) + 1 : 1,
            agencia_id: AGENCIA_ID,
            cajero_id: session ? session.id : 3,
            nombre_caja: 'Caja Principal',
            monto_apertura: parseFloat(montoApertura),
            monto_cierre_sistema: null, monto_cierre_real: null, diferencia: null,
            estado: 'abierta',
            abierta_at: new Date().toISOString(),
            cerrada_at: null
        };
        state.cajas.push(nueva);
        registrarLog(state, { accion: 'APERTURA_CAJA', tabla: 'cajas', registro_id: nueva.id, nuevo: JSON.stringify({ monto_apertura: nueva.monto_apertura }) });
        saveA(state);
        return { success: true, caja: nueva };
    }

    async function registrarPago(datos) {
        await delay(300);
        const state = adb();
        const caja = state.cajas.find(c => c.agencia_id === AGENCIA_ID && c.estado === 'abierta');
        if (!caja) throw new Error('No hay caja abierta');
        const session = getSession();
        const monto = parseFloat(datos.monto);
        const recibido = datos.monto_recibido ? parseFloat(datos.monto_recibido) : null;
        const vuelto = (recibido && datos.tipo !== 'egreso') ? Math.max(0, recibido - monto) : null;

        const pago = {
            id: state.pagos.length ? Math.max(...state.pagos.map(p => p.id)) + 1 : 1,
            agencia_id: AGENCIA_ID,
            caja_id: caja.id,
            reserva_id: datos.reserva_id ? parseInt(datos.reserva_id, 10) : null,
            cajero_id: session ? session.id : 3,
            tipo: datos.tipo,
            metodo: datos.metodo,
            monto, monto_recibido: recibido, vuelto,
            concepto: datos.concepto || null,
            comprobante_ref: datos.comprobante_ref || null,
            created_at: new Date().toISOString()
        };
        state.pagos.push(pago);

        // Actualizar saldo pendiente de la reserva si aplica
        if (pago.reserva_id && pago.tipo !== 'egreso') {
            const cs = cdb();
            const reserva = cs.reservas.find(r => r.id === pago.reserva_id);
            if (reserva) {
                reserva.saldo_pendiente = Math.max(0, reserva.saldo_pendiente - monto);
                if (reserva.saldo_pendiente <= 0 && reserva.estado === 'pendiente') {
                    reserva.estado = 'confirmada';
                }
                saveC(cs);
            }
        }

        registrarLog(state, { accion: 'CREATE', tabla: 'pagos', registro_id: pago.id, nuevo: JSON.stringify({ monto: pago.monto, tipo: pago.tipo, metodo: pago.metodo }) });
        saveA(state);
        return { success: true, pago, vuelto };
    }

    async function getPagosCaja(cajaId) {
        await delay(150);
        const state = adb();
        return state.pagos.filter(p => p.caja_id === parseInt(cajaId, 10))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    async function cerrarCaja(montoReal) {
        await delay(500);
        const state = adb();
        const caja = state.cajas.find(c => c.agencia_id === AGENCIA_ID && c.estado === 'abierta');
        if (!caja) throw new Error('No hay caja abierta');

        const pagos = state.pagos.filter(p => p.caja_id === caja.id);
        const ingresos = pagos.filter(p => p.tipo !== 'egreso').reduce((s, p) => s + p.monto, 0);
        const egresos = pagos.filter(p => p.tipo === 'egreso').reduce((s, p) => s + p.monto, 0);
        const sistema = caja.monto_apertura + ingresos - egresos;

        caja.monto_cierre_sistema = Math.round(sistema * 100) / 100;
        caja.monto_cierre_real = parseFloat(montoReal);
        caja.diferencia = Math.round((caja.monto_cierre_real - caja.monto_cierre_sistema) * 100) / 100;
        caja.estado = 'cerrada';
        caja.cerrada_at = new Date().toISOString();

        registrarLog(state, {
            accion: 'CIERRE_CAJA', tabla: 'cajas', registro_id: caja.id,
            nuevo: JSON.stringify({ sistema: caja.monto_cierre_sistema, real: caja.monto_cierre_real, diferencia: caja.diferencia })
        });
        saveA(state);
        return { success: true, caja };
    }

    async function getHistorialCajas() {
        await delay(200);
        const state = adb();
        return state.cajas
            .filter(c => c.agencia_id === AGENCIA_ID)
            .map(c => {
                const cajero = state.usuarios.find(u => u.id === c.cajero_id);
                return { ...c, cajero_nombre: cajero ? cajero.nombre : '—' };
            })
            .sort((a, b) => new Date(b.abierta_at) - new Date(a.abierta_at));
    }

    /* ═══════════════════════════════════════
       DASHBOARD KPIs
       ═══════════════════════════════════════ */
    async function getDashboardKPIs() {
        await delay(300);
        const cs = cdb();
        const as = adb();
        const hoy = new Date().toISOString().slice(0, 10);

        // Ventas del dia
        const reservasHoy = cs.reservas.filter(r => r.agencia_id === AGENCIA_ID && r.created_at && r.created_at.slice(0, 10) === hoy);
        const ventasHoy = reservasHoy.reduce((s, r) => s + (r.total || 0), 0);

        // Pagos del dia en caja
        const pagosHoy = as.pagos.filter(p => p.created_at && p.created_at.slice(0, 10) === hoy);
        const ingresosHoy = pagosHoy.filter(p => p.tipo !== 'egreso').reduce((s, p) => s + p.monto, 0);
        const egresosHoy = pagosHoy.filter(p => p.tipo === 'egreso').reduce((s, p) => s + p.monto, 0);

        // Cupos proximos tours (proximos 7 dias)
        const hoyDate = new Date();
        const en7dias = new Date(hoyDate.getTime() + 7 * 86400000).toISOString().slice(0, 10);
        const reservasProximas = cs.reservas.filter(r =>
            r.agencia_id === AGENCIA_ID &&
            r.estado !== 'anulada' &&
            r.fecha_servicio >= hoy &&
            r.fecha_servicio <= en7dias
        );
        const personasProximas = reservasProximas.reduce((s, r) => s + r.num_personas, 0);

        // Saldos pendientes
        const saldosPendientes = cs.reservas
            .filter(r => r.agencia_id === AGENCIA_ID && r.estado !== 'anulada' && r.saldo_pendiente > 0)
            .reduce((s, r) => s + r.saldo_pendiente, 0);

        // Alertas
        const alertas = [];
        // Vehiculos con SOAT proximo a vencer
        as.vehiculos.filter(v => v.activo && v.soat_vence).forEach(v => {
            const dias = Math.ceil((new Date(v.soat_vence) - hoyDate) / 86400000);
            if (dias <= 7 && dias >= 0)
                alertas.push({ tipo: 'danger', texto: 'SOAT de ' + v.placa + ' vence en ' + dias + ' dia(s)', fecha: v.soat_vence });
            else if (dias > 7 && dias <= 30)
                alertas.push({ tipo: 'warn', texto: 'SOAT de ' + v.placa + ' vence el ' + v.soat_vence, fecha: v.soat_vence });
        });
        // Equipos con stock bajo
        as.equipos.filter(e => e.cantidad_disponible <= e.stock_minimo).forEach(e => {
            alertas.push({ tipo: 'warn', texto: e.nombre + ': stock bajo (' + e.cantidad_disponible + '/' + e.cantidad_total + ')', fecha: hoy });
        });
        // Saldos pendientes
        if (saldosPendientes > 0) {
            alertas.push({ tipo: 'info', texto: 'Saldos pendientes por cobrar: S/ ' + saldosPendientes.toFixed(2), fecha: hoy });
        }

        // Tours proximos con info
        const toursProximos = [];
        const reservasPorTourFecha = {};
        reservasProximas.forEach(r => {
            const key = r.tour_id + '_' + r.fecha_servicio;
            if (!reservasPorTourFecha[key]) {
                const tour = cs.tours.find(t => t.id === r.tour_id);
                reservasPorTourFecha[key] = {
                    tour_id: r.tour_id,
                    tour_nombre: tour ? tour.nombre : '?',
                    fecha: r.fecha_servicio,
                    personas: 0,
                    cupo_max: tour ? tour.cupo_maximo : 0,
                    asignado: false
                };
            }
            reservasPorTourFecha[key].personas += r.num_personas;
        });
        Object.values(reservasPorTourFecha).forEach(t => {
            const asig = as.asignaciones_tour.find(a => {
                const res = cs.reservas.find(r => r.id === a.reserva_id);
                return res && res.tour_id === t.tour_id && res.fecha_servicio === t.fecha;
            });
            t.asignado = !!asig;
            toursProximos.push(t);
        });
        toursProximos.sort((a, b) => a.fecha.localeCompare(b.fecha));

        // Ventas ultimos 7 dias para grafico
        const ventasSemana = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(hoyDate.getTime() - i * 86400000);
            const dStr = d.toISOString().slice(0, 10);
            const label = d.toLocaleDateString('es-PE', { weekday: 'short' });
            const total = cs.reservas
                .filter(r => r.agencia_id === AGENCIA_ID && r.created_at && r.created_at.slice(0, 10) === dStr && r.estado !== 'anulada')
                .reduce((s, r) => s + r.total, 0);
            ventasSemana.push({ label, fecha: dStr, total });
        }

        return {
            ventas_hoy: ventasHoy,
            reservas_hoy: reservasHoy.length,
            ingresos_caja: ingresosHoy,
            egresos_caja: egresosHoy,
            personas_proximas: personasProximas,
            saldos_pendientes: saldosPendientes,
            alertas,
            tours_proximos: toursProximos,
            ventas_semana: ventasSemana,
            total_tours_activos: cs.tours.filter(t => t.agencia_id === AGENCIA_ID && t.estado === 'activo').length,
            total_turistas: cs.turistas.filter(t => t.agencia_id === AGENCIA_ID).length,
            caja_abierta: as.cajas.some(c => c.agencia_id === AGENCIA_ID && c.estado === 'abierta')
        };
    }

    /* 
    ================================================================================
       ROLES Y PERMISOS (GESTIÓN DINÁMICA)
    ================================================================================
    */
    async function verifyAdminPassword(password) {
        await delay(300);
        const user = getUsuarioActualSync();
        if (!user || user.rol_id !== 1) throw new Error('No autorizado');
        const state = adb();
        const dbUser = state.usuarios.find(u => u.id === user.id);
        if (!dbUser || dbUser.password_hash !== password) throw new Error('Contraseña incorrecta');
        return true;
    }

    async function crearRol(nombre, descripcion) {
        await delay(300);
        const state = adb();
        const id = state.roles.length ? Math.max(...state.roles.map(r => r.id)) + 1 : 1;
        const nuevoRol = { id, agencia_id: AGENCIA_ID, nombre, descripcion };
        state.roles.push(nuevoRol);
        saveA(state);
        return nuevoRol;
    }

    async function actualizarRol(id, nombre, descripcion) {
        await delay(300);
        if (id === 1) throw new Error('El rol de Administrador principal no puede ser modificado');
        const state = adb();
        const rol = state.roles.find(r => r.id === id && r.agencia_id === AGENCIA_ID);
        if (!rol) throw new Error('Rol no encontrado');
        rol.nombre = nombre;
        rol.descripcion = descripcion;
        saveA(state);
        return rol;
    }

    async function eliminarRol(id, migrarAId = null) {
        await delay(400);
        if (id === 1) throw new Error('El rol de Administrador principal no puede ser eliminado');
        const state = adb();
        const idx = state.roles.findIndex(r => r.id === id && r.agencia_id === AGENCIA_ID);
        if (idx === -1) throw new Error('Rol no encontrado');
        
        // Manejar usuarios
        const usuariosAfectados = state.usuarios.filter(u => u.rol_id === id);
        if (usuariosAfectados.length > 0) {
            if (migrarAId) {
                // Migrar usuarios al nuevo rol
                const nuevoRol = state.roles.find(r => r.id === migrarAId);
                if (!nuevoRol) throw new Error('El rol destino no existe');
                usuariosAfectados.forEach(u => u.rol_id = migrarAId);
            } else {
                // Eliminar usuarios asociados a este rol (baja lgica)
                usuariosAfectados.forEach(u => {
                    u.activo = 0;
                    u.bloqueado = 1;
                });
            }
        }
        
        // Eliminar permisos del rol
        state.permisos = state.permisos.filter(p => p.rol_id !== id);
        // Eliminar el rol
        state.roles.splice(idx, 1);
        saveA(state);
        return true;
    }

    async function actualizarPermisoRol(rolId, modulo, campo, valor) {
        await delay(200);
        if (rolId === 1) throw new Error('Los permisos del Administrador principal no pueden ser alterados');
        const state = adb();
        let permiso = state.permisos.find(p => p.rol_id === rolId && p.modulo === modulo);
        if (!permiso) {
            // Crear registro si no existe
            const pid = state.permisos.length ? Math.max(...state.permisos.map(x => x.id)) + 1 : 1;
            permiso = { id: pid, rol_id: rolId, modulo: modulo, puede_ver: 0, puede_crear: 0, puede_editar: 0, puede_eliminar: 0 };
            state.permisos.push(permiso);
        }
        permiso[campo] = valor ? 1 : 0;
        
        // Si no puede ver, no debería poder crear/editar/eliminar
        if (campo === 'puede_ver' && !valor) {
            permiso.puede_crear = 0;
            permiso.puede_editar = 0;
            permiso.puede_eliminar = 0;
        }
        saveAdminDb(state);
    }

    async function actualizarPermisosBulk(cambios) {
        await delay(300);
        const state = adb();
        for (const item of cambios) {
            const { rolId, modulo, valor } = item;
            if (rolId === 1) continue;
            let permiso = state.permisos.find(p => p.rol_id === rolId && p.modulo === modulo);
            if (!permiso) {
                const pid = state.permisos.length ? Math.max(...state.permisos.map(x => x.id)) + 1 : 1;
                permiso = { id: pid, rol_id: rolId, modulo: modulo, puede_ver: 0, puede_crear: 0, puede_editar: 0, puede_eliminar: 0 };
                state.permisos.push(permiso);
            }
            const val = valor ? 1 : 0;
            permiso.puede_ver = val;
            permiso.puede_crear = val;
            permiso.puede_editar = val;
            permiso.puede_eliminar = val;
        }
        saveAdminDb(state);
    }


    /* 
    ================================================================================
       AUDITORIA
    ================================================================================
    */
    async function getLogsAuditoria(filtros) {
        await delay(200);
        const state = adb();
        filtros = filtros || {};
        let logs = state.logs_auditoria.filter(l => l.agencia_id === AGENCIA_ID);

        if (filtros.usuario_id) logs = logs.filter(l => l.usuario_id === parseInt(filtros.usuario_id, 10));
        if (filtros.accion) logs = logs.filter(l => l.accion === filtros.accion);
        if (filtros.tabla) logs = logs.filter(l => l.tabla_afectada === filtros.tabla);
        if (filtros.fecha_desde) logs = logs.filter(l => l.created_at >= filtros.fecha_desde);
        if (filtros.fecha_hasta) logs = logs.filter(l => l.created_at <= filtros.fecha_hasta + 'T23:59:59');

        return logs.map(l => {
            const user = state.usuarios.find(u => u.id === l.usuario_id);
            return { ...l, usuario_nombre: user ? user.nombre : 'Sistema' };
        }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    /* ═══════════════════════════════════════
       OPERACIONES (GUÍA)
       ═══════════════════════════════════════ */
    async function getMisToursOperativos() {
        await delay(300);
        const as = adb();
        const cs = cdb();
        const session = getSession();
        if (!session) return [];

        const hoyDate = new Date();
        const hoyStr = hoyDate.toISOString().slice(0, 10);
        
        // Find all reservations linked to tours
        const reservas = cs.reservas.filter(r => r.agencia_id === AGENCIA_ID && r.estado !== 'anulada' && r.fecha_servicio >= hoyStr);
        
        // Group by tour_id + fecha
        const toursOperativosMap = {};
        reservas.forEach(r => {
            const asig = as.asignaciones_tour.find(a => a.reserva_id === r.id);
            // Si el guia logueado está asignado (o si es Admin, los mostramos todos para que pueda probar)
            if (session.rol_id === 1 || (asig && asig.guia_id === session.id)) {
                const key = r.tour_id + '_' + r.fecha_servicio;
                if (!toursOperativosMap[key]) {
                    const tour = cs.tours.find(t => t.id === r.tour_id);
                    toursOperativosMap[key] = {
                        tour_id: r.tour_id,
                        tour_nombre: tour ? tour.nombre : 'Tour desconocido',
                        fecha: r.fecha_servicio,
                        hora_salida: tour ? tour.hora_salida : '00:00',
                        personas: 0,
                        cupo_max: tour ? tour.cupo : 0,
                        estado: r.fecha_servicio === hoyStr ? 'hoy' : 'proximo',
                        checklist_completado: !!(asig && asig.checklist_completado)
                    };
                }
                toursOperativosMap[key].personas += r.personas;
            }
        });
        
        return Object.values(toursOperativosMap).sort((a, b) => a.fecha.localeCompare(b.fecha));
    }

    async function getManifiestoTour(tour_id, fecha) {
        await delay(200);
        const cs = cdb();
        
        const reservas = cs.reservas.filter(r => r.tour_id === tour_id && r.fecha_servicio === fecha && r.estado !== 'anulada');
        
        const manifiesto = [];
        reservas.forEach(r => {
            const turista = cs.turistas.find(t => t.id === r.turista_id);
            if (turista) {
                manifiesto.push({
                    reserva_id: r.id,
                    turista_id: turista.id,
                    nombre: turista.nombre + ' ' + turista.apellidos,
                    documento: turista.documento,
                    nacionalidad: turista.nacionalidad || 'N/A',
                    telefono: turista.telefono,
                    restricciones_medicas: turista.restricciones_medicas || '',
                    grupo_size: r.personas,
                    hotel_recojo: r.hotel_recojo || 'No especificado'
                });
            }
        });
        
        return manifiesto;
    }

    async function guardarChecklist(tour_id, fecha, checklist) {
        await delay(300);
        const state = adb();
        const cs = cdb();
        
        // Marcar checklist completado en las asignaciones de este tour
        const reservas = cs.reservas.filter(r => r.tour_id === tour_id && r.fecha_servicio === fecha);
        reservas.forEach(r => {
            const asig = state.asignaciones_tour.find(a => a.reserva_id === r.id);
            if (asig) {
                asig.checklist_completado = true;
                asig.checklist_data = checklist;
            }
        });
        
        saveAdminDb(state);
        return true;
    }

    /* ═══════════════════════════════════════
       INVENTARIO Y PROVEEDORES
       ═══════════════════════════════════════ */
    async function getEquipos() {
        await delay(200);
        const state = adb();
        return state.equipos.filter(e => e.agencia_id === AGENCIA_ID);
    }

    async function crearEquipo(datos) {
        await delay(300);
        if (parseInt(datos.cantidad_disponible) > parseInt(datos.cantidad_total)) {
            throw new Error('La cantidad disponible no puede ser mayor a la cantidad total');
        }
        const state = adb();
        const nuevo = {
            id: state.equipos.length ? Math.max(...state.equipos.map(e => e.id)) + 1 : 1,
            agencia_id: AGENCIA_ID,
            nombre: datos.nombre,
            cantidad_total: parseInt(datos.cantidad_total),
            cantidad_disponible: parseInt(datos.cantidad_disponible),
            stock_minimo: parseInt(datos.stock_minimo),
            ubicacion: datos.ubicacion || 'Almacén general'
        };
        state.equipos.push(nuevo);
        saveAdminDb(state);
        return nuevo;
    }

    async function actualizarEquipo(id, datos) {
        await delay(300);
        if (parseInt(datos.cantidad_disponible) > parseInt(datos.cantidad_total)) {
            throw new Error('La cantidad disponible no puede ser mayor a la cantidad total');
        }
        const state = adb();
        const index = state.equipos.findIndex(e => e.id === id && e.agencia_id === AGENCIA_ID);
        if (index === -1) throw new Error('Equipo no encontrado');
        
        state.equipos[index] = {
            ...state.equipos[index],
            nombre: datos.nombre,
            cantidad_total: parseInt(datos.cantidad_total),
            cantidad_disponible: parseInt(datos.cantidad_disponible),
            stock_minimo: parseInt(datos.stock_minimo),
            ubicacion: datos.ubicacion || 'Almacén general'
        };
        saveAdminDb(state);
        return state.equipos[index];
    }

    async function eliminarEquipo(id) {
        await delay(300);
        const state = adb();
        const index = state.equipos.findIndex(e => e.id === id && e.agencia_id === AGENCIA_ID);
        if (index === -1) throw new Error('Equipo no encontrado');
        
        state.equipos.splice(index, 1);
        saveAdminDb(state);
    }

    async function ajustarStock(id, disp, total) {
        await delay(300);
        if (parseInt(disp) > parseInt(total)) {
            throw new Error('La cantidad disponible no puede ser mayor a la cantidad total');
        }
        const state = adb();
        const index = state.equipos.findIndex(e => e.id === id && e.agencia_id === AGENCIA_ID);
        if (index === -1) throw new Error('Equipo no encontrado');
        
        state.equipos[index].cantidad_disponible = parseInt(disp);
        state.equipos[index].cantidad_total = parseInt(total);
        saveAdminDb(state);
        return state.equipos[index];
    }

    async function getCategoriasProveedor() {
        await delay(100);
        const state = adb();
        return state.categorias_proveedor.filter(c => c.agencia_id === AGENCIA_ID);
    }

    async function getProveedores() {
        await delay(200);
        const state = adb();
        const cats = state.categorias_proveedor;
        return state.proveedores.filter(p => p.agencia_id === AGENCIA_ID).map(p => {
            const cat = cats.find(c => c.id === p.categoria_id);
            return { ...p, categoria_nombre: cat ? cat.nombre : 'Sin Categoría' };
        }).sort((a, b) => a.razon_social.localeCompare(b.razon_social));
    }

    async function crearProveedor(datos) {
        await delay(300);
        if (!datos.ruc || datos.ruc.length !== 11) throw new Error('El RUC debe tener 11 dígitos');
        const state = adb();
        if (state.proveedores.find(p => p.ruc === datos.ruc && p.agencia_id === AGENCIA_ID)) throw new Error('Ya existe un proveedor con ese RUC');
        
        const nuevo = {
            id: state.proveedores.length ? Math.max(...state.proveedores.map(p => p.id)) + 1 : 1,
            agencia_id: AGENCIA_ID,
            categoria_id: parseInt(datos.categoria_id),
            razon_social: datos.razon_social,
            ruc: datos.ruc,
            contacto_nombre: datos.contacto_nombre,
            telefono: datos.telefono,
            email: datos.email || '',
            activo: 1
        };
        state.proveedores.push(nuevo);
        saveAdminDb(state);
        return nuevo;
    }

    async function actualizarProveedor(id, datos) {
        await delay(300);
        const state = adb();
        const index = state.proveedores.findIndex(p => p.id === id && p.agencia_id === AGENCIA_ID);
        if (index === -1) throw new Error('Proveedor no encontrado');

        const existeRuc = state.proveedores.find(p => p.ruc === datos.ruc && p.agencia_id === AGENCIA_ID && p.id !== id);
        if (existeRuc) throw new Error('Ya existe otro proveedor con ese RUC');

        state.proveedores[index] = {
            ...state.proveedores[index],
            ruc: datos.ruc,
            razon_social: datos.razon_social,
            categoria_id: parseInt(datos.categoria_id),
            contacto_nombre: datos.contacto_nombre,
            telefono: datos.telefono,
            email: datos.email || ''
        };
        saveAdminDb(state);
        return state.proveedores[index];
    }

    async function eliminarProveedor(id) {
        await delay(300);
        const state = adb();
        const index = state.proveedores.findIndex(p => p.id === id && p.agencia_id === AGENCIA_ID);
        if (index === -1) throw new Error('Proveedor no encontrado');
        
        state.proveedores.splice(index, 1);
        saveAdminDb(state);
    }

    /* ----- TURISTAS (CRM) ----- */
    async function getTuristas() {
        await delay(300);
        const state = cdb();
        return state.turistas.filter(t => t.agencia_id === AGENCIA_ID);
    }

    async function actualizarTurista(id, datos) {
        await delay(300);
        const state = cdb();
        const index = state.turistas.findIndex(t => t.id === id && t.agencia_id === AGENCIA_ID);
        if (index === -1) throw new Error('Turista no encontrado');
        state.turistas[index] = { ...state.turistas[index], ...datos };
        saveC(state);
        return state.turistas[index];
    }

    async function getHistorialTurista(turista_id) {
        await delay(300);
        const state = cdb();
        const reservas = state.reservas.filter(r => r.turista_id === turista_id);
        const toursActivos = state.tours;
        const destinos = state.destinos;
        
        return reservas.map(r => {
            const tour = toursActivos.find(t => t.id === r.tour_id);
            return {
                ...r,
                tour_nombre: tour ? tour.nombre : 'Tour desconocido',
                destino: tour ? destinos.find(d => d.id === tour.destino_id)?.nombre : ''
            };
        }).sort((a, b) => b.fecha_servicio.localeCompare(a.fecha_servicio));
    }

    /* ----- TOURS (CATÁLOGO) ----- */
    async function getTours() {
        await delay(300);
        const state = cdb();
        return state.tours.filter(t => t.agencia_id === AGENCIA_ID).map(t => {
            const destino = state.destinos.find(d => d.id === t.destino_id);
            const categoria = state.categorias_tour.find(c => c.id === t.categoria_id);
            return {
                ...t,
                destino_nombre: destino ? destino.nombre : '',
                categoria_nombre: categoria ? categoria.nombre : ''
            };
        });
    }

    async function getDestinos() {
        await delay(200);
        return cdb().destinos;
    }

    async function buscarOCrearDestino(nombre, latitud, longitud) {
        await delay(300);
        const state = cdb();
        // Buscar si ya existe por nombre exacto (case-insensitive)
        const existe = state.destinos.find(d => d.nombre.toLowerCase() === nombre.toLowerCase());
        if (existe) return existe.id;

        const nuevoId = state.destinos.length ? Math.max(...state.destinos.map(d => d.id)) + 1 : 1;
        state.destinos.push({
            id: nuevoId,
            agencia_id: AGENCIA_ID,
            nombre: nombre,
            descripcion: 'Destino agregado automáticamente',
            latitud: latitud || 0,
            longitud: longitud || 0,
            activo: 1
        });
        saveC(state);
        return nuevoId;
    }

    async function actualizarDestino(id, payload) {
        await delay(300);
        const state = cdb();
        const index = state.destinos.findIndex(d => d.id === parseInt(id));
        if (index === -1) throw new Error('Destino no encontrado');
        
        state.destinos[index] = { ...state.destinos[index], ...payload };
        saveC(state);
        return state.destinos[index];
    }

    async function eliminarDestino(id) {
        await delay(300);
        const state = cdb();
        const index = state.destinos.findIndex(d => d.id === parseInt(id));
        if (index === -1) throw new Error('Destino no encontrado');
        
        // Soft delete
        state.destinos[index].activo = 0;
        saveC(state);
        return { success: true };
    }

    async function getCategoriasTour() {
        await delay(200);
        return cdb().categorias_tour;
    }

    async function crearTour(datos) {
        await delay(300);
        const state = cdb();
        const nuevo = {
            id: state.tours.length ? Math.max(...state.tours.map(t => t.id)) + 1 : 1,
            agencia_id: AGENCIA_ID,
            ...datos,
            imagenes: datos.imagenes || [],
            estado: 'activo',
            created_at: new Date().toISOString()
        };
        state.tours.push(nuevo);
        saveC(state);
        return nuevo;
    }

    async function actualizarTour(id, datos) {
        await delay(300);
        const state = cdb();
        const index = state.tours.findIndex(t => t.id === id && t.agencia_id === AGENCIA_ID);
        if (index === -1) throw new Error('Tour no encontrado');
        state.tours[index] = { ...state.tours[index], ...datos };
        saveC(state);
        return state.tours[index];
    }

    async function eliminarTour(id) {
        await delay(300);
        const state = cdb();
        const index = state.tours.findIndex(t => t.id === id && t.agencia_id === AGENCIA_ID);
        if (index === -1) throw new Error('Tour no encontrado');
        if (state.reservas.some(r => r.tour_id === id)) {
            throw new Error('No se puede eliminar un tour que tiene reservas asociadas. Cambia su estado a inactivo.');
        }
        state.tours.splice(index, 1);
        saveC(state);
        return true;
    }

    /* ═══════════════════════════════════════
       PUBLIC API
       ═══════════════════════════════════════ */
    return {
        login, logout, isAdminAuth, getSession: getUsuarioActualSync,
        tienePermiso, getPermisosRol, getModulosPermitidos,
        getUsuarios, crearUsuario, inhabilitarUsuario, reactivarUsuario, getRoles,
        getReservasInternas, anularReserva, confirmarReserva, crearReservaInterna,
        getCajaActiva, abrirCaja, registrarPago, getPagosCaja, cerrarCaja, getHistorialCajas,
        getDashboardKPIs,
        getMisToursOperativos, getManifiestoTour, guardarChecklist,
        getEquipos, crearEquipo, actualizarEquipo, eliminarEquipo, ajustarStock, 
        getCategoriasProveedor, getProveedores, crearProveedor, actualizarProveedor, eliminarProveedor,
        getTuristas, actualizarTurista, getHistorialTurista,
        getTours, getDestinos, buscarOCrearDestino, actualizarDestino, eliminarDestino, getCategoriasTour, crearTour, actualizarTour, eliminarTour,
        getLogsAuditoria,
        verifyAdminPassword, crearRol, actualizarRol, eliminarRol, actualizarPermisoRol, actualizarPermisosBulk
    };
})();

if (typeof window !== 'undefined') window.AdminAPI = AdminAPI;
