/**
 * Mock de BD — turismo_tarapoto
 * Estructura alineada con database/bd_turismo_tarapoto.sql
 * Cuando exista Java+MySQL, reemplazar por respuestas de /api/*
 */

const MOCK_DB = {
    agencias: [{
        id: 1,
        nombre: 'Tarapoto Tours',
        ruc: '20123456789',
        ciudad: 'Tarapoto',
        direccion: 'Jr. San Martin 456',
        telefono: '+51 942 123 456',
        email: 'info@tarapototours.com',
        logo_url: null,
        plan_id: 2,
        estado: 'activa',
        fecha_alta: '2024-01-15',
        created_at: '2024-01-15T08:00:00'
    }],

    parametros_globales: {
        tipo_cambio_usd: 3.75,
        moneda_default: 'PEN',
        iva_porcentaje: 18,
        reserva_bloqueo_min: 10
    },

    paises: [
        { id: 1, nombre: 'Peru', codigo_iso: 'PE' },
        { id: 2, nombre: 'Estados Unidos', codigo_iso: 'US' },
        { id: 3, nombre: 'Francia', codigo_iso: 'FR' },
        { id: 4, nombre: 'Espana', codigo_iso: 'ES' },
        { id: 5, nombre: 'Brasil', codigo_iso: 'BR' }
    ],

    categorias_tour: [
        { id: 1, agencia_id: 1, nombre: 'Full Day', descripcion: 'Tours de dia completo' },
        { id: 2, agencia_id: 1, nombre: 'Aventura', descripcion: 'Tours de aventura' },
        { id: 3, agencia_id: 1, nombre: 'Cultural', descripcion: 'Tours culturales' },
        { id: 4, agencia_id: 1, nombre: 'Naturaleza', descripcion: 'Observacion de flora y fauna' },
        { id: 5, agencia_id: 1, nombre: 'Cascadas', descripcion: 'Tours a cataratas' }
    ],

    destinos: [
        { id: 1, agencia_id: 1, nombre: 'Tarapoto', descripcion: 'Ciudad de las Palmeras, capital de San Martin', latitud: -6.4870, longitud: -76.3660, activo: 1 },
        { id: 2, agencia_id: 1, nombre: 'Lamas', descripcion: 'Ciudad de los tres pisos naturales', latitud: -6.4217, longitud: -76.5217, activo: 1 },
        { id: 3, agencia_id: 1, nombre: 'Moyobamba', descripcion: 'Ciudad de las orquideas', latitud: -6.0333, longitud: -76.9667, activo: 1 },
        { id: 4, agencia_id: 1, nombre: 'Sauce', descripcion: 'Laguna Azul, paraiso natural', latitud: -6.6833, longitud: -76.2167, activo: 1 },
        { id: 5, agencia_id: 1, nombre: 'Chazuta', descripcion: 'Pueblo de artesanos y cascadas', latitud: -6.5833, longitud: -76.0833, activo: 1 }
    ],

    tours: [
        {
            id: 1, agencia_id: 1, destino_id: 1, categoria_id: 5,
            nombre: 'Cataratas de Ahuashiyacu',
            descripcion: 'Visita a una de las cascadas mas impresionantes de San Martin. Caida de 40 metros, caminata por senderos naturales y tiempo para fotografias y bano en pozas naturales.',
            itinerario: '[{"hora":"08:00","titulo":"Recojo del hotel","descripcion":"Pasamos a recogerte en tu hotel en Tarapoto"},{"hora":"09:00","titulo":"Centro de visitantes","descripcion":"Registro y briefing de seguridad"},{"hora":"09:30","titulo":"Caminata al sendero","descripcion":"Caminata de 30 minutos por sendero natural"},{"hora":"10:00","titulo":"Cataratas","descripcion":"Tiempo libre para fotos y bano en las pozas"},{"hora":"11:30","titulo":"Retorno","descripcion":"Regreso a Tarapoto"}]',
            duracion_horas: 4, cupo_maximo: 15,
            precio_nacional: 45.00, precio_extranjero: 65.00,
            estado: 'activo', created_at: '2025-01-01T08:00:00'
        },
        {
            id: 2, agencia_id: 1, destino_id: 4, categoria_id: 1,
            nombre: 'Laguna Azul - Full Day',
            descripcion: 'Dia completo en la majestuosa Laguna Azul. Paseo en bote, almuerzo tipico y actividades acuaticas en aguas cristalinas.',
            itinerario: '[{"hora":"07:00","titulo":"Recojo","descripcion":"Viaje hacia Sauce"},{"hora":"09:00","titulo":"Laguna Azul","descripcion":"Llegada y tiempo libre"},{"hora":"10:00","titulo":"Paseo en bote","descripcion":"Recorrido por la laguna"},{"hora":"12:30","titulo":"Almuerzo tipico","descripcion":"Almuerzo con vista a la laguna"},{"hora":"16:00","titulo":"Retorno","descripcion":"Regreso a Tarapoto"}]',
            duracion_horas: 8, cupo_maximo: 20,
            precio_nacional: 85.00, precio_extranjero: 120.00,
            estado: 'activo', created_at: '2025-01-01T08:00:00'
        },
        {
            id: 3, agencia_id: 1, destino_id: 1, categoria_id: 2,
            nombre: 'Caminata al Mirador de Tarapoto',
            descripcion: 'Trekking moderado al punto mas alto con vista panoramica de Tarapoto. Ideal para senderismo y fotografia.',
            itinerario: '[{"hora":"06:00","titulo":"Recojo","descripcion":"Salida temprana"},{"hora":"06:30","titulo":"Inicio caminata","descripcion":"Senderos naturales"},{"hora":"08:00","titulo":"Mirador","descripcion":"Vista panoramica y fotos"},{"hora":"09:00","titulo":"Retorno","descripcion":"Regreso a Tarapoto"}]',
            duracion_horas: 3, cupo_maximo: 12,
            precio_nacional: 35.00, precio_extranjero: 50.00,
            estado: 'activo', created_at: '2025-01-01T08:00:00'
        },
        {
            id: 4, agencia_id: 1, destino_id: 2, categoria_id: 3,
            nombre: 'Comunidad Nativa de Lamas',
            descripcion: 'Experiencia cultural en la comunidad Wayku: tradiciones, artesanias, danzas y gastronomia amazonica.',
            itinerario: '[{"hora":"08:00","titulo":"Recojo","descripcion":"Viaje a Lamas"},{"hora":"10:30","titulo":"Comunidad Wayku","descripcion":"Recorrido cultural"},{"hora":"12:00","titulo":"Demostracion","descripcion":"Danzas y artesanias"},{"hora":"13:00","titulo":"Almuerzo tipico","descripcion":"Gastronomia local"},{"hora":"14:30","titulo":"Retorno","descripcion":"Regreso a Tarapoto"}]',
            duracion_horas: 6, cupo_maximo: 15,
            precio_nacional: 65.00, precio_extranjero: 90.00,
            estado: 'activo', created_at: '2025-01-01T08:00:00'
        },
        {
            id: 5, agencia_id: 1, destino_id: 1, categoria_id: 4,
            nombre: 'Avistamiento de Aves',
            descripcion: 'Tour ornitologico en San Martin, hogar de mas de 500 especies. Guia experto y puntos de avistamiento seleccionados.',
            itinerario: '[{"hora":"05:00","titulo":"Recojo","descripcion":"Salida muy temprana"},{"hora":"05:45","titulo":"Avistamiento","descripcion":"Observacion de aves"},{"hora":"08:00","titulo":"Desayuno de campo","descripcion":"Pausa en la naturaleza"},{"hora":"10:00","titulo":"Retorno","descripcion":"Regreso a Tarapoto"}]',
            duracion_horas: 5, cupo_maximo: 8,
            precio_nacional: 95.00, precio_extranjero: 130.00,
            estado: 'activo', created_at: '2025-01-01T08:00:00'
        },
        {
            id: 6, agencia_id: 1, destino_id: 1, categoria_id: 2,
            nombre: 'Rafting en el Rio Mayo',
            descripcion: 'Rafting clase III-IV en el rio Mayo. Equipamiento profesional y medidas de seguridad completas.',
            itinerario: '[{"hora":"07:30","titulo":"Recojo","descripcion":"Traslado al punto de inicio"},{"hora":"09:00","titulo":"Briefing","descripcion":"Seguridad y equipamiento"},{"hora":"09:30","titulo":"Rafting","descripcion":"Descenso por el rio Mayo"},{"hora":"12:00","titulo":"Almuerzo","descripcion":"Almuerzo de recuperacion"},{"hora":"13:00","titulo":"Retorno","descripcion":"Regreso a Tarapoto"}]',
            duracion_horas: 5, cupo_maximo: 10,
            precio_nacional: 120.00, precio_extranjero: 160.00,
            estado: 'activo', created_at: '2025-01-01T08:00:00'
        }
    ],

    tour_imagenes: [
        { id: 1, tour_id: 1, url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80', es_principal: 1, orden: 0 },
        { id: 2, tour_id: 1, url: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80', es_principal: 0, orden: 1 },
        { id: 3, tour_id: 1, url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&q=80', es_principal: 0, orden: 2 },
        { id: 4, tour_id: 2, url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80', es_principal: 1, orden: 0 },
        { id: 5, tour_id: 2, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', es_principal: 0, orden: 1 },
        { id: 6, tour_id: 3, url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', es_principal: 1, orden: 0 },
        { id: 7, tour_id: 4, url: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&q=80', es_principal: 1, orden: 0 },
        { id: 8, tour_id: 5, url: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80', es_principal: 1, orden: 0 },
        { id: 9, tour_id: 6, url: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=800&q=80', es_principal: 1, orden: 0 }
    ],

    // Contenido extra de detalle (no esta en tablas SQL; futuro: columnas JSON o tabla relacionada)
    tour_contenido: {
        1: { incluye: ['Transporte', 'Guia profesional', 'Entrada al parque', 'Seguro de viajero', 'Snacks'], no_incluye: ['Almuerzo', 'Propinas', 'Gastos personales'] },
        2: { incluye: ['Transporte', 'Guia profesional', 'Paseo en bote', 'Almuerzo tipico', 'Seguro de viajero'], no_incluye: ['Actividades extras', 'Propinas', 'Bebidas alcoholicas'] },
        3: { incluye: ['Transporte', 'Guia profesional', 'Agua y snacks', 'Seguro de viajero'], no_incluye: ['Desayuno', 'Propinas'] },
        4: { incluye: ['Transporte', 'Guia bilingue', 'Entrada a la comunidad', 'Almuerzo tipico', 'Seguro de viajero'], no_incluye: ['Artesanias', 'Propinas'] },
        5: { incluye: ['Transporte', 'Guia ornitologo', 'Binoculares', 'Desayuno de campo', 'Seguro de viajero'], no_incluye: ['Camara fotografica', 'Propinas'] },
        6: { incluye: ['Transporte', 'Guias certificados', 'Equipo completo', 'Almuerzo', 'Seguro de aventura'], no_incluye: ['Propinas', 'Bebidas adicionales'] }
    },

    temporadas: [
        {
            id: 1, agencia_id: 1, tour_id: 2,
            nombre: 'Temporada alta',
            fecha_inicio: '2025-07-01', fecha_fin: '2025-08-31',
            precio_nacional: 95.00, precio_extranjero: 135.00
        }
    ],

    resenas: [
        { id: 1, agencia_id: 1, tour_id: 1, turista_id: 2, reserva_id: 1, calificacion: 5, comentario: 'Excelente experiencia', visible: 1, created_at: '2025-03-01' },
        { id: 2, agencia_id: 1, tour_id: 1, turista_id: 3, reserva_id: 2, calificacion: 5, comentario: 'Muy recomendado', visible: 1, created_at: '2025-03-05' },
        { id: 3, agencia_id: 1, tour_id: 2, turista_id: 2, reserva_id: 3, calificacion: 5, comentario: 'Laguna hermosa', visible: 1, created_at: '2025-04-01' },
        { id: 4, agencia_id: 1, tour_id: 2, turista_id: 4, reserva_id: 4, calificacion: 4, comentario: 'Muy bueno', visible: 1, created_at: '2025-04-10' }
    ],

    turistas: [
        {
            id: 1, agencia_id: 1, tipo_doc: 'DNI', documento: '72345678',
            nombre: 'Kevin', apellidos: 'Sanchez Asensio',
            email: 'kevin@example.com', celular: '+51 999 888 777',
            fecha_nacimiento: '2002-05-15', pais_id: 1,
            restricciones_medicas: null, notas_crm: null,
            segmento: 'normal', email_verificado: 1,
            password: 'demo1234'
        }
    ],

    reservas: [
        {
            id: 1, agencia_id: 1, tour_id: 2, turista_id: 1, vendedor_id: null, cupon_id: null,
            fecha_servicio: '2026-06-20', hora_recojo: '07:00:00', lugar_recojo: 'Hotel Monte Azul, Tarapoto',
            num_personas: 2, precio_unitario: 85.00, descuento: 0, total: 170.00, saldo_pendiente: 0,
            moneda: 'PEN', canal: 'web', estado: 'confirmada', motivo_anulacion: null,
            codigo_qr: 'QR-TPT-DEMO001', created_at: '2026-05-10T10:00:00'
        },
        {
            id: 2, agencia_id: 1, tour_id: 1, turista_id: 1, vendedor_id: null, cupon_id: null,
            fecha_servicio: '2026-07-15', hora_recojo: '08:00:00', lugar_recojo: 'Plaza de Armas, Tarapoto',
            num_personas: 3, precio_unitario: 45.00, descuento: 0, total: 135.00, saldo_pendiente: 67.50,
            moneda: 'PEN', canal: 'web', estado: 'pendiente', motivo_anulacion: null,
            codigo_qr: 'QR-TPT-DEMO002', created_at: '2026-05-28T14:30:00'
        }
    ],

    reprogramaciones: [],

    cupones: [
        {
            id: 1, agencia_id: 1, codigo: 'TARAPOTO10', descripcion: '10% de descuento',
            tipo: 'porcentaje', valor: 10.00,
            fecha_inicio: '2025-01-01', fecha_fin: '2025-12-31',
            usos_max: 100, usos_actuales: 5, activo: 1
        }
    ]
};

// Compatibilidad: alias legacy usado por scripts antiguos
const MOCK_DATA = MOCK_DB;

const MOCK_DB_VERSION = 2;

function getMockDb() {
    const storedVersion = localStorage.getItem('turismo_tarapoto_mock_version');
    if (storedVersion !== String(MOCK_DB_VERSION)) {
        localStorage.setItem('turismo_tarapoto_mock_version', String(MOCK_DB_VERSION));
        localStorage.removeItem('turismo_tarapoto_mock_db');
        return cloneMockDb(MOCK_DB);
    }

    const stored = localStorage.getItem('turismo_tarapoto_mock_db');
    if (!stored) return cloneMockDb(MOCK_DB);
    try {
        return JSON.parse(stored);
    } catch (_) {
        return cloneMockDb(MOCK_DB);
    }
}

function saveMockDb(db) {
    localStorage.setItem('turismo_tarapoto_mock_db', JSON.stringify(db));
}

function resetMockDb() {
    localStorage.removeItem('turismo_tarapoto_mock_db');
    localStorage.removeItem('turismo_tarapoto_mock_version');
}

function cloneMockDb(source) {
    return JSON.parse(JSON.stringify(source));
}

if (typeof window !== 'undefined') {
    window.MOCK_DB = MOCK_DB;
    window.MOCK_DATA = MOCK_DATA;
    window.getMockDb = getMockDb;
    window.saveMockDb = saveMockDb;
    window.resetMockDb = resetMockDb;
}
