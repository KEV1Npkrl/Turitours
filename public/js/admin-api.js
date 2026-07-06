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

    /* ─── API Helper ─── */
    async function fetchAPI(endpoint, options = {}) {
        const session = getSession();
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };
        
        if (session && session.token) {
            headers['Authorization'] = `Bearer ${session.token}`;
        }
        
        const response = await fetch(`http://localhost:3000/api${endpoint}`, {
            ...options,
            headers
        });
        
        if (!response.ok) {
            let errorData = {};
            try {
                const text = await response.text();
                if (text) errorData = JSON.parse(text);
            } catch (e) {}
            throw new Error(errorData.error || `Error HTTP: ${response.status}`);
        }
        
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    }    /* ─── Audit log helper ─── */
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
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Credenciales incorrectas');
            }

            // Registrar sesión local
            localStorage.setItem('admin_session', JSON.stringify({
                id: data.user.id,
                rol_id: data.user.rol_id,
                nombre: data.user.nombre,
                email: data.user.email,
                token: data.token
            }));

            return { success: true, usuario: data.user };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async function cambiarPasswordInicial(password) {
        const data = await fetchAPI('/usuarios/cambiar-password-inicial', {
            method: 'PUT',
            body: JSON.stringify({ password })
        });
        return data.success;
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
        const permisos = state.permisos || [];
        return permisos
            .filter(p => p.rol_id === session.rol_id && p.puede_ver === 1)
            .map(p => p.modulo);
    }

    /* ═══════════════════════════════════════
       USUARIOS (PERSONAL)
       ═══════════════════════════════════════ */
    async function getUsuarios() {
        const data = await fetchAPI('/usuarios');
        return data.usuarios || [];
    }

    async function crearUsuario(datos) {
        const res = await fetchAPI('/usuarios', {
            method: 'POST',
            body: JSON.stringify(datos)
        });
        return res.usuario;
    }

    async function inhabilitarUsuario(id) {
        await fetchAPI(`/usuarios/${id}/inhabilitar`, { method: 'PUT' });
        return { success: true };
    }

    async function reactivarUsuario(id) {
        await fetchAPI(`/usuarios/${id}/reactivar`, { method: 'PUT' });
        return { success: true };
    }

    async function actualizarUsuario(id, datos) {
        const res = await fetchAPI(`/usuarios/${id}`, {
            method: 'PUT',
            body: JSON.stringify(datos)
        });
        return res.usuario;
    }

    async function eliminarUsuario(id) {
        await fetchAPI(`/usuarios/${id}`, { method: 'DELETE' });
        return { success: true };
    }

    async function getRoles() {
        const data = await fetchAPI('/roles');
        return data.roles || [];
    }

    /* ═══════════════════════════════════════
       RESERVAS INTERNAS
       ═══════════════════════════════════════ */
    async function getReservasInternas(filtros) {
        const session = getSession();
        if (!session) throw new Error('No autorizado');
        let qs = '';
        if (filtros) {
            const params = new URLSearchParams();
            if (filtros.estado) params.append('estado', filtros.estado);
            if (filtros.tour_id) params.append('tour_id', filtros.tour_id);
            if (filtros.fecha) {
                params.append('fecha_inicio', filtros.fecha);
                params.append('fecha_fin', filtros.fecha);
            }
            qs = '?' + params.toString();
        }
        const response = await fetch(`http://localhost:3000/api/reservas${qs}`, {
            headers: { 'Authorization': `Bearer ${session.token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al obtener reservas');
        
        // Filtrado por busqueda en frontend
        let reservas = data.reservas;
        if (filtros && filtros.busqueda) {
            const q = filtros.busqueda.toLowerCase();
            reservas = reservas.filter(r => 
                (r.codigo_qr && r.codigo_qr.toLowerCase().includes(q)) ||
                ((r.turista_nombre + ' ' + r.turista_apellidos).toLowerCase().includes(q)) ||
                (r.tour_nombre && r.tour_nombre.toLowerCase().includes(q))
            );
        }
        return reservas;
    }

    async function anularReserva(reservaId, motivo) {
        const session = getSession();
        if (!session) throw new Error('No autorizado');
        const response = await fetch(`http://localhost:3000/api/reservas/${reservaId}/anular`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al anular reserva');
        return { success: true };
    }

    async function confirmarReserva(reservaId) {
        const session = getSession();
        if (!session) throw new Error('No autorizado');
        const response = await fetch(`http://localhost:3000/api/reservas/${reservaId}/confirmar`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${session.token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al confirmar reserva');
        return { success: true };
    }

    async function crearReservaInterna(datos) {
        const session = getSession();
        if (!session) throw new Error('No autorizado');
        
        let turista_id;
        try {
            const turRes = await crearTurista(datos);
            turista_id = turRes.id;
        } catch (e) {
            if (e.message.includes('Ya existe un turista')) {
                const existing = await getTuristas();
                const found = existing.find(t => t.documento === datos.documento);
                if (found) turista_id = found.id;
                else throw new Error('No se pudo encontrar el turista existente');
            } else {
                throw e;
            }
        }
        
        const payload = {
            ...datos,
            turista_id
        };
        
        const response = await fetch('http://localhost:3000/api/reservas', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al crear reserva');
        return { success: true, reserva: data.reserva };
    }

    async function confirmarPagoReservaWeb(reservaId, pagoMonto, pagoMetodo) {
        const session = getSession();
        if (!session) throw new Error('No autorizado');
        const response = await fetch(`http://localhost:3000/api/reservas/${reservaId}/pago`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            },
            body: JSON.stringify({ pago_monto: pagoMonto, pago_metodo: pagoMetodo })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al confirmar pago web');
        return { success: true };
    }

    /* ═══════════════════════════════════════
       CAJA Y TESORERIA
       ═══════════════════════════════════════ */
    async function getCajaActiva() {
        return await fetchAPI('/caja/activa');
    }

    async function abrirCaja(montoApertura) {
        return await fetchAPI('/caja/abrir', {
            method: 'POST',
            body: JSON.stringify({ monto: montoApertura })
        });
    }

    async function registrarPago(datos) {
        return await fetchAPI('/caja/pago', {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    }

    async function getPagosCaja(cajaId) {
        return await fetchAPI(`/caja/${cajaId}/pagos`);
    }

    async function cerrarCaja(montoReal) {
        return await fetchAPI('/caja/cerrar', {
            method: 'POST',
            body: JSON.stringify({ monto_real: montoReal })
        });
    }

    async function getHistorialCajas() {
        return await fetchAPI('/caja/historial');
    }

    /* ═══════════════════════════════════════
       DASHBOARD KPIs
       ═══════════════════════════════════════ */
    async function getDashboardKPIs() {
        return await fetchAPI('/dashboard');
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
        const data = await fetchAPI('/roles', {
            method: 'POST',
            body: JSON.stringify({ nombre, descripcion })
        });
        return data.rol;
    }

    async function actualizarRol(id, nombre, descripcion) {
        if (id === 1) throw new Error('El rol de Administrador principal no puede ser modificado');
        const data = await fetchAPI(`/roles/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ nombre, descripcion })
        });
        return data.rol;
    }

    async function eliminarRol(id, migrarAId = null) {
        const data = await fetchAPI(`/roles/${id}/desactivar-migrar`, {
            method: 'POST',
            body: JSON.stringify(migrarAId ? { nuevo_rol_id: migrarAId } : {})
        });
        return data.success;
    }

    async function actualizarPermisoRol(rolId, modulo, campo, valor) {
        await fetchAPI(`/roles/${rolId}/permisos/${modulo}`, {
            method: 'PUT',
            body: JSON.stringify({ [campo]: valor ? 1 : 0 })
        });
    }

    async function actualizarPermisosBulk(cambios) {
        // Group by rolId
        const rolesMap = {};
        for(const c of cambios) {
            if(!rolesMap[c.rolId]) rolesMap[c.rolId] = {};
            rolesMap[c.rolId][c.modulo] = c.valor;
        }
        
        for(const [rolId, modulos] of Object.entries(rolesMap)) {
            await fetchAPI(`/roles/${rolId}/permisos`, {
                method: 'PUT',
                body: JSON.stringify(modulos)
            });
        }
        return true;
    }


    /* 
    ================================================================================
    */
    async function getLogsAuditoria(filtros) {
        const data = await fetchAPI('/auditoria/logs');
        let logs = data.logs_auditoria || [];
        
        if (filtros) {
            if (filtros.usuario_id) logs = logs.filter(l => l.usuario_id == filtros.usuario_id);
            if (filtros.accion) logs = logs.filter(l => l.accion === filtros.accion);
            if (filtros.tabla) logs = logs.filter(l => l.tabla_afectada === filtros.tabla);
            if (filtros.fecha_desde) logs = logs.filter(l => l.created_at >= filtros.fecha_desde);
            if (filtros.fecha_hasta) logs = logs.filter(l => l.created_at.slice(0, 10) <= filtros.fecha_hasta);
        }
        
        return logs;
    }

    /* ═══════════════════════════════════════
       OPERACIONES (GUÍA)
       ═══════════════════════════════════════ */
    async function getMisToursOperativos() {
        return await fetchAPI('/operaciones/mis-tours');
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
        const data = await fetchAPI('/inventario/equipos');
        return data.equipos || [];
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
        const data = await fetchAPI('/inventario/categorias-proveedor');
        return data.categorias_proveedor || [];
    }

    async function getProveedores() {
        const data = await fetchAPI('/inventario/proveedores');
        return data.proveedores || [];
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
        const session = getSession();
        if (!session) throw new Error('No autorizado');
        const response = await fetch('http://localhost:3000/api/turistas', {
            headers: { 'Authorization': `Bearer ${session.token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al obtener turistas');
        return data.turistas;
    }

    async function crearTurista(datos) {
        const session = getSession();
        if (!session) throw new Error('No autorizado');
        const response = await fetch('http://localhost:3000/api/turistas', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            },
            body: JSON.stringify(datos)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al crear turista');
        return data.turista;
    }

    async function actualizarTurista(id, datos) {
        const session = getSession();
        if (!session) throw new Error('No autorizado');
        const response = await fetch(`http://localhost:3000/api/turistas/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            },
            body: JSON.stringify(datos)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al actualizar turista');
        return data.turista;
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
        const session = getSession();
        if (!session) throw new Error('No autorizado');
        const response = await fetch('http://localhost:3000/api/tours', {
            headers: { 'Authorization': `Bearer ${session.token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al obtener tours');
        
        // Populate names manually since backend didn't populate them directly
        const destinos = await getDestinos();
        const categorias = await getCategoriasTour();
        return data.tours.map(t => ({
            ...t,
            destino_nombre: (destinos.find(d => d.id === t.destino_id) || {}).nombre || '?',
            categoria_nombre: (categorias.find(c => c.id === t.categoria_id) || {}).nombre || '?'
        }));
    }

    async function getDestinos() {
        const session = getSession();
        if (!session) throw new Error('No autorizado');
        const response = await fetch('http://localhost:3000/api/destinos', {
            headers: { 'Authorization': `Bearer ${session.token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al obtener destinos');
        return data.destinos;
    }

    async function buscarOCrearDestino(nombre, latitud, longitud) {
        const session = getSession();
        if (!session) throw new Error('No autorizado');
        const response = await fetch('http://localhost:3000/api/destinos', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            },
            body: JSON.stringify({ nombre, latitud, longitud })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al crear destino');
        return data.id;
    }

    async function actualizarDestino(id, payload) {
        const session = getSession();
        if (!session) throw new Error('No autorizado');
        const response = await fetch(`http://localhost:3000/api/destinos/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al actualizar destino');
        return data.destino;
    }

    async function eliminarDestino(id) {
        // Mocked as requested, since we didn't build the endpoint
        await delay(300);
        return { success: true };
    }

    async function getCategoriasTour() {
        const session = getSession();
        if (!session) throw new Error('No autorizado');
        const response = await fetch('http://localhost:3000/api/destinos/categorias', {
            headers: { 'Authorization': `Bearer ${session.token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al obtener categorías');
        return data.categorias;
    }

    async function crearCategoriaTour(datos) {
        const session = getSession();
        if (!session) throw new Error('No autorizado');
        const response = await fetch('http://localhost:3000/api/destinos/categorias', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            },
            body: JSON.stringify(datos)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al crear categoría');
        return data.categoria;
    }

    async function editarCategoriaTour(id, datos) {
        const session = getSession();
        if (!session) throw new Error('No autorizado');
        const response = await fetch(`http://localhost:3000/api/destinos/categorias/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            },
            body: JSON.stringify(datos)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al editar categoría');
        return data.categoria;
    }

    async function eliminarCategoriaTour(id) {
        const session = getSession();
        if (!session) throw new Error('No autorizado');
        const response = await fetch(`http://localhost:3000/api/destinos/categorias/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${session.token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al eliminar categoría');
        return { success: true };
    }

    async function crearTour(datos) {
        const session = getSession();
        if (!session) throw new Error('No autorizado');
        const response = await fetch('http://localhost:3000/api/tours', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            },
            body: JSON.stringify(datos)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al crear tour');
        return data.tour;
    }

    async function actualizarTour(id, datos) {
        const session = getSession();
        if (!session) throw new Error('No autorizado');
        const response = await fetch(`http://localhost:3000/api/tours/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            },
            body: JSON.stringify(datos)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al actualizar tour');
        return data.tour;
    }

    async function eliminarTour(id) {
        const session = getSession();
        if (!session) throw new Error('No autorizado');
        const response = await fetch(`http://localhost:3000/api/tours/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${session.token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al eliminar tour');
        return true;
    }

    /* ═══════════════════════════════════════
       PUBLIC API
       ═══════════════════════════════════════ */
    return {
        login, logout, isAdminAuth, getSession: getUsuarioActualSync, cambiarPasswordInicial,
        tienePermiso, getPermisosRol, getModulosPermitidos,
        getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario, inhabilitarUsuario, reactivarUsuario, getRoles,
        getReservasInternas, anularReserva, confirmarReserva, crearReservaInterna, confirmarPagoReservaWeb,
        getCajaActiva, abrirCaja, registrarPago, getPagosCaja, cerrarCaja, getHistorialCajas,
        getDashboardKPIs,
        getMisToursOperativos, getManifiestoTour, guardarChecklist,
        getEquipos, crearEquipo, actualizarEquipo, eliminarEquipo, ajustarStock, 
        getCategoriasProveedor, getProveedores, crearProveedor, actualizarProveedor, eliminarProveedor,
        getTuristas, crearTurista, actualizarTurista, getHistorialTurista,
        getTours, getDestinos, buscarOCrearDestino, actualizarDestino, eliminarDestino, getCategoriasTour, crearCategoriaTour, editarCategoriaTour, eliminarCategoriaTour, crearTour, actualizarTour, eliminarTour,
        getLogsAuditoria,
        verifyAdminPassword, crearRol, actualizarRol, eliminarRol, actualizarPermisoRol, actualizarPermisosBulk
    };
})();

if (typeof window !== 'undefined') window.AdminAPI = AdminAPI;
