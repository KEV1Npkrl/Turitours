/**
 * ========================================
 * DATOS MOCK - Simula respuestas del backend Java
 * ========================================
 * 
 * Estos datos serán reemplazados por llamadas a la API REST de Java.
 * La estructura de los objetos coincide con las entidades de la BD MySQL.
 */

const MOCK_DATA = {
    // Categorías de tours (tabla: categoria)
    categorias: [
        { id_categoria: 1, nombre: 'Cascadas', descripcion: 'Tours a cascadas y cataratas', icono: 'waterfall' },
        { id_categoria: 2, nombre: 'Lagunas', descripcion: 'Tours a lagunas y lagos', icono: 'lake' },
        { id_categoria: 3, nombre: 'Aventura', descripcion: 'Tours de aventura extrema', icono: 'adventure' },
        { id_categoria: 4, nombre: 'Cultural', descripcion: 'Tours culturales e históricos', icono: 'cultural' },
        { id_categoria: 5, nombre: 'Naturaleza', descripcion: 'Tours de observación de flora y fauna', icono: 'nature' }
    ],

    // Destinos (tabla: destino)
    destinos: [
        {
            id_destino: 1,
            nombre: 'Tarapoto',
            descripcion: 'Ciudad de las Palmeras, capital del departamento de San Martín',
            imagen: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80',
            tours_count: 25,
            bandera: '🇵🇪'
        },
        {
            id_destino: 2,
            nombre: 'Lamas',
            descripcion: 'Ciudad de los tres pisos naturales',
            imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
            tours_count: 12,
            bandera: '🇵🇪'
        },
        {
            id_destino: 3,
            nombre: 'Moyobamba',
            descripcion: 'Ciudad de las orquídeas',
            imagen: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
            tours_count: 18,
            bandera: '🇵🇪'
        },
        {
            id_destino: 4,
            nombre: 'Sauce',
            descripcion: 'Laguna Azul, paraíso natural',
            imagen: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80',
            tours_count: 8,
            bandera: '🇵🇪'
        },
        {
            id_destino: 5,
            nombre: 'Chazuta',
            descripcion: 'Pueblo de artesanos y cascadas',
            imagen: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&q=80',
            tours_count: 6,
            bandera: '🇵🇪'
        }
    ],

    // Tours (tabla: tour)
    tours: [
        {
            id_tour: 1,
            nombre: 'Cataratas de Ahuashiyacu',
            descripcion: 'Visita a una de las cascadas más impresionantes de la región San Martín. Con una caída de 40 metros de altura, esta catarata es un espectáculo natural imperdible. El tour incluye caminata por senderos naturales, tiempo para fotografías y baño en las pozas naturales.',
            precio: 45.00,
            duracion: '4 horas',
            capacidad_maxima: 15,
            ubicacion: 'Tarapoto, San Martín',
            imagen_principal: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80',
            imagenes: [
                'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80',
                'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80',
                'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&q=80'
            ],
            id_categoria: 1,
            categoria_nombre: 'Cascadas',
            rating: 4.8,
            reviews_count: 124,
            destacado: true,
            itinerario: [
                { hora: '08:00', titulo: 'Recojo del hotel', descripcion: 'Pasamos a recogerte en tu hotel en Tarapoto' },
                { hora: '09:00', titulo: 'Llegada al centro de visitantes', descripcion: 'Registro y briefing de seguridad' },
                { hora: '09:30', titulo: 'Caminata por el sendero', descripcion: 'Caminata de 30 minutos por sendero natural' },
                { hora: '10:00', titulo: 'Cataratas de Ahuashiyacu', descripcion: 'Tiempo libre para fotos y baño en las pozas' },
                { hora: '11:30', titulo: 'Retorno', descripcion: 'Regreso a Tarapoto' }
            ],
            incluye: ['Transporte', 'Guía profesional', 'Entrada al parque', 'Seguro de viajero', 'Snacks'],
            no_incluye: ['Almuerzo', 'Propinas', 'Gastos personales']
        },
        {
            id_tour: 2,
            nombre: 'Laguna Azul - Full Day',
            descripcion: 'Descubre la majestuosa Laguna Azul, uno de los destinos más populares de la región. Disfruta de un día completo de relajación, paseos en bote, y un delicioso almuerzo típico con vista al lago. La laguna ofrece aguas cristalinas perfectas para nadar y hacer kayak.',
            precio: 85.00,
            duracion: '8 horas',
            capacidad_maxima: 20,
            ubicacion: 'Sauce, San Martín',
            imagen_principal: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80',
            imagenes: [
                'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
                'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80'
            ],
            id_categoria: 2,
            categoria_nombre: 'Lagunas',
            rating: 4.9,
            reviews_count: 256,
            destacado: true,
            itinerario: [
                { hora: '07:00', titulo: 'Recojo del hotel', descripcion: 'Inicio del viaje hacia Sauce' },
                { hora: '09:00', titulo: 'Llegada a Laguna Azul', descripcion: 'Llegada y tiempo libre para explorar' },
                { hora: '10:00', titulo: 'Paseo en bote', descripcion: 'Recorrido por la laguna en bote' },
                { hora: '12:30', titulo: 'Almuerzo típico', descripcion: 'Almuerzo con vista a la laguna' },
                { hora: '14:00', titulo: 'Actividades libres', descripcion: 'Kayak, natación o relajación' },
                { hora: '16:00', titulo: 'Retorno', descripcion: 'Regreso a Tarapoto' }
            ],
            incluye: ['Transporte', 'Guía profesional', 'Paseo en bote', 'Almuerzo típico', 'Seguro de viajero'],
            no_incluye: ['Actividades extras', 'Propinas', 'Bebidas alcohólicas']
        },
        {
            id_tour: 3,
            nombre: 'Caminata al Mirador de Tarapoto',
            descripcion: 'Una experiencia de trekking moderado que te llevará al punto más alto con vista panorámica de toda la ciudad de Tarapoto y sus alrededores. Ideal para amantes del senderismo y la fotografía.',
            precio: 35.00,
            duracion: '3 horas',
            capacidad_maxima: 12,
            ubicacion: 'Tarapoto, San Martín',
            imagen_principal: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
            imagenes: [
                'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
            ],
            id_categoria: 3,
            categoria_nombre: 'Aventura',
            rating: 4.6,
            reviews_count: 89,
            destacado: false,
            itinerario: [
                { hora: '06:00', titulo: 'Recojo del hotel', descripcion: 'Inicio temprano para evitar el calor' },
                { hora: '06:30', titulo: 'Inicio de la caminata', descripcion: 'Caminata por senderos naturales' },
                { hora: '08:00', titulo: 'Llegada al mirador', descripcion: 'Vista panorámica y tiempo para fotos' },
                { hora: '09:00', titulo: 'Descenso y retorno', descripcion: 'Regreso a Tarapoto' }
            ],
            incluye: ['Transporte', 'Guía profesional', 'Agua y snacks', 'Seguro de viajero'],
            no_incluye: ['Desayuno', 'Propinas']
        },
        {
            id_tour: 4,
            nombre: 'Comunidad Nativa de Lamas',
            descripcion: 'Visita cultural a la comunidad nativa Wayku en Lamas. Conoce sus tradiciones ancestrales, artesanías, danzas típicas y gastronomía tradicional. Una experiencia única de intercambio cultural.',
            precio: 65.00,
            duracion: '6 horas',
            capacidad_maxima: 15,
            ubicacion: 'Lamas, San Martín',
            imagen_principal: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&q=80',
            imagenes: [
                'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&q=80',
                'https://images.unsplash.com/photo-1504681869696-d977211a5f4c?w=800&q=80'
            ],
            id_categoria: 4,
            categoria_nombre: 'Cultural',
            rating: 4.7,
            reviews_count: 67,
            destacado: true,
            itinerario: [
                { hora: '08:00', titulo: 'Recojo del hotel', descripcion: 'Viaje hacia Lamas' },
                { hora: '09:30', titulo: 'Llegada a Lamas', descripcion: 'Visita al mirador de la ciudad' },
                { hora: '10:30', titulo: 'Comunidad Wayku', descripcion: 'Recorrido por la comunidad nativa' },
                { hora: '12:00', titulo: 'Demostración cultural', descripcion: 'Danzas y artesanías tradicionales' },
                { hora: '13:00', titulo: 'Almuerzo típico', descripcion: 'Gastronomía tradicional amazónica' },
                { hora: '14:30', titulo: 'Retorno', descripcion: 'Regreso a Tarapoto' }
            ],
            incluye: ['Transporte', 'Guía bilingüe', 'Entrada a la comunidad', 'Almuerzo típico', 'Seguro de viajero'],
            no_incluye: ['Artesanías', 'Propinas', 'Fotos adicionales']
        },
        {
            id_tour: 5,
            nombre: 'Avistamiento de Aves',
            descripcion: 'Tour especializado para amantes de la ornitología. La región San Martín es hogar de más de 500 especies de aves. Nuestros guías expertos te llevarán a los mejores puntos de avistamiento.',
            precio: 95.00,
            duracion: '5 horas',
            capacidad_maxima: 8,
            ubicacion: 'Tarapoto, San Martín',
            imagen_principal: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80',
            imagenes: [
                'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80',
                'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=800&q=80'
            ],
            id_categoria: 5,
            categoria_nombre: 'Naturaleza',
            rating: 4.9,
            reviews_count: 45,
            destacado: false,
            itinerario: [
                { hora: '05:00', titulo: 'Recojo del hotel', descripcion: 'Salida muy temprana para el avistamiento' },
                { hora: '05:45', titulo: 'Llegada al punto', descripcion: 'Inicio del avistamiento de aves' },
                { hora: '08:00', titulo: 'Desayuno de campo', descripcion: 'Pausa para desayuno en la naturaleza' },
                { hora: '09:00', titulo: 'Segundo avistamiento', descripcion: 'Continuación del tour' },
                { hora: '10:00', titulo: 'Retorno', descripcion: 'Regreso a Tarapoto' }
            ],
            incluye: ['Transporte', 'Guía ornitólogo', 'Binoculares', 'Desayuno de campo', 'Lista de especies', 'Seguro de viajero'],
            no_incluye: ['Cámara fotográfica', 'Propinas']
        },
        {
            id_tour: 6,
            nombre: 'Rafting en el Río Mayo',
            descripcion: 'Aventura de rafting clase III-IV en el río Mayo. Adrenalina pura para los amantes de los deportes extremos. Incluye todas las medidas de seguridad y equipamiento profesional.',
            precio: 120.00,
            duracion: '5 horas',
            capacidad_maxima: 10,
            ubicacion: 'Tarapoto, San Martín',
            imagen_principal: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=800&q=80',
            imagenes: [
                'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=800&q=80',
                'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80'
            ],
            id_categoria: 3,
            categoria_nombre: 'Aventura',
            rating: 4.8,
            reviews_count: 78,
            destacado: true,
            itinerario: [
                { hora: '07:30', titulo: 'Recojo del hotel', descripcion: 'Traslado al punto de inicio' },
                { hora: '09:00', titulo: 'Briefing de seguridad', descripcion: 'Instrucciones y equipamiento' },
                { hora: '09:30', titulo: 'Inicio del rafting', descripcion: 'Descenso por el río Mayo' },
                { hora: '11:30', titulo: 'Llegada al punto final', descripcion: 'Fin de la actividad' },
                { hora: '12:00', titulo: 'Almuerzo', descripcion: 'Almuerzo de recuperación' },
                { hora: '13:00', titulo: 'Retorno', descripcion: 'Regreso a Tarapoto' }
            ],
            incluye: ['Transporte', 'Guías certificados', 'Equipo completo', 'Almuerzo', 'Seguro de aventura', 'Fotos del descenso'],
            no_incluye: ['Propinas', 'Bebidas adicionales']
        },
        {
            id_tour: 7,
            nombre: 'Cascadas de Huacamaíllo',
            descripcion: 'Descubre las cascadas escondidas de Huacamaíllo, un verdadero tesoro natural con múltiples caídas de agua en un entorno de selva virgen.',
            precio: 55.00,
            duracion: '5 horas',
            capacidad_maxima: 12,
            ubicacion: 'Chazuta, San Martín',
            imagen_principal: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&q=80',
            imagenes: [
                'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&q=80',
                'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80'
            ],
            id_categoria: 1,
            categoria_nombre: 'Cascadas',
            rating: 4.7,
            reviews_count: 56,
            destacado: false,
            itinerario: [
                { hora: '08:00', titulo: 'Recojo del hotel', descripcion: 'Traslado a Chazuta' },
                { hora: '09:30', titulo: 'Inicio de caminata', descripcion: 'Caminata por sendero selvático' },
                { hora: '10:30', titulo: 'Primera cascada', descripcion: 'Tiempo para fotos y baño' },
                { hora: '11:30', titulo: 'Segunda cascada', descripcion: 'Cascada principal de Huacamaíllo' },
                { hora: '13:00', titulo: 'Retorno', descripcion: 'Regreso a Tarapoto' }
            ],
            incluye: ['Transporte', 'Guía profesional', 'Entrada', 'Snacks y frutas', 'Seguro de viajero'],
            no_incluye: ['Almuerzo', 'Propinas']
        },
        {
            id_tour: 8,
            nombre: 'Tour Nocturno de Fauna',
            descripcion: 'Experiencia única de observación de fauna nocturna en la selva. Descubre tarantulas, ranas venenosas, serpientes y otros animales nocturnos con guías especializados.',
            precio: 75.00,
            duracion: '4 horas',
            capacidad_maxima: 8,
            ubicacion: 'Tarapoto, San Martín',
            imagen_principal: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80',
            imagenes: [
                'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80',
                'https://images.unsplash.com/photo-1470093851219-69951fcbb533?w=800&q=80'
            ],
            id_categoria: 5,
            categoria_nombre: 'Naturaleza',
            rating: 4.6,
            reviews_count: 34,
            destacado: false,
            itinerario: [
                { hora: '18:00', titulo: 'Recojo del hotel', descripcion: 'Traslado al punto de inicio' },
                { hora: '18:30', titulo: 'Briefing', descripcion: 'Instrucciones y equipo' },
                { hora: '19:00', titulo: 'Caminata nocturna', descripcion: 'Exploración con linternas' },
                { hora: '21:30', titulo: 'Regreso', descripcion: 'Retorno al hotel' }
            ],
            incluye: ['Transporte', 'Guía especializado', 'Linternas', 'Botas de goma', 'Snacks', 'Seguro de viajero'],
            no_incluye: ['Cena', 'Propinas', 'Cámara']
        }
    ],

    // Usuario de prueba (tabla: turista)
    usuario_prueba: {
        id_turista: 1,
        nombre: 'Kevin',
        apellido: 'Sanchez',
        email: 'kevin@example.com',
        telefono: '+51 999 888 777',
        pais: 'Perú',
        ciudad: 'Lima'
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.MOCK_DATA = MOCK_DATA;
}
