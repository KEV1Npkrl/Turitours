/**
 * Mock de BD â turismo_tarapoto
 * Estructura alineada con database/bd_turismo_tarapoto.sql
 * Cuando exista Java+MySQL, reemplazar por respuestas de /api/*
 */

const MOCK_DB = {
    agencias: [{
        id: 1,
        nombre: 'Turi Tours',
        ruc: '20123456789',
        ciudad: 'Tarapoto',
        direccion: 'Jr. Miguel Grau 140',
        telefono: '+51 942 123 456',
        email: 'info@turitours.com',
        logo_url: null,
        max_usuarios: 10,
        modulos: ["caja", "operaciones", "reportes", "facturacion"],
        estado: 'activa',
        fecha_alta: '2024-01-15',
        created_at: '2024-01-15T08:00:00'
    }],

    parametros_globales: {
        tipo_cambio_usd: 3.75,
        moneda_default: 'PEN',
        iva_porcentaje: 18,
    },

    sunat_series_agencia: [
        { id: 1, agencia_id: 1, tipo_comprobante: '03', serie: 'B001', correlativo_actual: 14, activo: true },
        { id: 2, agencia_id: 1, tipo_comprobante: '01', serie: 'F001', correlativo_actual: 5, activo: true }
    ],

    comprobantes_electronicos: [
        { id: 1, agencia_id: 1, reserva_id: 1, pago_id: 1, tipo_comprobante: '03', serie: 'B001', correlativo: 14, fecha_emision: '2024-03-15T10:30:00', cliente_tipo_doc: '1', cliente_num_doc: '74859612', cliente_nombre: 'Maria Garcia', moneda: 'PEN', ope_gravadas: 0, ope_exoneradas: 250.00, igv: 0, total: 250.00, estado_sunat: 'aceptado', pdf_url: '#' },
        { id: 2, agencia_id: 1, reserva_id: null, pago_id: 2, tipo_comprobante: '01', serie: 'F001', correlativo: 5, fecha_emision: '2024-03-16T14:20:00', cliente_tipo_doc: '6', cliente_num_doc: '20123456789', cliente_nombre: 'Empresa de Turismo SAC', moneda: 'PEN', ope_gravadas: 400.00, ope_exoneradas: 0, igv: 72.00, total: 472.00, estado_sunat: 'aceptado', pdf_url: '#' }
    ],

    paises: [
        { id: 1, nombre: 'Peru', codigo_iso: 'PE' },
        { id: 2, nombre: 'Estados Unidos', codigo_iso: 'US' },
        { id: 3, nombre: 'Francia', codigo_iso: 'FR' },
        { id: 4, nombre: 'Espana', codigo_iso: 'ES' },
        { id: 5, nombre: 'Brasil', codigo_iso: 'BR' }
    ],

    categorias_tour: [
        { id: 1, agencia_id: 1, nombre: 'Full Day', descripcion: 'Tours de día completo', icono: 'fullday' },
        { id: 2, agencia_id: 1, nombre: 'Aventura', descripcion: 'Tours de aventura y deportes extremos', icono: 'adventure' },
        { id: 3, agencia_id: 1, nombre: 'Cultural', descripcion: 'Sitios arqueológicos, museos y comunidades', icono: 'cultural' },
        { id: 4, agencia_id: 1, nombre: 'Naturaleza', descripcion: 'Observación de flora, fauna y selva', icono: 'nature' },
        { id: 5, agencia_id: 1, nombre: 'Cascadas', descripcion: 'Tours a cataratas y caídas de agua', icono: 'waterfall' },
        { id: 6, agencia_id: 1, nombre: 'Gastronómico', descripcion: 'Rutas culinarias y degustaciones', icono: 'gastronomic' },
        { id: 7, agencia_id: 1, nombre: 'Urbano', descripcion: 'City tours y paseos en la ciudad', icono: 'urban' },
        { id: 8, agencia_id: 1, nombre: 'Playa', descripcion: 'Tours costeros y balnearios', icono: 'beach' },
        { id: 9, agencia_id: 1, nombre: 'Trekking', descripcion: 'Caminatas de varias horas o días', icono: 'trekking' },
        { id: 10, agencia_id: 1, nombre: 'Místico', descripcion: 'Rituales y turismo esotérico', icono: 'mystic' },
        { id: 11, agencia_id: 1, nombre: 'Pernocte', descripcion: 'Tours que incluyen noche de campamento o lodge', icono: 'night' }
    ],

    destinos: [],

    tours: [],

    tour_imagenes: [
        {
                "id": 1,
                "tour_id": 1,
                "url": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Castell_de_Lamas%2C_San_Mart%C3%ADn09.jpg",
                "es_principal": 1,
                "orden": 0
        },
        {
                "id": 2,
                "tour_id": 2,
                "url": "https://upload.wikimedia.org/wikipedia/commons/a/ac/Port_de_Sauce_a_la_Laguna_de_Sauce_a_la_prov%C3%ADncia_de_San_Mart%C3%ADn.jpg",
                "es_principal": 1,
                "orden": 0
        },
        {
                "id": 3,
                "tour_id": 3,
                "url": "https://upload.wikimedia.org/wikipedia/commons/c/cd/Cataras_de_Ahuashiyacu.jpg",
                "es_principal": 1,
                "orden": 0
        },
        {
                "id": 4,
                "tour_id": 4,
                "url": "https://taytamaki.com/wp-content/uploads/2022/12/304542641_809456460209758_2804320703011965875_n-DeNoiseAI-standard-standard-scale-6_00x-gigapixel-3-1024x732.jpg",
                "es_principal": 1,
                "orden": 0
        },
        {
                "id": 5,
                "tour_id": 5,
                "url": "https://leitoinntarapoto.com/media/tour/cataratas-de-pucayaquillo-nnguevhocnrn-1.jpg",
                "es_principal": 1,
                "orden": 0
        },
        {
                "id": 6,
                "tour_id": 6,
                "url": "https://adventur.pe/wp-content/uploads/2024/07/bote-rojo.webp",
                "es_principal": 1,
                "orden": 0
        },
        {
                "id": 7,
                "tour_id": 7,
                "url": "https://upload.wikimedia.org/wikipedia/commons/d/d9/Tarapoto.jpg",
                "es_principal": 1,
                "orden": 0
        },
        {
                "id": 8,
                "tour_id": 8,
                "url": "https://consultasenlinea.mincetur.gob.pe/fichaInventario/foto.aspx?cod=643551",
                "es_principal": 1,
                "orden": 0
        },
        {
                "id": 9,
                "tour_id": 9,
                "url": "https://tarapoto.tours/wp-content/uploads/2016/10/optimized_2289_07.jpg",
                "es_principal": 1,
                "orden": 0
        },
        {
                "id": 10,
                "tour_id": 10,
                "url": "https://tarapoto.tours/wp-content/uploads/2016/07/tour-pishurayacu-3-1024x683.jpg",
                "es_principal": 1,
                "orden": 0
        },
        {
                "id": 11,
                "tour_id": 11,
                "url": "https://upload.wikimedia.org/wikipedia/commons/a/ac/Port_de_Sauce_a_la_Laguna_de_Sauce_a_la_prov%C3%ADncia_de_San_Mart%C3%ADn.jpg",
                "es_principal": 1,
                "orden": 0
        },
        {
                "id": 12,
                "tour_id": 12,
                "url": "https://upload.wikimedia.org/wikipedia/commons/d/d9/Tarapoto.jpg",
                "es_principal": 1,
                "orden": 0
        },
        {
                "id": 13,
                "tour_id": 13,
                "url": "https://taytamaki.com/wp-content/uploads/2022/02/CANOPY2-1024x768.jpg",
                "es_principal": 1,
                "orden": 0
        }
],

    // Contenido extra de detalle (no esta en tablas SQL; futuro: columnas JSON o tabla relacionada)
    tour_contenido: {
        "1": {
                "incluye": [
                        "Recojo de su hotel",
                        "Transporte ida y vuelta",
                        "Orientador turístico",
                        "Entradas al Castillo Lamas",
                        "Visita Plaza de Armas",
                        "Visita Comunidad Nativa Wayku"
                ],
                "no_incluye": [
                        "Entrada al Museo de Lamas",
                        "Alimentación"
                ],
                "recomendaciones": [
                        "Llevar bloqueador, repelente",
                        "Respetar la naturaleza"
                ],
                "restricciones": "CUPOS LIMITADOS, validar disponibilidad. Niños a partir de 5 años pagan tarifa normal. El Itinerario puede variar a criterio del operador para garantizar seguridad. Niños menores de 4 años excluyen pago y quedan bajo responsabilidad de los padres."
        },
        "2": {
                "incluye": [
                        "Recojo de su hotel",
                        "Transporte ida y vuelta",
                        "Orientador turístico",
                        "Degustación de tragos exóticos",
                        "Paseo en bote",
                        "Paseo a Caballo",
                        "Almuerzo a la carta"
                ],
                "no_incluye": [
                        "Derecho de ingreso a la laguna S/ 4.00 (Obligatorio)",
                        "Actividades opcionales (Moto acuática, Kayak, Canopy, Baños de barro)"
                ],
                "recomendaciones": [
                        "Ropa cómoda y bañador",
                        "Protector solar y repelente"
                ],
                "restricciones": "CUPOS LIMITADOS, validar disponibilidad. Niños a partir de 5 años pagan tarifa normal. El Itinerario puede variar a criterio del operador para garantizar seguridad. Niños menores de 4 años excluyen pago y quedan bajo responsabilidad de los padres."
        },
        "3": {
                "incluye": [
                        "Recojo de su hotel",
                        "Transporte",
                        "Orientador turístico",
                        "Entrada a la Reserva Natural"
                ],
                "no_incluye": [
                        "Alimentación",
                        "Gastos personales"
                ],
                "recomendaciones": [
                        "Ropa cómoda y bañador",
                        "Protector solar y repelente"
                ],
                "restricciones": "CUPOS LIMITADOS, validar disponibilidad. Niños a partir de 5 años pagan tarifa normal. El Itinerario puede variar a criterio del operador para garantizar seguridad. Niños menores de 4 años excluyen pago y quedan bajo responsabilidad de los padres."
        },
        "4": {
                "incluye": [
                        "Recojo de hotel",
                        "Transporte",
                        "Entradas al mirador Taytamaki",
                        "Foto profesional en la figura de la mano"
                ],
                "no_incluye": [
                        "Deportes de aventura dentro del mirador"
                ],
                "recomendaciones": [
                        "Llevar bloqueador y repelente"
                ],
                "restricciones": "CUPOS LIMITADOS, validar disponibilidad. Niños a partir de 5 años pagan tarifa normal. El Itinerario puede variar a criterio del operador para garantizar seguridad. Niños menores de 4 años excluyen pago y quedan bajo responsabilidad de los padres."
        },
        "5": {
                "incluye": [
                        "Recojo de hotel",
                        "Transporte",
                        "Orientador",
                        "Entrada a Cascadas Salto de la Bruja",
                        "Almuerzo regional"
                ],
                "no_incluye": [
                        "Gastos personales"
                ],
                "recomendaciones": [
                        "Zapatillas para caminata",
                        "Ropa cómoda y bañador",
                        "Ser cuidadosos en escaleras"
                ],
                "restricciones": "CUPOS LIMITADOS, validar disponibilidad. Niños a partir de 5 años pagan tarifa normal. El Itinerario puede variar a criterio del operador para garantizar seguridad. Niños menores de 4 años excluyen pago y quedan bajo responsabilidad de los padres."
        },
        "6": {
                "incluye": [
                        "Recojo de hotel",
                        "Transporte",
                        "Actividad de floating",
                        "Equipo de seguridad",
                        "Orientador turístico"
                ],
                "no_incluye": [
                        "Alimentación"
                ],
                "recomendaciones": [
                        "Bloqueador y repelente",
                        "Ropa cómoda y bañador"
                ],
                "restricciones": "CUPOS LIMITADOS, validar disponibilidad. Niños a partir de 5 años pagan tarifa normal. El Itinerario puede variar a criterio del operador para garantizar seguridad. Niños menores de 4 años excluyen pago y quedan bajo responsabilidad de los padres."
        },
        "7": {
                "incluye": [
                        "Recojo de hotel",
                        "Transporte",
                        "Entrada fábrica de chocolates Orquídea",
                        "Entrada Tabacalera del Oriente",
                        "Entrada centro de rescate URKU"
                ],
                "no_incluye": [
                        "Alimentación"
                ],
                "recomendaciones": [
                        "Bloqueador, gorro y mangas"
                ],
                "restricciones": "CUPOS LIMITADOS, validar disponibilidad. Niños a partir de 5 años pagan tarifa normal. El Itinerario puede variar a criterio del operador para garantizar seguridad. Niños menores de 4 años excluyen pago y quedan bajo responsabilidad de los padres."
        },
        "8": {
                "incluye": [
                        "Recojo de hotel",
                        "Transporte",
                        "Orientador",
                        "Degustación de café",
                        "Ingreso al Orquideario",
                        "Ingreso a Tioyacu",
                        "Ingreso a Termas San Mateo",
                        "Almuerzo a la carta"
                ],
                "no_incluye": [
                        "Gastos personales"
                ],
                "recomendaciones": [
                        "Ropa cómoda y bañador",
                        "Protector solar y repelente"
                ],
                "restricciones": "CUPOS LIMITADOS, validar disponibilidad. Niños a partir de 5 años pagan tarifa normal. El Itinerario puede variar a criterio del operador para garantizar seguridad. Niños menores de 4 años excluyen pago y quedan bajo responsabilidad de los padres."
        },
        "9": {
                "incluye": [
                        "Recojo de hotel",
                        "Transporte",
                        "Orientador",
                        "Entradas a Reserva Santa Elena",
                        "Entrada a las cuevas",
                        "Desayuno regional",
                        "Almuerzo regional"
                ],
                "no_incluye": [
                        "Gastos personales"
                ],
                "recomendaciones": [
                        "Ropa cómoda",
                        "Repelente",
                        "Ser cuidadosos en las cuevas"
                ],
                "restricciones": "CUPOS LIMITADOS, validar disponibilidad. Niños a partir de 5 años pagan tarifa normal. El Itinerario puede variar a criterio del operador para garantizar seguridad. Niños menores de 4 años excluyen pago y quedan bajo responsabilidad de los padres."
        },
        "10": {
                "incluye": [
                        "Recojo de hotel",
                        "Transporte",
                        "Orientador",
                        "Entrada Cascadas Carpishuyacu/Pishurayacu",
                        "Baños termales San José",
                        "Almuerzo regional"
                ],
                "no_incluye": [
                        "Gastos extras"
                ],
                "recomendaciones": [
                        "Zapatillas de trekking",
                        "Bañador y repelente"
                ],
                "restricciones": "CUPOS LIMITADOS, validar disponibilidad. Niños a partir de 5 años pagan tarifa normal. El Itinerario puede variar a criterio del operador para garantizar seguridad. Niños menores de 4 años excluyen pago y quedan bajo responsabilidad de los padres."
        },
        "11": {
                "incluye": [
                        "Recojo y traslado aeropuerto",
                        "4D/3N Alojamiento",
                        "Desayunos",
                        "Almuerzos en Laguna Azul y Altomayo",
                        "Entradas y guías a Lamas, Laguna Azul, Altomayo, Ahuashiyacu"
                ],
                "no_incluye": [
                        "Cenas",
                        "Pasajes terrestres/aereos",
                        "Retorno Sauce-Tarapoto si hotel es en Sauce"
                ],
                "recomendaciones": [
                        "Consultar disponibilidad"
                ],
                "restricciones": "Sujeto a mín 2 personas. No válido feriados. CUPOS LIMITADOS, validar disponibilidad. Niños a partir de 5 años pagan tarifa normal. El Itinerario puede variar a criterio del operador para garantizar seguridad. Niños menores de 4 años excluyen pago y quedan bajo responsabilidad de los padres."
        },
        "12": {
                "incluye": [
                        "Recojo y traslado aeropuerto",
                        "3D/2N Alojamiento",
                        "Desayunos",
                        "Almuerzo en Laguna Azul",
                        "Tours Lamas, Laguna Azul, Ahuashiyacu"
                ],
                "no_incluye": [
                        "Cenas",
                        "Pasajes",
                        "Traslado Sauce si hotel allá"
                ],
                "recomendaciones": [
                        "Consultar"
                ],
                "restricciones": "Mín 2 personas. CUPOS LIMITADOS, validar disponibilidad. Niños a partir de 5 años pagan tarifa normal. El Itinerario puede variar a criterio del operador para garantizar seguridad. Niños menores de 4 años excluyen pago y quedan bajo responsabilidad de los padres."
        },
        "13": {
                "incluye": [
                        "Recojo y traslado aeropuerto",
                        "6D/5N Alojamiento",
                        "Desayunos",
                        "Almuerzos en Laguna Azul, Altomayo, Carpishuyacu, Salto de la Bruja",
                        "Tours programados"
                ],
                "no_incluye": [
                        "Cenas",
                        "Pasajes"
                ],
                "recomendaciones": [
                        "Consultar"
                ],
                "restricciones": "Mín 2 personas. CUPOS LIMITADOS, validar disponibilidad. Niños a partir de 5 años pagan tarifa normal. El Itinerario puede variar a criterio del operador para garantizar seguridad. Niños menores de 4 años excluyen pago y quedan bajo responsabilidad de los padres."
        }
},


    temporadas: [
        {
            id: 1, agencia_id: 1, tour_id: 2,
            nombre: 'Temporada alta',
            fecha_inicio: '2026-06-01', fecha_fin: '2026-08-31',
            precio_nacional: 95.00, precio_extranjero: 135.00
        },
        {
            id: 2, agencia_id: 1, tour_id: 1,
            nombre: 'Temporada alta',
            fecha_inicio: '2026-07-01', fecha_fin: '2026-08-31',
            precio_nacional: 52.00, precio_extranjero: 75.00
        }
    ],

    resenas: [
        { id: 1, agencia_id: 1, tour_id: 1, turista_id: 2, reserva_id: 1, calificacion: 5, comentario: 'Excelente experiencia', visible: 1, created_at: '2025-03-01' },
        { id: 2, agencia_id: 1, tour_id: 1, turista_id: 3, reserva_id: 2, calificacion: 5, comentario: 'Muy recomendado', visible: 1, created_at: '2025-03-05' },
        { id: 3, agencia_id: 1, tour_id: 2, turista_id: 2, reserva_id: 3, calificacion: 5, comentario: 'Laguna hermosa', visible: 1, created_at: '2025-04-01' },
        { id: 4, agencia_id: 1, tour_id: 2, turista_id: 4, reserva_id: 4, calificacion: 4, comentario: 'Muy bueno', visible: 1, created_at: '2025-04-10' }
    ],

    turistas: [],

    reservas: [],

    bloqueos_cupo: [],

    notificaciones: [],

    reprogramaciones: [],

    cupones: [
        {
            id: 1, agencia_id: 1, codigo: 'TARAPOTO10', descripcion: '10% de descuento',
            tipo: 'porcentaje', valor: 10.00,
            fecha_inicio: '2025-01-01', fecha_fin: '2027-12-31',
            usos_max: 100, usos_actuales: 5, activo: 1
        }
    ],

    super_usuarios: [
        {
            id: 1, nombre: 'Super Admin', email: 'admin@superadmin.com',
            password: 'admin123', activo: 1
        }
    ],

    auditoria_global: [
        { id: 1, super_usuario_id: 1, accion: 'LOGIN', detalles: 'Inicio de sesiÃ³n SuperAdmin', ip: '192.168.1.1', created_at: '2026-06-01T08:00:00' }
    ]
};

// Compatibilidad: alias legacy usado por scripts antiguos
const MOCK_DATA = MOCK_DB;

const MOCK_DB_VERSION = 20;

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

(function() {
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/superadmin/')) {
        const db = getMockDb();
        const currentAgency = db.agencias.find(a => a.id === 1); 
        if (currentAgency && currentAgency.estado === 'suspendida') {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.innerHTML = `<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; background:#f1f5f9; font-family:Inter, sans-serif; text-align:center; padding:2rem; margin:0;">
                        <svg viewBox="0 0 24 24" width="80" height="80" stroke="currentColor" stroke-width="2" fill="none" style="color:#ef4444; margin-bottom:1.5rem;">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                        <h1 style="color:#0f172a; font-size:2.5rem; margin-bottom:0.5rem; font-weight:700;">Servicio Suspendido</h1>
                        <p style="color:#475569; font-size:1.125rem; max-width:600px; margin:0 auto;">
                            El acceso a este portal ha sido temporalmente inhabilitado por disposición de <b>Tarapoto SaaS</b>.
                        </p>
                        <div style="margin-top:2rem; padding:1rem; background:white; border-radius:8px; border:1px solid #e2e8f0; max-width:400px; width:100%;">
                            <p style="color:#64748b; font-size:0.875rem; margin:0;">Si eres el administrador de la agencia <b>${currentAgency.nombre}</b>, por favor contacta a soporte técnico para regularizar tu suscripción.</p>
                        </div>
                    </div>`;});
        }
    }
})();

