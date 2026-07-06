/**
 * Mock Data — Modelo Negocio + SuperAdmin
 * Extiende MOCK_DB con tablas internas: usuarios, roles, permisos,
 * cajas, pagos, vehiculos, equipos, proveedores, logs, etc.
 * Alineado con database/bd_turismo_tarapoto.sql
 */

const ADMIN_MOCK_DB = {
    /* ─── Roles por agencia ─── */
    roles: [],

    /* ─── Permisos granulares ─── */
    permisos: [
        // Admin — todo
        { id: 1,  rol_id: 1, modulo: 'dashboard',   puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 1 },
        { id: 2,  rol_id: 1, modulo: 'tours',        puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 1 },
        { id: 3,  rol_id: 1, modulo: 'reservas',     puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 1 },
        { id: 4,  rol_id: 1, modulo: 'caja',         puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 1 },
        { id: 5,  rol_id: 1, modulo: 'turistas',     puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 1 },
        { id: 6,  rol_id: 1, modulo: 'operaciones',  puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 1 },
        { id: 7,  rol_id: 1, modulo: 'inventario',   puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 1 },
        { id: 8,  rol_id: 1, modulo: 'personal',     puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 1 },
        { id: 9,  rol_id: 1, modulo: 'reportes',     puede_ver: 1, puede_crear: 0, puede_editar: 0, puede_eliminar: 0 },
        { id: 10, rol_id: 1, modulo: 'auditoria',    puede_ver: 1, puede_crear: 0, puede_editar: 0, puede_eliminar: 0 },
        { id: 20, rol_id: 1, modulo: 'facturacion',  puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 1 },
        // Vendedor (incluye caja)
        { id: 11, rol_id: 2, modulo: 'dashboard',   puede_ver: 1, puede_crear: 0, puede_editar: 0, puede_eliminar: 0 },
        { id: 12, rol_id: 2, modulo: 'reservas',    puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 0 },
        { id: 13, rol_id: 2, modulo: 'turistas',    puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 0 },
        { id: 14, rol_id: 2, modulo: 'tours',       puede_ver: 1, puede_crear: 0, puede_editar: 0, puede_eliminar: 0 },
        { id: 15, rol_id: 2, modulo: 'caja',        puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 0 },
        { id: 21, rol_id: 2, modulo: 'facturacion', puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 0 },
        // Guia (incluye operaciones)
        { id: 16, rol_id: 3, modulo: 'dashboard',    puede_ver: 1, puede_crear: 0, puede_editar: 0, puede_eliminar: 0 },
        { id: 17, rol_id: 3, modulo: 'operaciones',  puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 0 },
        { id: 18, rol_id: 3, modulo: 'inventario',   puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 0 },
        { id: 19, rol_id: 3, modulo: 'tours',        puede_ver: 1, puede_crear: 0, puede_editar: 0, puede_eliminar: 0 },
        // Súper Admin (Privacidad: Todo menos reportes)
        { id: 101, rol_id: 99, modulo: 'dashboard',   puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 1 },
        { id: 102, rol_id: 99, modulo: 'tours',       puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 1 },
        { id: 103, rol_id: 99, modulo: 'reservas',    puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 1 },
        { id: 104, rol_id: 99, modulo: 'caja',        puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 1 },
        { id: 105, rol_id: 99, modulo: 'turistas',    puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 1 },
        { id: 106, rol_id: 99, modulo: 'operaciones', puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 1 },
        { id: 107, rol_id: 99, modulo: 'inventario',  puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 1 },
        { id: 108, rol_id: 99, modulo: 'personal',    puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 1 },
        { id: 109, rol_id: 99, modulo: 'auditoria',   puede_ver: 1, puede_crear: 0, puede_editar: 0, puede_eliminar: 0 },
        { id: 110, rol_id: 99, modulo: 'facturacion', puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 1 }
    ],

    /* ─── Usuarios (personal de la agencia) ─── */
    usuarios: [],

    /* ─── Sesiones ─── */
    sesiones: [
        { id: 1, usuario_id: 1, ip: '192.168.1.10', dispositivo: 'Chrome/Win11', login_at: '2026-05-31T18:00:00', logout_at: null },
        { id: 2, usuario_id: 2, ip: '192.168.1.15', dispositivo: 'Firefox/Win10', login_at: '2026-05-31T08:30:00', logout_at: '2026-05-31T17:30:00' }
    ],

    /* ─── Cajas ─── */
    cajas: [],

    /* ─── Pagos ─── */
    pagos: [],

    /* ─── Vehiculos ─── */
    vehiculos: [],

    /* ─── Mantenimientos ─── */
    mantenimientos: [
        { id: 1, vehiculo_id: 1, tipo: 'preventivo', descripcion: 'Cambio de aceite y filtros', costo: 180.00, fecha: '2026-05-01', realizado_por: 'Taller Motores SM' },
        { id: 2, vehiculo_id: 2, tipo: 'correctivo', descripcion: 'Cambio de frenos traseros', costo: 350.00, fecha: '2026-04-20', realizado_por: 'Mecanica Tarapoto' }
    ],

    /* ─── Equipos (Inventario) ─── */
    equipos: [],

    /* ─── Proveedores ─── */
    categorias_proveedor: [],

    proveedores: [],

    servicios_proveedor: [
        { id: 1, agencia_id: 1, proveedor_id: 1, reserva_id: 1, descripcion: 'Transporte Laguna Azul ida y vuelta', monto: 120.00, fecha_servicio: '2026-06-20', estado: 'pendiente', fecha_pago: null },
        { id: 2, agencia_id: 1, proveedor_id: 2, reserva_id: 1, descripcion: 'Almuerzo tipico x2', monto: 40.00, fecha_servicio: '2026-06-20', estado: 'pendiente', fecha_pago: null },
        { id: 3, agencia_id: 1, proveedor_id: 2, reserva_id: 3, descripcion: 'Snacks trekking x2', monto: 20.00, fecha_servicio: '2026-03-10', estado: 'pagado', fecha_pago: '2026-03-15' }
    ],

    /* ─── Incidentes ─── */
    incidentes: [
        { id: 1, agencia_id: 1, reserva_id: 3, categoria: 'queja_cliente', descripcion: 'Turista reporto que el sendero estaba resbaloso sin señalizacion', involucrados: 'Pedro Ramirez (guia)', reportado_por: 3, created_at: '2026-03-10T12:00:00' }
    ],

    /* ─── Logs de auditoria ─── */
    logs_auditoria: [],

    /* ─── Tokens recuperacion (mock) ─── */
    tokens_recuperacion: [],

    /* ─── Asignaciones de tour ─── */
    asignaciones_tour: [],

    /* ─── Checklists ─── */
    checklists: [
        { id: 1, asignacion_id: 1, usuario_id: 3, item: 'Chalecos salvavidas (2)', marcado: 1, observacion: null, created_at: '2026-06-20T06:30:00' },
        { id: 2, asignacion_id: 1, usuario_id: 3, item: 'Botiquin primeros auxilios', marcado: 1, observacion: null, created_at: '2026-06-20T06:30:00' },
        { id: 3, asignacion_id: 1, usuario_id: 3, item: 'Verificar nivel combustible', marcado: 0, observacion: null, created_at: '2026-06-20T06:30:00' },
        { id: 4, asignacion_id: 1, usuario_id: 3, item: 'Revision documentos vehiculo', marcado: 1, observacion: 'SOAT vigente', created_at: '2026-06-20T06:31:00' }
    ],

    /* ─── SuperAdmin data ─── */
    superadmins: [
        { id: 1, nombre: 'Super Admin', email: 'super@turitours.com', password_hash: 'super123', activo: 1, ultimo_login: '2026-05-31T20:00:00', created_at: '2024-01-01T00:00:00' }
    ],

    comunicados: [
        { id: 1, superadmin_id: 1, titulo: 'Mantenimiento programado', cuerpo: 'Se realizara mantenimiento del sistema el 15 de junio de 2026 de 02:00 a 04:00 AM.', tipo: 'informativo', enviado_at: '2026-05-30T10:00:00' }
    ],

    versiones_sistema: [
        { id: 1, version: '1.0.0', descripcion: 'Lanzamiento inicial del sistema', superadmin_id: 1, desplegada_at: '2024-01-15T00:00:00' },
        { id: 2, version: '1.1.0', descripcion: 'Modulo de reservas online y portal del turista', superadmin_id: 1, desplegada_at: '2025-01-01T00:00:00' }
    ]
};

const ADMIN_MOCK_VERSION = 4;

function getAdminDb() {
    const storedVersion = localStorage.getItem('turitours_admin_mock_version');
    if (storedVersion !== String(ADMIN_MOCK_VERSION)) {
        localStorage.setItem('turitours_admin_mock_version', String(ADMIN_MOCK_VERSION));
        localStorage.removeItem('turitours_admin_mock_db');
        return JSON.parse(JSON.stringify(ADMIN_MOCK_DB));
    }
    
    try {
        const db = localStorage.getItem('turitours_admin_mock_db');
        if (!db) return JSON.parse(JSON.stringify(ADMIN_MOCK_DB));
        return JSON.parse(db);
    } catch (e) {
        localStorage.removeItem('turitours_admin_mock_db');
        return JSON.parse(JSON.stringify(ADMIN_MOCK_DB));
    }
}

function saveAdminDb(db) {
    localStorage.setItem('turitours_admin_mock_db', JSON.stringify(db));
}

function resetAdminDb() {
    localStorage.removeItem('turitours_admin_mock_db');
    localStorage.removeItem('turitours_admin_mock_version');
}

if (typeof window !== 'undefined') {
    window.ADMIN_MOCK_DB = ADMIN_MOCK_DB;
    window.getAdminDb = getAdminDb;
    window.saveAdminDb = saveAdminDb;
    window.resetAdminDb = resetAdminDb;
}
