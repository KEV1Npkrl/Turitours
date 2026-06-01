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

    destinos: [
        { id: 1, agencia_id: 1, nombre: 'Tarapoto', descripcion: 'Ciudad de las Palmeras, capital de San Martin', latitud: -6.4870, longitud: -76.3660, activo: 1 },
        { id: 2, agencia_id: 1, nombre: 'Lamas', descripcion: 'Ciudad de los tres pisos naturales', latitud: -6.4217, longitud: -76.5217, activo: 1 },
        { id: 3, agencia_id: 1, nombre: 'Moyobamba', descripcion: 'Ciudad de las orquideas', latitud: -6.0333, longitud: -76.9667, activo: 1 },
        { id: 4, agencia_id: 1, nombre: 'Sauce', descripcion: 'Laguna Azul, paraiso natural', latitud: -6.6833, longitud: -76.2167, activo: 1 },
        { id: 5, agencia_id: 1, nombre: 'Chazuta', descripcion: 'Pueblo de artesanos y cascadas', latitud: -6.5833, longitud: -76.0833, activo: 1 }
    ],

    tours: [
        {
                "id": 1,
                "agencia_id": 1,
                "destino_id": 2,
                "categoria_id": 3,
                "nombre": "Tour Lamas Nativo",
                "descripcion": "Visita al Castillo de Lamas, Plaza de Armas y Comunidad Nativa del Barrio Wayku.",
                "itinerario": "[{\"hora\":\"15:00\",\"titulo\":\"Recojo del hotel\",\"descripcion\":\"Recojo de su hotel entre las 3:00 + 45 mins pm.\"},{\"hora\":\"16:00\",\"titulo\":\"Plaza de Armas\",\"descripcion\":\"Parada en la Plaza de Armas, historia de la ciudad.\"},{\"hora\":\"16:30\",\"titulo\":\"Mirador Natural\",\"descripcion\":\"Observación de la ciudad de los 3 pisos y compra de artesanías.\"},{\"hora\":\"17:00\",\"titulo\":\"Castillo de Lamas\",\"descripcion\":\"Recorrido por cada piso del castillo con explicación.\"},{\"hora\":\"18:00\",\"titulo\":\"Comunidad Nativa Wayku\",\"descripcion\":\"Conocer sus costumbres, música, bailes y participación.\"},{\"hora\":\"18:30\",\"titulo\":\"Retorno\",\"descripcion\":\"LLegada a Tarapoto, 6:30 pm aprox.\"}]",
                "duracion_horas": 4,
                "cupo_maximo": 20,
                "precio_nacional": 45,
                "precio_extranjero": 60,
                "estado": "activo",
                "destacado": 1,
                "created_at": "2025-01-01T08:00:00"
        },
        {
                "id": 2,
                "agencia_id": 1,
                "destino_id": 4,
                "categoria_id": 4,
                "nombre": "Tour Laguna Azul - Sauce",
                "descripcion": "Paseo en bote, degustación de tragos y relax en la hermosa Laguna Azul.",
                "itinerario": "[{\"hora\":\"07:40\",\"titulo\":\"Recojo\",\"descripcion\":\"Recojo de su hotel/ubicación a partir de las 7:40 + 45 mins AM.\"},{\"hora\":\"09:00\",\"titulo\":\"Río Huallaga\",\"descripcion\":\"Cruce en la balsa cautiva.\"},{\"hora\":\"09:30\",\"titulo\":\"Mirador Punta del Gallinazo\",\"descripcion\":\"Observación del Río Huallaga y fotos en estructuras.\"},{\"hora\":\"10:30\",\"titulo\":\"Laguna Azul\",\"descripcion\":\"Paseo en bote de aproximadamente una hora.\"},{\"hora\":\"11:30\",\"titulo\":\"Asiento de la Sirena\",\"descripcion\":\"Parada para fotos e historia.\"},{\"hora\":\"12:30\",\"titulo\":\"Almuerzo y Relax\",\"descripcion\":\"Almuerzo a la carta y actividades recreativas.\"},{\"hora\":\"16:00\",\"titulo\":\"Retorno\",\"descripcion\":\"Regreso a Tarapoto, 4:00 pm aprox.\"}]",
                "duracion_horas": 8,
                "cupo_maximo": 20,
                "precio_nacional": 100,
                "precio_extranjero": 135,
                "estado": "activo",
                "destacado": 1,
                "created_at": "2025-01-01T08:00:00"
        },
        {
                "id": 3,
                "agencia_id": 1,
                "destino_id": 1,
                "categoria_id": 5,
                "nombre": "Tour Cataratas de Ahuashiyacu",
                "descripcion": "Visita a la caída de agua más famosa de Tarapoto, con baño y fotografías.",
                "itinerario": "[{\"hora\":\"09:30\",\"titulo\":\"Recojo\",\"descripcion\":\"Recojo de su hotel entre las 9:30 am + 45 mins.\"},{\"hora\":\"10:15\",\"titulo\":\"Mirador Ahuashiyacu\",\"descripcion\":\"Hermosa vegetación del área de conservación cerro escalera.\"},{\"hora\":\"10:30\",\"titulo\":\"Caminata\",\"descripcion\":\"Caminata de 10 minutos en medio de la Selva.\"},{\"hora\":\"10:45\",\"titulo\":\"Catarata\",\"descripcion\":\"Baño, relax, toma fotográfica en la caída de agua.\"},{\"hora\":\"12:30\",\"titulo\":\"Compras\",\"descripcion\":\"Compras artesanales en la entrada.\"},{\"hora\":\"13:00\",\"titulo\":\"Retorno\",\"descripcion\":\"Llegada a Tarapoto: 1:00 pm aprox.\"}]",
                "duracion_horas": 4,
                "cupo_maximo": 20,
                "precio_nacional": 45,
                "precio_extranjero": 60,
                "estado": "activo",
                "destacado": 1,
                "created_at": "2025-01-01T08:00:00"
        },
        {
                "id": 4,
                "agencia_id": 1,
                "destino_id": 1,
                "categoria_id": 2,
                "nombre": "Tour Mirador Taytamaki",
                "descripcion": "Increíbles vistas panorámicas y deportes de aventura opcionales.",
                "itinerario": "[{\"hora\":\"09:00\",\"titulo\":\"Recojo y Caminata\",\"descripcion\":\"Turno Mañana (9 a 12 pm) o Tarde (3 a 6 pm). Caminata por los 7 pecados capitales.\"},{\"hora\":\"10:00\",\"titulo\":\"Mirador Taytamaki\",\"descripcion\":\"Entrada al mirador, fotos paisajísticas increíbles.\"},{\"hora\":\"10:30\",\"titulo\":\"Actividades\",\"descripcion\":\"Actividades opcionales de aventura (Canopy, Skybike).\"},{\"hora\":\"12:00\",\"titulo\":\"Retorno\",\"descripcion\":\"Regreso a Tarapoto.\"}]",
                "duracion_horas": 3,
                "cupo_maximo": 15,
                "precio_nacional": 60,
                "precio_extranjero": 80,
                "estado": "activo",
                "destacado": 0,
                "created_at": "2025-01-01T08:00:00"
        },
        {
                "id": 5,
                "agencia_id": 1,
                "destino_id": 1,
                "categoria_id": 5,
                "nombre": "Tour Cascada Salto de la Bruja",
                "descripcion": "Caminata en la selva, múltiples caídas de agua y almuerzo regional.",
                "itinerario": "[{\"hora\":\"08:30\",\"titulo\":\"Recojo\",\"descripcion\":\"Recojo de su hotel a partir de las 8:30 - 9:00 am.\"},{\"hora\":\"09:30\",\"titulo\":\"Llegada\",\"descripcion\":\"Viaje por la carretera Tarapoto-Yurimaguas y caminata de 30 minutos.\"},{\"hora\":\"10:00\",\"titulo\":\"Cascadas\",\"descripcion\":\"Secuencias de caídas de agua en medio de copiosa vegetación.\"},{\"hora\":\"11:00\",\"titulo\":\"Baño y Relax\",\"descripcion\":\"Baño y admiración del magnífico lugar.\"},{\"hora\":\"13:00\",\"titulo\":\"Almuerzo\",\"descripcion\":\"Disfrutamos del Almuerzo regional.\"},{\"hora\":\"16:00\",\"titulo\":\"Retorno\",\"descripcion\":\"Llegada a Tarapoto, 4:00 pm aprox.\"}]",
                "duracion_horas": 7,
                "cupo_maximo": 15,
                "precio_nacional": 80,
                "precio_extranjero": 110,
                "estado": "activo",
                "destacado": 0,
                "created_at": "2025-01-01T08:00:00"
        },
        {
                "id": 6,
                "agencia_id": 1,
                "destino_id": 1,
                "categoria_id": 2,
                "nombre": "Canotaje Extremo Río Mayo",
                "descripcion": "Aventura extrema en rápidos de categoría I, II y III en San Miguel del Río Mayo.",
                "itinerario": "[{\"hora\":\"09:00\",\"titulo\":\"Recojo\",\"descripcion\":\"Turno Mañana (9 a 12 pm) o Tarde (3 a 6 pm). Viaje a San Miguel del Río Mayo.\"},{\"hora\":\"09:45\",\"titulo\":\"Briefing\",\"descripcion\":\"Charla de seguridad y entrega de equipo.\"},{\"hora\":\"10:00\",\"titulo\":\"Canotaje\",\"descripcion\":\"Inicio del canotaje con rápidos.\"},{\"hora\":\"11:00\",\"titulo\":\"Floating\",\"descripcion\":\"Descanso y actividad de floating en el agua.\"},{\"hora\":\"12:00\",\"titulo\":\"Retorno\",\"descripcion\":\"Baño refrescante y regreso a Tarapoto.\"}]",
                "duracion_horas": 3,
                "cupo_maximo": 20,
                "precio_nacional": 70,
                "precio_extranjero": 95,
                "estado": "activo",
                "destacado": 0,
                "created_at": "2025-01-01T08:00:00"
        },
        {
                "id": 7,
                "agencia_id": 1,
                "destino_id": 1,
                "categoria_id": 7,
                "nombre": "City Tour Tarapoto",
                "descripcion": "Fábrica de chocolates Orquídea, Tabacalera y centro de rescate URKU.",
                "itinerario": "[{\"hora\":\"09:00\",\"titulo\":\"Recojo\",\"descripcion\":\"Salida 9:00 am + 35 mins aprox.\"},{\"hora\":\"10:00\",\"titulo\":\"Fábrica de Chocolates\",\"descripcion\":\"Visita a La Orquídea, proceso y degustación.\"},{\"hora\":\"11:00\",\"titulo\":\"Centro URKU\",\"descripcion\":\"Rescate ecológico, conservación de flora y fauna.\"},{\"hora\":\"12:00\",\"titulo\":\"Tabacalera del Oriente\",\"descripcion\":\"Fábrica de puros artesanales.\"},{\"hora\":\"13:00\",\"titulo\":\"Retorno\",\"descripcion\":\"Retorno a su alojamiento.\"}]",
                "duracion_horas": 4,
                "cupo_maximo": 20,
                "precio_nacional": 80,
                "precio_extranjero": 110,
                "estado": "activo",
                "destacado": 0,
                "created_at": "2025-01-01T08:00:00"
        },
        {
                "id": 8,
                "agencia_id": 1,
                "destino_id": 3,
                "categoria_id": 1,
                "nombre": "Tour Altomayo (Moyobamba - Rioja)",
                "descripcion": "Naciente del Tioyacu, Orquideario, Baños Termales San Mateo.",
                "itinerario": "[{\"hora\":\"07:00\",\"titulo\":\"Recojo\",\"descripcion\":\"Recojo a partir de las 7:00 + 45 mins rumbo a Moyobamba.\"},{\"hora\":\"09:00\",\"titulo\":\"Naciente TioYacu\",\"descripcion\":\"Río cristalino para bañarse y tomar fotos.\"},{\"hora\":\"11:00\",\"titulo\":\"Chacra Vieja\",\"descripcion\":\"Museo y degustación de tragos exóticos regionales.\"},{\"hora\":\"13:00\",\"titulo\":\"Almuerzo\",\"descripcion\":\"Almuerzo a la carta en restaurante turístico.\"},{\"hora\":\"14:30\",\"titulo\":\"Orquideario\",\"descripcion\":\"Visita al orquideario de Moyobamba.\"},{\"hora\":\"16:00\",\"titulo\":\"Baños Termales\",\"descripcion\":\"Relajación en las aguas de San Mateo (38-40°).\"},{\"hora\":\"19:00\",\"titulo\":\"Retorno\",\"descripcion\":\"Regreso a Tarapoto, 7:00 pm aprox.\"}]",
                "duracion_horas": 12,
                "cupo_maximo": 20,
                "precio_nacional": 120,
                "precio_extranjero": 160,
                "estado": "activo",
                "destacado": 1,
                "created_at": "2025-01-01T08:00:00"
        },
        {
                "id": 9,
                "agencia_id": 1,
                "destino_id": 3,
                "categoria_id": 1,
                "nombre": "Tour Santa Elena y Las Cuevas",
                "descripcion": "Paseo en bote por aguajales de Santa Elena y recorrido de estalactitas en cuevas.",
                "itinerario": "[{\"hora\":\"03:00\",\"titulo\":\"Recojo Madrugada\",\"descripcion\":\"Recojo 3:00 a 3:30 am con dirección a Rioja.\"},{\"hora\":\"06:00\",\"titulo\":\"Aguajales Santa Helena\",\"descripcion\":\"Paseo de 2 horas en bote observando especies animales.\"},{\"hora\":\"08:30\",\"titulo\":\"Desayuno\",\"descripcion\":\"Desayuno regional.\"},{\"hora\":\"09:30\",\"titulo\":\"Las Cuevas\",\"descripcion\":\"Recorrido de 1 hora 30 min observando estalactitas.\"},{\"hora\":\"13:00\",\"titulo\":\"Almuerzo\",\"descripcion\":\"Almuerzo regional.\"},{\"hora\":\"16:00\",\"titulo\":\"Retorno\",\"descripcion\":\"Llegada a Tarapoto, 4:00 pm aprox.\"}]",
                "duracion_horas": 13,
                "cupo_maximo": 15,
                "precio_nacional": 250,
                "precio_extranjero": 340,
                "estado": "activo",
                "destacado": 0,
                "created_at": "2025-01-01T08:00:00"
        },
        {
                "id": 10,
                "agencia_id": 1,
                "destino_id": 1,
                "categoria_id": 5,
                "nombre": "Tours Carpishuyacu / Pishurayacu",
                "descripcion": "Cascadas ocultas, cruce en bote y baños termales de San José.",
                "itinerario": "[{\"hora\":\"08:30\",\"titulo\":\"Recojo\",\"descripcion\":\"Recojo de su hotel a partir de las 8:30 - 9:00 am.\"},{\"hora\":\"09:45\",\"titulo\":\"Caminata\",\"descripcion\":\"Caminata de 45 minutos (Dificultad alta) en la selva virgen.\"},{\"hora\":\"10:30\",\"titulo\":\"Cruce en Bote\",\"descripcion\":\"Cruce de un pequeño río en bote artesanal.\"},{\"hora\":\"11:00\",\"titulo\":\"Cascadas\",\"descripcion\":\"Baño en Carpishuyacu y visita a Pishurayacu.\"},{\"hora\":\"13:00\",\"titulo\":\"Baños Termales\",\"descripcion\":\"Baño curativo en las termas de San José.\"},{\"hora\":\"14:30\",\"titulo\":\"Almuerzo\",\"descripcion\":\"Almuerzo regional en el caserío.\"},{\"hora\":\"16:00\",\"titulo\":\"Retorno\",\"descripcion\":\"Llegada a Tarapoto, 4:00 pm aprox.\"}]",
                "duracion_horas": 8,
                "cupo_maximo": 15,
                "precio_nacional": 100,
                "precio_extranjero": 135,
                "estado": "activo",
                "destacado": 0,
                "created_at": "2025-01-01T08:00:00"
        },
        {
                "id": 11,
                "agencia_id": 1,
                "destino_id": 1,
                "categoria_id": 11,
                "nombre": "Tarapoto Aventurero 4D/3N",
                "descripcion": "Paquete de 4 días incluyendo Lamas, Laguna Azul, Altomayo y Ahuashiyacu.",
                "itinerario": "[{\"hora\":\"Día 1\",\"titulo\":\"Lamas Nativa\",\"descripcion\":\"Recojo aeropuerto. Tarde: Visita a Lamas (Plaza, Castillo, Wayku).\"},{\"hora\":\"Día 2\",\"titulo\":\"Laguna Azul\",\"descripcion\":\"Full day en la Laguna Azul con paseo en bote y almuerzo.\"},{\"hora\":\"Día 3\",\"titulo\":\"Altomayo\",\"descripcion\":\"Moyobamba y Rioja (Tioyacu, Orquideario, Termales).\"},{\"hora\":\"Día 4\",\"titulo\":\"Ahuashiyacu\",\"descripcion\":\"Mañana: Cataratas de Ahuashiyacu. Traslado al aeropuerto.\"}]",
                "duracion_horas": 72,
                "cupo_maximo": 50,
                "precio_nacional": 450,
                "precio_extranjero": 610,
                "estado": "activo",
                "destacado": 1,
                "created_at": "2025-01-01T08:00:00"
        },
        {
                "id": 12,
                "agencia_id": 1,
                "destino_id": 1,
                "categoria_id": 11,
                "nombre": "Tarapoto Relax 3D/2N",
                "descripcion": "Relajate en Tarapoto visitando Lamas, Laguna Azul y las Cataratas de Ahuashiyacu.",
                "itinerario": "[{\"hora\":\"Día 1\",\"titulo\":\"Lamas Nativa\",\"descripcion\":\"Recojo aeropuerto. Visita cultural a Lamas.\"},{\"hora\":\"Día 2\",\"titulo\":\"Laguna Azul\",\"descripcion\":\"Full day de relax en la bella Laguna Azul con paseo a caballo.\"},{\"hora\":\"Día 3\",\"titulo\":\"Ahuashiyacu\",\"descripcion\":\"Medio tiempo visitando las hermosas cataratas. Traslado al aeropuerto.\"}]",
                "duracion_horas": 48,
                "cupo_maximo": 50,
                "precio_nacional": 350,
                "precio_extranjero": 475,
                "estado": "activo",
                "destacado": 0,
                "created_at": "2025-01-01T08:00:00"
        },
        {
                "id": 13,
                "agencia_id": 1,
                "destino_id": 1,
                "categoria_id": 11,
                "nombre": "Tarapoto Extremo 6D/5N",
                "descripcion": "El paquete más completo. Descubre todo San Martín: Lagunas, Cataratas y Rutas termales.",
                "itinerario": "[{\"hora\":\"Día 1\",\"titulo\":\"Lamas\",\"descripcion\":\"Llegada y tour vespertino a la comunidad de Lamas.\"},{\"hora\":\"Día 2\",\"titulo\":\"Laguna Azul\",\"descripcion\":\"Paseo en bote y caballo en Sauce.\"},{\"hora\":\"Día 3\",\"titulo\":\"Altomayo\",\"descripcion\":\"Ruta norte: Moyobamba y Rioja.\"},{\"hora\":\"Día 4\",\"titulo\":\"Carpishuyacu\",\"descripcion\":\"Caminata exigente y recompensa en termas de San José.\"},{\"hora\":\"Día 5\",\"titulo\":\"Salto de la Bruja\",\"descripcion\":\"Aventura en múltiples caídas de agua en selva virgen.\"},{\"hora\":\"Día 6\",\"titulo\":\"Ahuashiyacu\",\"descripcion\":\"Despedida en las famosas cataratas y traslado al aeropuerto.\"}]",
                "duracion_horas": 120,
                "cupo_maximo": 50,
                "precio_nacional": 700,
                "precio_extranjero": 945,
                "estado": "activo",
                "destacado": 1,
                "created_at": "2025-01-01T08:00:00"
        }
],

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

    turistas: [
        {
            id: 1, agencia_id: 1, tipo_doc: 'DNI', documento: '72345678',
                        nombre: 'Paula', apellidos: 'Liza',
                        email: 'paula@example.com', celular: '+51 999 888 777',
            fecha_nacimiento: '2002-05-15', pais_id: 1,
            restricciones_medicas: null, notas_crm: null,
                        ubicacion: 'Trujillo, Perú',
                        foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnzo5HJLLgvmhEPD4Jjitt-1zDV1L7xlh9ig&s',
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
            codigo_qr: 'QR-TPT-DEMO001', created_at: '2026-05-10T10:00:00', solicitud_cambio: null
        },
        {
            id: 2, agencia_id: 1, tour_id: 1, turista_id: 1, vendedor_id: null, cupon_id: null,
            fecha_servicio: '2026-07-15', hora_recojo: '08:00:00', lugar_recojo: 'Plaza de Armas, Tarapoto',
            num_personas: 3, precio_unitario: 45.00, descuento: 0, total: 135.00, saldo_pendiente: 67.50,
            moneda: 'PEN', canal: 'web', estado: 'pendiente', motivo_anulacion: null,
            codigo_qr: 'QR-TPT-DEMO002', created_at: '2026-05-28T14:30:00', solicitud_cambio: null
        },
        {
            id: 3, agencia_id: 1, tour_id: 3, turista_id: 1, vendedor_id: null, cupon_id: null,
            fecha_servicio: '2026-03-10', hora_recojo: '06:00:00', lugar_recojo: 'Hotel en Tarapoto',
            num_personas: 2, precio_unitario: 35.00, descuento: 0, total: 70.00, saldo_pendiente: 0,
            moneda: 'PEN', canal: 'web', estado: 'completada', motivo_anulacion: null,
            codigo_qr: 'QR-TPT-DEMO003', created_at: '2026-02-01T09:00:00', solicitud_cambio: null
        }
    ],

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

