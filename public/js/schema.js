/**
 * Capa de esquema — alineada con database/bd_turismo_tarapoto.sql
 * Convierte filas de BD (mock o futuro Java/MySQL) a objetos listos para la UI.
 */
const Schema = (function() {
    const CATEGORIA_ICONOS = {
        'Full Day': 'sun',
        'Pernocte': 'moon',
        'Aventura': 'adventure',
        'Relax': 'spa',
        'Cascadas': 'waterfall',
        'Lagunas': 'lake',
        'Cultural': 'cultural',
        'Naturaleza': 'nature'
    };

    const DESTINO_MEDIA = {
        1: { imagen: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80', bandera: '🇵🇪' },
        2: { imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', bandera: '🇵🇪' },
        3: { imagen: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80', bandera: '🇵🇪' },
        4: { imagen: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80', bandera: '🇵🇪' },
        5: { imagen: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&q=80', bandera: '🇵🇪' }
    };

    function parseItinerario(itinerario) {
        if (!itinerario) return [];
        if (Array.isArray(itinerario)) return itinerario;
        try {
            const parsed = JSON.parse(itinerario);
            return Array.isArray(parsed) ? parsed : [];
        } catch (_) {
            return itinerario.split('|').map(function(line, index) {
                const parts = line.split(' - ');
                return {
                    hora: parts[0] || String(8 + index) + ':00',
                    titulo: parts[1] || 'Actividad ' + (index + 1),
                    descripcion: parts.slice(2).join(' - ') || line
                };
            });
        }
    }

    function formatDuracion(horas) {
        if (horas >= 24) {
            const dias = Math.round(horas / 24);
            return dias + ' dia' + (dias > 1 ? 's' : '');
        }
        return horas + ' hora' + (horas > 1 ? 's' : '');
    }

    function getImagenesTour(tourId, db) {
        return db.tour_imagenes
            .filter(function(img) { return img.tour_id === tourId; })
            .sort(function(a, b) { return a.orden - b.orden; });
    }

    function getResenasTour(tourId, db) {
        return db.resenas.filter(function(r) {
            return r.tour_id === tourId && r.visible === 1;
        });
    }

    function calcularRating(reseñas) {
        if (!reseñas.length) return { rating: 0, total_resenas: 0 };
        const suma = reseñas.reduce(function(acc, r) { return acc + r.calificacion; }, 0);
        return {
            rating: Math.round((suma / reseñas.length) * 10) / 10,
            total_resenas: reseñas.length
        };
    }

    function countToursPorDestino(destinoId, db) {
        return db.tours.filter(function(t) {
            return t.destino_id === destinoId && t.estado === 'activo';
        }).length;
    }

    function getCupoDisponible(tourId, fecha, db, excludeBloqueoId) {
        const tour = db.tours.find(function(t) { return t.id === tourId; });
        if (!tour) return 0;
        const ocupados = db.reservas
            .filter(function(r) {
                return r.tour_id === tourId &&
                    r.fecha_servicio === fecha &&
                    r.estado !== 'anulada';
            })
            .reduce(function(acc, r) { return acc + r.num_personas; }, 0);
        const now = Date.now();
        const bloqueados = (db.bloqueos_cupo || []).filter(function(b) {
            if (b.tour_id !== tourId || b.fecha_servicio !== fecha) return false;
            if (excludeBloqueoId && b.id === excludeBloqueoId) return false;
            return new Date(b.expira_at).getTime() > now;
        }).reduce(function(acc, b) { return acc + b.num_personas; }, 0);
        return Math.max(0, tour.cupo_maximo - ocupados - bloqueados);
    }

    function getPrecioTour(tour, fecha, db) {
        if (!fecha) {
            return {
                precio_nacional: tour.precio_nacional,
                precio_extranjero: tour.precio_extranjero
            };
        }
        const temporada = db.temporadas.find(function(t) {
            return t.tour_id === tour.id &&
                fecha >= t.fecha_inicio &&
                fecha <= t.fecha_fin;
        });
        if (temporada) {
            return {
                precio_nacional: temporada.precio_nacional,
                precio_extranjero: temporada.precio_extranjero,
                temporada: temporada.nombre
            };
        }
        return {
            precio_nacional: tour.precio_nacional,
            precio_extranjero: tour.precio_extranjero
        };
    }

    function enrichCategoria(categoria) {
        return Object.assign({}, categoria, {
            icono: CATEGORIA_ICONOS[categoria.nombre] || 'nature'
        });
    }

    function enrichDestino(destino, db) {
        const media = DESTINO_MEDIA[destino.id] || {
            imagen: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
            bandera: '🇵🇪'
        };
        return Object.assign({}, destino, media, {
            tours_count: countToursPorDestino(destino.id, db)
        });
    }

    function enrichTour(tour, db, options) {
        options = options || {};
        const destino = db.destinos.find(function(d) { return d.id === tour.destino_id; });
        const categoria = db.categorias_tour.find(function(c) { return c.id === tour.categoria_id; });
        const imagenes = getImagenesTour(tour.id, db);
        const reseñas = getResenasTour(tour.id, db);
        const stats = calcularRating(reseñas);
        const contenido = db.tour_contenido[tour.id] || { incluye: [], no_incluye: [] };
        const precios = getPrecioTour(tour, options.fecha, db);
        const imagenPrincipal = imagenes.find(function(i) { return i.es_principal === 1; }) || imagenes[0];

        return Object.assign({}, tour, precios, stats, {
            destino: destino || null,
            categoria: categoria ? enrichCategoria(categoria) : null,
            imagenes: imagenes,
            imagen_principal: imagenPrincipal ? imagenPrincipal.url : '',
            itinerario_detalle: parseItinerario(tour.itinerario),
            incluye: contenido.incluye || [],
            no_incluye: contenido.no_incluye || [],
            duracion_texto: formatDuracion(tour.duracion_horas),
            ubicacion: destino ? destino.nombre + ', San Martin' : 'San Martin',
            categoria_nombre: categoria ? categoria.nombre : '',
            destacado: stats.rating >= 4.8 || stats.total_resenas >= 100,
            cupos_disponibles: options.fecha ? getCupoDisponible(tour.id, options.fecha, db) : tour.cupo_maximo,
            // Alias legacy para componentes UI existentes
            id_tour: tour.id,
            precio: precios.precio_nacional,
            capacidad_maxima: tour.cupo_maximo,
            reviews_count: stats.total_resenas,
            duracion: formatDuracion(tour.duracion_horas)
        });
    }

    function enrichTurista(turista, db) {
        let pais = null;
        if (typeof PAISES_CATALOGO !== 'undefined' && PAISES_CATALOGO.length) {
            pais = PAISES_CATALOGO.find(function(p) { return p.id === turista.pais_id; });
        }
        if (!pais && db && db.paises) {
            pais = db.paises.find(function(p) { return p.id === turista.pais_id; });
        }
        return Object.assign({}, turista, {
            pais_nombre: pais ? pais.nombre : null,
            pais_codigo_iso: pais ? pais.codigo_iso : null,
            nombre_completo: turista.nombre + ' ' + turista.apellidos
        });
    }

    function enrichReserva(reserva, db) {
        const tour = db.tours.find(function(t) { return t.id === reserva.tour_id; });
        const tieneResena = (db.resenas || []).some(function(r) {
            return r.reserva_id === reserva.id && r.turista_id === reserva.turista_id;
        });
        return Object.assign({}, reserva, {
            tour: tour ? enrichTour(tour, db) : null,
            tiene_resena: tieneResena
        });
    }

    function generarCodigoQr() {
        return 'QR-TPT-' + Date.now().toString(36).toUpperCase();
    }

    return {
        AGENCIA_DEFAULT_ID: 1,
        parseItinerario: parseItinerario,
        formatDuracion: formatDuracion,
        getCupoDisponible: getCupoDisponible,
        getPrecioTour: getPrecioTour,
        enrichCategoria: enrichCategoria,
        enrichDestino: enrichDestino,
        enrichTour: enrichTour,
        enrichTurista: enrichTurista,
        enrichReserva: enrichReserva,
        generarCodigoQr: generarCodigoQr
    };
})();

if (typeof window !== 'undefined') {
    window.Schema = Schema;
}
