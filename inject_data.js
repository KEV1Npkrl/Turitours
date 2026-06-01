const fs = require('fs');

const tours = [
    {
        id: 1, agencia_id: 1, destino_id: 2, categoria_id: 3,
        nombre: 'Tour Lamas Nativo', descripcion: 'Visita al Castillo de Lamas, Plaza de Armas y Comunidad Nativa del Barrio Wayku.',
        itinerario: JSON.stringify([
            {hora: "15:00", titulo: "Recojo del hotel", descripcion: "Recojo de su hotel entre las 3:00 + 45 mins pm."},
            {hora: "16:00", titulo: "Plaza de Armas", descripcion: "Parada en la Plaza de Armas, historia de la ciudad."},
            {hora: "16:30", titulo: "Mirador Natural", descripcion: "Observación de la ciudad de los 3 pisos y compra de artesanías."},
            {hora: "17:00", titulo: "Castillo de Lamas", descripcion: "Recorrido por cada piso del castillo con explicación."},
            {hora: "18:00", titulo: "Comunidad Nativa Wayku", descripcion: "Conocer sus costumbres, música, bailes y participación."},
            {hora: "18:30", titulo: "Retorno", descripcion: "LLegada a Tarapoto, 6:30 pm aprox."}
        ]),
        duracion_horas: 4, cupo_maximo: 20, precio_nacional: 45.00, precio_extranjero: 45.00, estado: 'activo', destacado: 1,
        created_at: '2025-01-01T08:00:00'
    },
    {
        id: 2, agencia_id: 1, destino_id: 4, categoria_id: 4,
        nombre: 'Tour Laguna Azul - Sauce', descripcion: 'Paseo en bote, degustación de tragos y relax en la hermosa Laguna Azul.',
        itinerario: JSON.stringify([
            {hora: "07:40", titulo: "Recojo", descripcion: "Recojo de su hotel/ubicación a partir de las 7:40 + 45 mins AM."},
            {hora: "09:00", titulo: "Río Huallaga", descripcion: "Cruce en la balsa cautiva."},
            {hora: "09:30", titulo: "Mirador Punta del Gallinazo", descripcion: "Observación del Río Huallaga y fotos en estructuras."},
            {hora: "10:30", titulo: "Laguna Azul", descripcion: "Paseo en bote de aproximadamente una hora."},
            {hora: "11:30", titulo: "Asiento de la Sirena", descripcion: "Parada para fotos e historia."},
            {hora: "12:30", titulo: "Almuerzo y Relax", descripcion: "Almuerzo a la carta y actividades recreativas."},
            {hora: "16:00", titulo: "Retorno", descripcion: "Regreso a Tarapoto, 4:00 pm aprox."}
        ]),
        duracion_horas: 8, cupo_maximo: 20, precio_nacional: 100.00, precio_extranjero: 100.00, estado: 'activo', destacado: 1,
        created_at: '2025-01-01T08:00:00'
    },
    {
        id: 3, agencia_id: 1, destino_id: 1, categoria_id: 5,
        nombre: 'Tour Cataratas de Ahuashiyacu', descripcion: 'Visita a la caída de agua más famosa de Tarapoto, con baño y fotografías.',
        itinerario: JSON.stringify([
            {hora: "09:30", titulo: "Recojo", descripcion: "Recojo de su hotel entre las 9:30 am + 45 mins."},
            {hora: "10:15", titulo: "Mirador Ahuashiyacu", descripcion: "Hermosa vegetación del área de conservación cerro escalera."},
            {hora: "10:30", titulo: "Caminata", descripcion: "Caminata de 10 minutos en medio de la Selva."},
            {hora: "10:45", titulo: "Catarata", descripcion: "Baño, relax, toma fotográfica en la caída de agua."},
            {hora: "12:30", titulo: "Compras", descripcion: "Compras artesanales en la entrada."},
            {hora: "13:00", titulo: "Retorno", descripcion: "Llegada a Tarapoto: 1:00 pm aprox."}
        ]),
        duracion_horas: 4, cupo_maximo: 20, precio_nacional: 45.00, precio_extranjero: 45.00, estado: 'activo', destacado: 1,
        created_at: '2025-01-01T08:00:00'
    },
    {
        id: 4, agencia_id: 1, destino_id: 1, categoria_id: 2,
        nombre: 'Tour Mirador Taytamaki', descripcion: 'Increíbles vistas panorámicas y deportes de aventura opcionales.',
        itinerario: JSON.stringify([
            {hora: "09:00", titulo: "Recojo y Caminata", descripcion: "Turno Mañana (9 a 12 pm) o Tarde (3 a 6 pm). Caminata por los 7 pecados capitales."},
            {hora: "10:00", titulo: "Mirador Taytamaki", descripcion: "Entrada al mirador, fotos paisajísticas increíbles."},
            {hora: "10:30", titulo: "Actividades", descripcion: "Actividades opcionales de aventura (Canopy, Skybike)."},
            {hora: "12:00", titulo: "Retorno", descripcion: "Regreso a Tarapoto."}
        ]),
        duracion_horas: 3, cupo_maximo: 15, precio_nacional: 60.00, precio_extranjero: 60.00, estado: 'activo', destacado: 0,
        created_at: '2025-01-01T08:00:00'
    },
    {
        id: 5, agencia_id: 1, destino_id: 1, categoria_id: 5,
        nombre: 'Tour Cascada Salto de la Bruja', descripcion: 'Caminata en la selva, múltiples caídas de agua y almuerzo regional.',
        itinerario: JSON.stringify([
            {hora: "08:30", titulo: "Recojo", descripcion: "Recojo de su hotel a partir de las 8:30 - 9:00 am."},
            {hora: "09:30", titulo: "Llegada", descripcion: "Viaje por la carretera Tarapoto-Yurimaguas y caminata de 30 minutos."},
            {hora: "10:00", titulo: "Cascadas", descripcion: "Secuencias de caídas de agua en medio de copiosa vegetación."},
            {hora: "11:00", titulo: "Baño y Relax", descripcion: "Baño y admiración del magnífico lugar."},
            {hora: "13:00", titulo: "Almuerzo", descripcion: "Disfrutamos del Almuerzo regional."},
            {hora: "16:00", titulo: "Retorno", descripcion: "Llegada a Tarapoto, 4:00 pm aprox."}
        ]),
        duracion_horas: 7, cupo_maximo: 15, precio_nacional: 80.00, precio_extranjero: 80.00, estado: 'activo', destacado: 0,
        created_at: '2025-01-01T08:00:00'
    },
    {
        id: 6, agencia_id: 1, destino_id: 1, categoria_id: 2,
        nombre: 'Canotaje Extremo Río Mayo', descripcion: 'Aventura extrema en rápidos de categoría I, II y III en San Miguel del Río Mayo.',
        itinerario: JSON.stringify([
            {hora: "09:00", titulo: "Recojo", descripcion: "Turno Mañana (9 a 12 pm) o Tarde (3 a 6 pm). Viaje a San Miguel del Río Mayo."},
            {hora: "09:45", titulo: "Briefing", descripcion: "Charla de seguridad y entrega de equipo."},
            {hora: "10:00", titulo: "Canotaje", descripcion: "Inicio del canotaje con rápidos."},
            {hora: "11:00", titulo: "Floating", descripcion: "Descanso y actividad de floating en el agua."},
            {hora: "12:00", titulo: "Retorno", descripcion: "Baño refrescante y regreso a Tarapoto."}
        ]),
        duracion_horas: 3, cupo_maximo: 20, precio_nacional: 70.00, precio_extranjero: 70.00, estado: 'activo', destacado: 0,
        created_at: '2025-01-01T08:00:00'
    },
    {
        id: 7, agencia_id: 1, destino_id: 1, categoria_id: 7,
        nombre: 'City Tour Tarapoto', descripcion: 'Fábrica de chocolates Orquídea, Tabacalera y centro de rescate URKU.',
        itinerario: JSON.stringify([
            {hora: "09:00", titulo: "Recojo", descripcion: "Salida 9:00 am + 35 mins aprox."},
            {hora: "10:00", titulo: "Fábrica de Chocolates", descripcion: "Visita a La Orquídea, proceso y degustación."},
            {hora: "11:00", titulo: "Centro URKU", descripcion: "Rescate ecológico, conservación de flora y fauna."},
            {hora: "12:00", titulo: "Tabacalera del Oriente", descripcion: "Fábrica de puros artesanales."},
            {hora: "13:00", titulo: "Retorno", descripcion: "Retorno a su alojamiento."}
        ]),
        duracion_horas: 4, cupo_maximo: 20, precio_nacional: 80.00, precio_extranjero: 80.00, estado: 'activo', destacado: 0,
        created_at: '2025-01-01T08:00:00'
    },
    {
        id: 8, agencia_id: 1, destino_id: 3, categoria_id: 1,
        nombre: 'Tour Altomayo (Moyobamba - Rioja)', descripcion: 'Naciente del Tioyacu, Orquideario, Baños Termales San Mateo.',
        itinerario: JSON.stringify([
            {hora: "07:00", titulo: "Recojo", descripcion: "Recojo a partir de las 7:00 + 45 mins rumbo a Moyobamba."},
            {hora: "09:00", titulo: "Naciente TioYacu", descripcion: "Río cristalino para bañarse y tomar fotos."},
            {hora: "11:00", titulo: "Chacra Vieja", descripcion: "Museo y degustación de tragos exóticos regionales."},
            {hora: "13:00", titulo: "Almuerzo", descripcion: "Almuerzo a la carta en restaurante turístico."},
            {hora: "14:30", titulo: "Orquideario", descripcion: "Visita al orquideario de Moyobamba."},
            {hora: "16:00", titulo: "Baños Termales", descripcion: "Relajación en las aguas de San Mateo (38-40°)."},
            {hora: "19:00", titulo: "Retorno", descripcion: "Regreso a Tarapoto, 7:00 pm aprox."}
        ]),
        duracion_horas: 12, cupo_maximo: 20, precio_nacional: 120.00, precio_extranjero: 120.00, estado: 'activo', destacado: 1,
        created_at: '2025-01-01T08:00:00'
    },
    {
        id: 9, agencia_id: 1, destino_id: 3, categoria_id: 1,
        nombre: 'Tour Santa Elena y Las Cuevas', descripcion: 'Paseo en bote por aguajales de Santa Elena y recorrido de estalactitas en cuevas.',
        itinerario: JSON.stringify([
            {hora: "03:00", titulo: "Recojo Madrugada", descripcion: "Recojo 3:00 a 3:30 am con dirección a Rioja."},
            {hora: "06:00", titulo: "Aguajales Santa Helena", descripcion: "Paseo de 2 horas en bote observando especies animales."},
            {hora: "08:30", titulo: "Desayuno", descripcion: "Desayuno regional."},
            {hora: "09:30", titulo: "Las Cuevas", descripcion: "Recorrido de 1 hora 30 min observando estalactitas."},
            {hora: "13:00", titulo: "Almuerzo", descripcion: "Almuerzo regional."},
            {hora: "16:00", titulo: "Retorno", descripcion: "Llegada a Tarapoto, 4:00 pm aprox."}
        ]),
        duracion_horas: 13, cupo_maximo: 15, precio_nacional: 250.00, precio_extranjero: 250.00, estado: 'activo', destacado: 0,
        created_at: '2025-01-01T08:00:00'
    },
    {
        id: 10, agencia_id: 1, destino_id: 1, categoria_id: 5,
        nombre: 'Tours Carpishuyacu / Pishurayacu', descripcion: 'Cascadas ocultas, cruce en bote y baños termales de San José.',
        itinerario: JSON.stringify([
            {hora: "08:30", titulo: "Recojo", descripcion: "Recojo de su hotel a partir de las 8:30 - 9:00 am."},
            {hora: "09:45", titulo: "Caminata", descripcion: "Caminata de 45 minutos (Dificultad alta) en la selva virgen."},
            {hora: "10:30", titulo: "Cruce en Bote", descripcion: "Cruce de un pequeño río en bote artesanal."},
            {hora: "11:00", titulo: "Cascadas", descripcion: "Baño en Carpishuyacu y visita a Pishurayacu."},
            {hora: "13:00", titulo: "Baños Termales", descripcion: "Baño curativo en las termas de San José."},
            {hora: "14:30", titulo: "Almuerzo", descripcion: "Almuerzo regional en el caserío."},
            {hora: "16:00", titulo: "Retorno", descripcion: "Llegada a Tarapoto, 4:00 pm aprox."}
        ]),
        duracion_horas: 8, cupo_maximo: 15, precio_nacional: 100.00, precio_extranjero: 100.00, estado: 'activo', destacado: 0,
        created_at: '2025-01-01T08:00:00'
    },
    // PAQUETES
    {
        id: 11, agencia_id: 1, destino_id: 1, categoria_id: 11,
        nombre: 'Tarapoto Aventurero 4D/3N', descripcion: 'Paquete de 4 días incluyendo Lamas, Laguna Azul, Altomayo y Ahuashiyacu.',
        itinerario: JSON.stringify([
            {hora: "Día 1", titulo: "Lamas Nativa", descripcion: "Recojo aeropuerto. Tarde: Visita a Lamas (Plaza, Castillo, Wayku)."},
            {hora: "Día 2", titulo: "Laguna Azul", descripcion: "Full day en la Laguna Azul con paseo en bote y almuerzo."},
            {hora: "Día 3", titulo: "Altomayo", descripcion: "Moyobamba y Rioja (Tioyacu, Orquideario, Termales)."},
            {hora: "Día 4", titulo: "Ahuashiyacu", descripcion: "Mañana: Cataratas de Ahuashiyacu. Traslado al aeropuerto."}
        ]),
        duracion_horas: 72, cupo_maximo: 50, precio_nacional: 450.00, precio_extranjero: 450.00, estado: 'activo', destacado: 1,
        created_at: '2025-01-01T08:00:00'
    },
    {
        id: 12, agencia_id: 1, destino_id: 1, categoria_id: 11,
        nombre: 'Tarapoto Relax 3D/2N', descripcion: 'Relajate en Tarapoto visitando Lamas, Laguna Azul y las Cataratas de Ahuashiyacu.',
        itinerario: JSON.stringify([
            {hora: "Día 1", titulo: "Lamas Nativa", descripcion: "Recojo aeropuerto. Visita cultural a Lamas."},
            {hora: "Día 2", titulo: "Laguna Azul", descripcion: "Full day de relax en la bella Laguna Azul con paseo a caballo."},
            {hora: "Día 3", titulo: "Ahuashiyacu", descripcion: "Medio tiempo visitando las hermosas cataratas. Traslado al aeropuerto."}
        ]),
        duracion_horas: 48, cupo_maximo: 50, precio_nacional: 350.00, precio_extranjero: 350.00, estado: 'activo', destacado: 0,
        created_at: '2025-01-01T08:00:00'
    },
    {
        id: 13, agencia_id: 1, destino_id: 1, categoria_id: 11,
        nombre: 'Tarapoto Extremo 6D/5N', descripcion: 'El paquete más completo. Descubre todo San Martín: Lagunas, Cataratas y Rutas termales.',
        itinerario: JSON.stringify([
            {hora: "Día 1", titulo: "Lamas", descripcion: "Llegada y tour vespertino a la comunidad de Lamas."},
            {hora: "Día 2", titulo: "Laguna Azul", descripcion: "Paseo en bote y caballo en Sauce."},
            {hora: "Día 3", titulo: "Altomayo", descripcion: "Ruta norte: Moyobamba y Rioja."},
            {hora: "Día 4", titulo: "Carpishuyacu", descripcion: "Caminata exigente y recompensa en termas de San José."},
            {hora: "Día 5", titulo: "Salto de la Bruja", descripcion: "Aventura en múltiples caídas de agua en selva virgen."},
            {hora: "Día 6", titulo: "Ahuashiyacu", descripcion: "Despedida en las famosas cataratas y traslado al aeropuerto."}
        ]),
        duracion_horas: 120, cupo_maximo: 50, precio_nacional: 700.00, precio_extranjero: 700.00, estado: 'activo', destacado: 1,
        created_at: '2025-01-01T08:00:00'
    }
];

const tour_imagenes = [
    { id: 1, tour_id: 1, url: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Paisatge_de_Lamas%2C_San_Mart%C3%ADn03.jpg', es_principal: 1, orden: 0 },
    { id: 2, tour_id: 2, url: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Port_de_Sauce_a_la_Laguna_de_Sauce_a_la_prov%C3%ADncia_de_San_Mart%C3%ADn.jpg', es_principal: 1, orden: 0 },
    { id: 3, tour_id: 3, url: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Cataras_de_Ahuashiyacu.jpg', es_principal: 1, orden: 0 },
    { id: 4, tour_id: 4, url: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Tarapoto.jpg', es_principal: 1, orden: 0 },
    { id: 5, tour_id: 5, url: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Cataras_de_Ahuashiyacu.jpg', es_principal: 1, orden: 0 },
    { id: 6, tour_id: 6, url: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Valle_del_Alto_Mayo_en_Moyobamba.JPG', es_principal: 1, orden: 0 },
    { id: 7, tour_id: 7, url: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Tarapoto.jpg', es_principal: 1, orden: 0 },
    { id: 8, tour_id: 8, url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Andean_Cock_of_the_Rock%2C_Rupicola_peruviana_2.jpg', es_principal: 1, orden: 0 },
    { id: 9, tour_id: 9, url: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Valle_del_Alto_Mayo_en_Moyobamba.JPG', es_principal: 1, orden: 0 },
    { id: 10, tour_id: 10, url: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Cataras_de_Ahuashiyacu.jpg', es_principal: 1, orden: 0 },
    { id: 11, tour_id: 11, url: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Port_de_Sauce_a_la_Laguna_de_Sauce_a_la_prov%C3%ADncia_de_San_Mart%C3%ADn.jpg', es_principal: 1, orden: 0 },
    { id: 12, tour_id: 12, url: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Tarapoto.jpg', es_principal: 1, orden: 0 },
    { id: 13, tour_id: 13, url: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Cataras_de_Ahuashiyacu.jpg', es_principal: 1, orden: 0 }
];

const restriccionGlobal = 'CUPOS LIMITADOS, validar disponibilidad. Niños a partir de 5 años pagan tarifa normal. El Itinerario puede variar a criterio del operador para garantizar seguridad. Niños menores de 4 años excluyen pago y quedan bajo responsabilidad de los padres.';

const tour_contenido = {
    1: { incluye: ['Recojo de su hotel', 'Transporte ida y vuelta', 'Orientador turístico', 'Entradas al Castillo Lamas', 'Visita Plaza de Armas', 'Visita Comunidad Nativa Wayku'], no_incluye: ['Entrada al Museo de Lamas', 'Alimentación'], recomendaciones: ['Llevar bloqueador, repelente', 'Respetar la naturaleza'], restricciones: restriccionGlobal },
    2: { incluye: ['Recojo de su hotel', 'Transporte ida y vuelta', 'Orientador turístico', 'Degustación de tragos exóticos', 'Paseo en bote', 'Paseo a Caballo', 'Almuerzo a la carta'], no_incluye: ['Derecho de ingreso a la laguna S/ 4.00 (Obligatorio)', 'Actividades opcionales (Moto acuática, Kayak, Canopy, Baños de barro)'], recomendaciones: ['Ropa cómoda y bañador', 'Protector solar y repelente'], restricciones: restriccionGlobal },
    3: { incluye: ['Recojo de su hotel', 'Transporte', 'Orientador turístico', 'Entrada a la Reserva Natural'], no_incluye: ['Alimentación', 'Gastos personales'], recomendaciones: ['Ropa cómoda y bañador', 'Protector solar y repelente'], restricciones: restriccionGlobal },
    4: { incluye: ['Recojo de hotel', 'Transporte', 'Entradas al mirador Taytamaki', 'Foto profesional en la figura de la mano'], no_incluye: ['Deportes de aventura dentro del mirador'], recomendaciones: ['Llevar bloqueador y repelente'], restricciones: restriccionGlobal },
    5: { incluye: ['Recojo de hotel', 'Transporte', 'Orientador', 'Entrada a Cascadas Salto de la Bruja', 'Almuerzo regional'], no_incluye: ['Gastos personales'], recomendaciones: ['Zapatillas para caminata', 'Ropa cómoda y bañador', 'Ser cuidadosos en escaleras'], restricciones: restriccionGlobal },
    6: { incluye: ['Recojo de hotel', 'Transporte', 'Actividad de floating', 'Equipo de seguridad', 'Orientador turístico'], no_incluye: ['Alimentación'], recomendaciones: ['Bloqueador y repelente', 'Ropa cómoda y bañador'], restricciones: restriccionGlobal },
    7: { incluye: ['Recojo de hotel', 'Transporte', 'Entrada fábrica de chocolates Orquídea', 'Entrada Tabacalera del Oriente', 'Entrada centro de rescate URKU'], no_incluye: ['Alimentación'], recomendaciones: ['Bloqueador, gorro y mangas'], restricciones: restriccionGlobal },
    8: { incluye: ['Recojo de hotel', 'Transporte', 'Orientador', 'Degustación de café', 'Ingreso al Orquideario', 'Ingreso a Tioyacu', 'Ingreso a Termas San Mateo', 'Almuerzo a la carta'], no_incluye: ['Gastos personales'], recomendaciones: ['Ropa cómoda y bañador', 'Protector solar y repelente'], restricciones: restriccionGlobal },
    9: { incluye: ['Recojo de hotel', 'Transporte', 'Orientador', 'Entradas a Reserva Santa Elena', 'Entrada a las cuevas', 'Desayuno regional', 'Almuerzo regional'], no_incluye: ['Gastos personales'], recomendaciones: ['Ropa cómoda', 'Repelente', 'Ser cuidadosos en las cuevas'], restricciones: restriccionGlobal },
    10: { incluye: ['Recojo de hotel', 'Transporte', 'Orientador', 'Entrada Cascadas Carpishuyacu/Pishurayacu', 'Baños termales San José', 'Almuerzo regional'], no_incluye: ['Gastos extras'], recomendaciones: ['Zapatillas de trekking', 'Bañador y repelente'], restricciones: restriccionGlobal },
    11: { incluye: ['Recojo y traslado aeropuerto', '4D/3N Alojamiento', 'Desayunos', 'Almuerzos en Laguna Azul y Altomayo', 'Entradas y guías a Lamas, Laguna Azul, Altomayo, Ahuashiyacu'], no_incluye: ['Cenas', 'Pasajes terrestres/aereos', 'Retorno Sauce-Tarapoto si hotel es en Sauce'], recomendaciones: ['Consultar disponibilidad'], restricciones: 'Sujeto a mín 2 personas. No válido feriados. ' + restriccionGlobal },
    12: { incluye: ['Recojo y traslado aeropuerto', '3D/2N Alojamiento', 'Desayunos', 'Almuerzo en Laguna Azul', 'Tours Lamas, Laguna Azul, Ahuashiyacu'], no_incluye: ['Cenas', 'Pasajes', 'Traslado Sauce si hotel allá'], recomendaciones: ['Consultar'], restricciones: 'Mín 2 personas. ' + restriccionGlobal },
    13: { incluye: ['Recojo y traslado aeropuerto', '6D/5N Alojamiento', 'Desayunos', 'Almuerzos en Laguna Azul, Altomayo, Carpishuyacu, Salto de la Bruja', 'Tours programados'], no_incluye: ['Cenas', 'Pasajes'], recomendaciones: ['Consultar'], restricciones: 'Mín 2 personas. ' + restriccionGlobal }
};

let rawData = fs.readFileSync('C:/xampp/htdocs/turitours/public/js/data.js', 'utf8');

const toursRegex = /tours:\s*\[[\s\S]*?\]\s*,/;
rawData = rawData.replace(toursRegex, 'tours: ' + JSON.stringify(tours, null, 8) + ',');

const imgRegex = /tour_imagenes:\s*\[[\s\S]*?\]\s*,/;
rawData = rawData.replace(imgRegex, 'tour_imagenes: ' + JSON.stringify(tour_imagenes, null, 8) + ',');

const contRegex = /tour_contenido:\s*\{[\s\S]*?\}\s*,/;
rawData = rawData.replace(contRegex, 'tour_contenido: ' + JSON.stringify(tour_contenido, null, 8) + ',');

fs.writeFileSync('C:/xampp/htdocs/turitours/public/js/data.js', rawData, 'utf8');
console.log('Reemplazo exitoso en data.js');
