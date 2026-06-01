/**
 * Mock Data — Modelo Negocio + SuperAdmin
 * Extiende MOCK_DB con tablas internas: usuarios, roles, permisos,
 * cajas, pagos, vehiculos, equipos, proveedores, logs, etc.
 * Alineado con database/bd_turismo_tarapoto.sql
 */

const ADMIN_MOCK_DB = {
    /* ─── Roles por agencia ─── */
    roles: [
        { id: 1, agencia_id: 1, nombre: 'Administrador', descripcion: 'Acceso total al sistema' },
        { id: 2, agencia_id: 1, nombre: 'Vendedor', descripcion: 'Ventas, atencion al turista y caja' },
        { id: 3, agencia_id: 1, nombre: 'Guia', descripcion: 'Guia turistico y operaciones en campo' }
    ],

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
        // Vendedor (incluye caja)
        { id: 11, rol_id: 2, modulo: 'dashboard',   puede_ver: 1, puede_crear: 0, puede_editar: 0, puede_eliminar: 0 },
        { id: 12, rol_id: 2, modulo: 'reservas',    puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 0 },
        { id: 13, rol_id: 2, modulo: 'turistas',    puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 0 },
        { id: 14, rol_id: 2, modulo: 'tours',       puede_ver: 1, puede_crear: 0, puede_editar: 0, puede_eliminar: 0 },
        { id: 15, rol_id: 2, modulo: 'caja',        puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 0 },
        // Guia (incluye operaciones)
        { id: 16, rol_id: 3, modulo: 'dashboard',    puede_ver: 1, puede_crear: 0, puede_editar: 0, puede_eliminar: 0 },
        { id: 17, rol_id: 3, modulo: 'operaciones',  puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 0 },
        { id: 18, rol_id: 3, modulo: 'inventario',   puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 0 },
        { id: 19, rol_id: 3, modulo: 'tours',        puede_ver: 1, puede_crear: 0, puede_editar: 0, puede_eliminar: 0 }
    ],

    /* ─── Usuarios (personal de la agencia) ─── */
    usuarios: [
        {
            id: 1, agencia_id: 1, rol_id: 1,
            nombre: 'Carlos Mendoza', dni: '70123456',
            email: 'admin@agencia.com', telefono: '+51 942 100 001',
            password_hash: 'admin123',
            intentos_fallidos: 0, bloqueado: 0, activo: 1,
            ultimo_login: '2026-05-31T18:00:00',
            created_at: '2024-01-15T08:00:00'
        },
        {
            id: 2, agencia_id: 1, rol_id: 2,
            nombre: 'Ana Torres Rios', dni: '70234567',
            email: 'vendedor@agencia.com', telefono: '+51 942 100 002',
            password_hash: 'venta123',
            intentos_fallidos: 0, bloqueado: 0, activo: 1,
            ultimo_login: '2026-05-31T08:30:00',
            created_at: '2024-02-01T08:00:00'
        },
        {
            id: 3, agencia_id: 1, rol_id: 3,
            nombre: 'Pedro Ramirez Silva', dni: '70456789',
            email: 'guia@agencia.com', telefono: '+51 942 100 004',
            password_hash: 'guia123',
            intentos_fallidos: 0, bloqueado: 0, activo: 1,
            ultimo_login: '2026-05-30T06:00:00',
            created_at: '2024-03-01T08:00:00'
        }
    ],

    /* ─── Sesiones ─── */
    sesiones: [
        { id: 1, usuario_id: 1, ip: '192.168.1.10', dispositivo: 'Chrome/Win11', login_at: '2026-05-31T18:00:00', logout_at: null },
        { id: 2, usuario_id: 2, ip: '192.168.1.15', dispositivo: 'Firefox/Win10', login_at: '2026-05-31T08:30:00', logout_at: '2026-05-31T17:30:00' }
    ],

    /* ─── Cajas ─── */
    cajas: [
        {
            id: 1, agencia_id: 1, cajero_id: 2,
            nombre_caja: 'Caja Principal',
            monto_apertura: 200.00,
            monto_cierre_sistema: 1350.00,
            monto_cierre_real: 1345.00,
            diferencia: -5.00,
            estado: 'cerrada',
            abierta_at: '2026-05-30T08:00:00',
            cerrada_at: '2026-05-30T18:00:00'
        },
        {
            id: 2, agencia_id: 1, cajero_id: 2,
            nombre_caja: 'Caja Principal',
            monto_apertura: 200.00,
            monto_cierre_sistema: null,
            monto_cierre_real: null,
            diferencia: null,
            estado: 'abierta',
            abierta_at: '2026-05-31T08:00:00',
            cerrada_at: null
        }
    ],

    /* ─── Pagos ─── */
    pagos: [
        {
            id: 1, agencia_id: 1, caja_id: 2, reserva_id: 1, cajero_id: 2,
            tipo: 'pago_completo', metodo: 'efectivo',
            monto: 170.00, monto_recibido: 200.00, vuelto: 30.00,
            concepto: 'Pago reserva Laguna Azul — 2 personas',
            comprobante_ref: 'BOL-001', created_at: '2026-05-31T09:15:00'
        },
        {
            id: 2, agencia_id: 1, caja_id: 2, reserva_id: 2, cajero_id: 2,
            tipo: 'adelanto', metodo: 'yape',
            monto: 67.50, monto_recibido: 67.50, vuelto: 0,
            concepto: 'Adelanto reserva Cataratas Ahuashiyacu — 3 personas',
            comprobante_ref: 'BOL-002', created_at: '2026-05-31T10:30:00'
        },
        {
            id: 3, agencia_id: 1, caja_id: 2, reserva_id: null, cajero_id: 2,
            tipo: 'egreso', metodo: 'efectivo',
            monto: 25.00, monto_recibido: null, vuelto: null,
            concepto: 'Compra de agua para tours',
            comprobante_ref: null, created_at: '2026-05-31T11:00:00'
        },
        {
            id: 4, agencia_id: 1, caja_id: 2, reserva_id: 3, cajero_id: 2,
            tipo: 'pago_completo', metodo: 'transferencia',
            monto: 70.00, monto_recibido: 70.00, vuelto: 0,
            concepto: 'Pago reserva Mirador Tarapoto — 2 personas',
            comprobante_ref: 'BOL-003', created_at: '2026-05-31T14:20:00'
        }
    ],

    /* ─── Vehiculos ─── */
    vehiculos: [
        {
            id: 1, agencia_id: 1, placa: 'T4R-001', modelo: 'Toyota Hiace 2023',
            capacidad: 15, tipo: 'propio',
            soat_vence: '2026-06-15', revision_vence: '2026-07-20',
            activo: 1
        },
        {
            id: 2, agencia_id: 1, placa: 'T4R-002', modelo: 'Hyundai H1 2022',
            capacidad: 10, tipo: 'propio',
            soat_vence: '2026-12-01', revision_vence: '2026-11-15',
            activo: 1
        },
        {
            id: 3, agencia_id: 1, placa: 'EXT-050', modelo: 'Sprinter 2024',
            capacidad: 20, tipo: 'tercerizado',
            soat_vence: '2027-01-10', revision_vence: '2027-01-10',
            activo: 1
        }
    ],

    /* ─── Mantenimientos ─── */
    mantenimientos: [
        { id: 1, vehiculo_id: 1, tipo: 'preventivo', descripcion: 'Cambio de aceite y filtros', costo: 180.00, fecha: '2026-05-01', realizado_por: 'Taller Motores SM' },
        { id: 2, vehiculo_id: 2, tipo: 'correctivo', descripcion: 'Cambio de frenos traseros', costo: 350.00, fecha: '2026-04-20', realizado_por: 'Mecanica Tarapoto' }
    ],

    /* ─── Equipos (Inventario) ─── */
    equipos: [
        { id: 1, agencia_id: 1, nombre: 'Chaleco salvavidas', cantidad_total: 30, cantidad_disponible: 28, stock_minimo: 10, ubicacion: 'Almacen principal' },
        { id: 2, agencia_id: 1, nombre: 'Botiquin primeros auxilios', cantidad_total: 5, cantidad_disponible: 4, stock_minimo: 2, ubicacion: 'Almacen principal' },
        { id: 3, agencia_id: 1, nombre: 'Botas de caucho', cantidad_total: 20, cantidad_disponible: 3, stock_minimo: 5, ubicacion: 'Almacen secundario' },
        { id: 4, agencia_id: 1, nombre: 'Binoculares', cantidad_total: 8, cantidad_disponible: 8, stock_minimo: 3, ubicacion: 'Almacen principal' },
        { id: 5, agencia_id: 1, nombre: 'Casco de rafting', cantidad_total: 12, cantidad_disponible: 12, stock_minimo: 6, ubicacion: 'Almacen rafting' }
    ],

    /* ─── Proveedores ─── */
    categorias_proveedor: [
        { id: 1, agencia_id: 1, nombre: 'Transporte' },
        { id: 2, agencia_id: 1, nombre: 'Alimentacion' },
        { id: 3, agencia_id: 1, nombre: 'Equipamiento' }
    ],

    proveedores: [
        { id: 1, agencia_id: 1, categoria_id: 1, razon_social: 'Transportes Selva SAC', ruc: '20456789012', contacto_nombre: 'Jorge Vasquez', telefono: '+51 942 555 001', email: 'transporte@selva.com', activo: 1 },
        { id: 2, agencia_id: 1, categoria_id: 2, razon_social: 'Restaurant El Tambo EIRL', ruc: '20567890123', contacto_nombre: 'Marta Pinedo', telefono: '+51 942 555 002', email: 'tambo@rest.com', activo: 1 },
        { id: 3, agencia_id: 1, categoria_id: 3, razon_social: 'Outdoor Equipos Peru', ruc: '20678901234', contacto_nombre: 'Roberto Luna', telefono: '+51 942 555 003', email: 'ventas@outdoor.pe', activo: 1 }
    ],

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
    logs_auditoria: [
        { id: 1, agencia_id: 1, usuario_id: 1, accion: 'CREATE', tabla_afectada: 'tours', registro_id: 6, valor_anterior: null, valor_nuevo: '{"nombre":"Rafting en el Rio Mayo"}', ip: '192.168.1.10', created_at: '2026-05-28T10:00:00' },
        { id: 2, agencia_id: 1, usuario_id: 2, accion: 'CREATE', tabla_afectada: 'reservas', registro_id: 1, valor_anterior: null, valor_nuevo: '{"tour":"Laguna Azul","turista":"Kevin Sanchez","total":170}', ip: '192.168.1.15', created_at: '2026-05-10T10:00:00' },
        { id: 3, agencia_id: 1, usuario_id: 2, accion: 'CREATE', tabla_afectada: 'pagos', registro_id: 1, valor_anterior: null, valor_nuevo: '{"monto":170,"metodo":"efectivo"}', ip: '192.168.1.20', created_at: '2026-05-31T09:15:00' },
        { id: 4, agencia_id: 1, usuario_id: 2, accion: 'UPDATE', tabla_afectada: 'cajas', registro_id: 2, valor_anterior: '{"estado":"abierta"}', valor_nuevo: '{"ingreso":170}', ip: '192.168.1.20', created_at: '2026-05-31T09:16:00' },
        { id: 5, agencia_id: 1, usuario_id: 1, accion: 'UPDATE', tabla_afectada: 'usuarios', registro_id: 6, valor_anterior: '{"activo":1}', valor_nuevo: '{"activo":0,"bloqueado":1}', ip: '192.168.1.10', created_at: '2026-05-15T14:00:00' },
        { id: 6, agencia_id: 1, usuario_id: 2, accion: 'CREATE', tabla_afectada: 'reservas', registro_id: 2, valor_anterior: null, valor_nuevo: '{"tour":"Cataratas Ahuashiyacu","turista":"Kevin Sanchez","total":135}', ip: '192.168.1.15', created_at: '2026-05-28T14:30:00' },
        { id: 7, agencia_id: 1, usuario_id: 2, accion: 'CREATE', tabla_afectada: 'pagos', registro_id: 2, valor_anterior: null, valor_nuevo: '{"monto":67.50,"metodo":"yape","tipo":"adelanto"}', ip: '192.168.1.20', created_at: '2026-05-31T10:30:00' },
        { id: 8, agencia_id: 1, usuario_id: 3, accion: 'CREATE', tabla_afectada: 'asignaciones_tour', registro_id: 1, valor_anterior: null, valor_nuevo: '{"guia":"Pedro Ramirez","vehiculo":"T4R-001"}', ip: '192.168.1.25', created_at: '2026-05-29T09:00:00' }
    ],

    /* ─── Tokens recuperacion (mock) ─── */
    tokens_recuperacion: [],

    /* ─── Asignaciones de tour ─── */
    asignaciones_tour: [
        { id: 1, agencia_id: 1, reserva_id: 1, guia_id: 3, chofer_id: null, vehiculo_id: 1, notas: 'Recojo hotel Monte Azul 07:00', created_at: '2026-05-29T09:00:00' }
    ],

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

const ADMIN_MOCK_VERSION = 3;

function getAdminDb() {
    const storedVersion = localStorage.getItem('turitours_admin_mock_version');
    if (storedVersion !== String(ADMIN_MOCK_VERSION)) {
        localStorage.setItem('turitours_admin_mock_version', String(ADMIN_MOCK_VERSION));
        localStorage.removeItem('turitours_admin_mock_db');
        return JSON.parse(JSON.stringify(ADMIN_MOCK_DB));
    }
    const stored = localStorage.getItem('turitours_admin_mock_db');
    if (!stored) return JSON.parse(JSON.stringify(ADMIN_MOCK_DB));
    try { return JSON.parse(stored); }
    catch (_) { return JSON.parse(JSON.stringify(ADMIN_MOCK_DB)); }
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
