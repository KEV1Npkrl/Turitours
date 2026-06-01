/**
 * Detalle de tour — RF-C02, RF-C03, RF-C04
 */
let currentTour = null;
let cotizacion = null;
let cuponAplicado = null;
let bloqueoActivo = null;
let bloqueoTimer = null;

document.addEventListener('DOMContentLoaded', initTourDetallePage);

async function initTourDetallePage() {
    const tourContent = document.getElementById('tourContent');
    if (!tourContent) return;

    const urlParams = new URLSearchParams(window.location.search);
    const tourId = urlParams.get('id');
    if (!tourId) {
        tourContent.innerHTML = errorBox('No se especifico un tour.');
        return;
    }
    await loadTourDetalle(tourId);
}

async function loadTourDetalle(tourId) {
    const tourContent = document.getElementById('tourContent');
    const breadcrumbTour = document.getElementById('breadcrumbTour');

    try {
        currentTour = await API.getTourById(tourId);
        if (breadcrumbTour) breadcrumbTour.textContent = currentTour.nombre;
        document.title = currentTour.nombre + ' - Turi Tours';

        const resenas = await API.getResenasTour(tourId);
        renderTourDetalle(currentTour, resenas, tourContent);
        setupBookingForm();
        setupPaymentModal();
        restorePendingBooking();
        applyFechaFromUrl();
    } catch (error) {
        console.error(error);
        tourContent.innerHTML = errorBox('Error al cargar el tour.');
    }
}

function errorBox(msg) {
    return '<div style="text-align:center;padding:3rem;"><p style="color:var(--destructive);">' + msg +
        '</p><a href="tours.html" class="btn btn-primary" style="margin-top:1rem;">Ver tours</a></div>';
}

function renderTourDetalle(tour, resenas, container) {
    container.innerHTML = `
        <div class="tour-detail">
            <div class="tour-main">
                <div class="tour-carousel-wrapper" style="position:relative; width:100%; height:450px; border-radius:12px; overflow:hidden; background:#1a1a1a; margin-bottom:1.5rem;">
                    <div id="carouselTrack" style="display:flex; transition:transform 0.4s ease-in-out; height:100%; width:${tour.imagenes.length * 100}%;">
                        ${tour.imagenes.map(img => `
                            <div style="flex:0 0 ${100 / tour.imagenes.length}%; height:100%;">
                                <img src="${img.url}" style="width:100%; height:100%; object-fit:cover;" alt="${tour.nombre}">
                            </div>
                        `).join('')}
                    </div>
                    ${tour.imagenes.length > 1 ? `
                        <button onclick="moveCarousel(-1)" style="position:absolute; top:50%; left:10px; transform:translateY(-50%); background:rgba(0,0,0,0.6); color:#fff; border:none; width:44px; height:44px; border-radius:50%; cursor:pointer; font-size:24px; display:flex; align-items:center; justify-content:center; transition:background 0.2s; z-index:10;">&#10094;</button>
                        <button onclick="moveCarousel(1)" style="position:absolute; top:50%; right:10px; transform:translateY(-50%); background:rgba(0,0,0,0.6); color:#fff; border:none; width:44px; height:44px; border-radius:50%; cursor:pointer; font-size:24px; display:flex; align-items:center; justify-content:center; transition:background 0.2s; z-index:10;">&#10095;</button>
                        <div style="position:absolute; bottom:15px; left:0; width:100%; text-align:center; z-index:10;">
                            ${tour.imagenes.map((_, i) => `<span id="dot-${i}" style="display:inline-block; width:10px; height:10px; background:${i===0?'#fff':'rgba(255,255,255,0.4)'}; border-radius:50%; margin:0 5px; transition:background 0.3s; cursor:pointer;" onclick="goToSlide(${i})"></span>`).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="tour-header">
                    <span class="tour-category">${tour.categoria_nombre}</span>
                    <h1 class="tour-title">${tour.nombre}</h1>
                    <div class="tour-header-meta">
                        <div class="meta-item"><strong>${tour.rating}</strong> (${tour.reviews_count} opiniones)</div>
                        <div class="meta-item">${tour.ubicacion}</div>
                        <div class="meta-item">${tour.duracion}</div>
                        <div class="meta-item">Max. ${tour.capacidad_maxima} personas</div>
                    </div>
                </div>
                <div class="tour-description"><h3>Descripcion</h3><p>${tour.descripcion}</p></div>
                <div class="tour-itinerary">
                    <h3>Itinerario</h3>
                    <div class="itinerary-list">
                        ${(tour.itinerario_detalle || []).map(function(item, index) {
                            return '<div class="itinerary-item"><div class="itinerary-number">' + (index + 1) +
                                '</div><div class="itinerary-content"><h4>' + item.hora + ' - ' + item.titulo +
                                '</h4><p>' + item.descripcion + '</p></div></div>';
                        }).join('')}
                    </div>
                </div>
                <div class="tour-includes">
                    <h3>El tour incluye</h3>
                    <div class="includes-grid">${tour.incluye.map(function(item) {
                        return '<div class="include-item">' + item + '</div>';
                    }).join('')}</div>
                </div>
                <div class="tour-reviews" id="tourReviews">
                    <h3>Opiniones de viajeros</h3>
                    ${resenas.length ? resenas.map(renderResenaItem).join('') :
                        '<p class="reviews-empty">Aun no hay reseñas publicas para este tour.</p>'}
                </div>
            </div>
            <aside>
                <div class="booking-card">
                    <div class="booking-price">
                        <span class="booking-price-label">Cotizador en linea</span>
                        <div class="booking-price-value" id="precioUnitarioDisplay">S/ ${tour.precio_nacional.toFixed(2)} <span>/ persona</span></div>
                        <p class="booking-temporada" id="temporadaLabel"></p>
                        <div class="cupos-badge" id="cuposBadge">Selecciona una fecha para ver cupos</div>
                    </div>
                    <form class="booking-form" id="bookingForm" novalidate>
                        <div class="form-group">
                            <label for="tipoTurista">Tipo de turista</label>
                            <select id="tipoTurista" name="tipo_turista" class="form-select" required>
                                <option value="nacional">Nacional</option>
                                <option value="extranjero">Extranjero</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="bookingDate">Fecha del tour <span class="label-required">*</span></label>
                            <input type="date" id="bookingDate" name="fecha" class="form-input" required min="${getTomorrowDate()}">
                        </div>
                        <div class="form-group">
                            <label for="bookingPersonas">Numero de personas</label>
                            <select id="bookingPersonas" name="personas" class="form-select" required></select>
                        </div>
                        <div class="form-group">
                            <label for="horaRecojo">Hora de recojo</label>
                            <input type="time" id="horaRecojo" name="hora_recojo" class="form-input" value="08:00">
                        </div>
                        <div class="form-group">
                            <label for="lugarRecojo">Lugar de recojo</label>
                            <input type="text" id="lugarRecojo" name="lugar_recojo" class="form-input" placeholder="Ej. Hotel, direccion...">
                        </div>
                        <div class="form-group">
                            <label for="codigoCupon">Codigo de cupon</label>
                            <div class="cupon-row">
                                <input type="text" id="codigoCupon" class="form-input" placeholder="Ej. TARAPOTO10">
                                <button type="button" class="btn btn-outline btn-sm" id="btnAplicarCupon">Aplicar</button>
                            </div>
                            <span class="field-hint" id="cuponHint"></span>
                        </div>
                        <div class="cotizador-breakdown" id="cotizadorBreakdown">
                            <div class="cotizador-row"><span>Subtotal</span><span id="cotSubtotal">—</span></div>
                            <div class="cotizador-row cotizador-desc hidden" id="cotDescRow"><span>Descuento</span><span id="cotDescuento">—</span></div>
                            <div class="cotizador-row cotizador-total"><span>Total</span><span id="cotTotal">—</span></div>
                        </div>
                        <button type="submit" class="btn btn-primary btn-lg btn-block" id="btnContinuarPago">Continuar al pago</button>
                    </form>
                    <p class="booking-note">Al continuar se bloqueara tu cupo por unos minutos mientras pagas.</p>
                </div>
            </aside>
        </div>
    `;

      const personasSelect = document.getElementById('bookingPersonas');
      for (let n = 1; n <= tour.capacidad_maxima; n++) {
          const opt = document.createElement('option');
          opt.value = n;
          opt.textContent = n + ' persona' + (n > 1 ? 's' : '');
          personasSelect.appendChild(opt);
      }

      totalCarouselItems = tour.imagenes.length;
      currentCarouselIndex = 0;
  }

function renderResenaItem(r) {
    const stars = '★'.repeat(r.calificacion) + '☆'.repeat(5 - r.calificacion);
    return '<article class="review-item"><div class="review-stars" aria-label="' + r.calificacion + ' de 5">' + stars +
        '</div><p class="review-author">' + escapeHtml(r.autor || 'Turista') + '</p><p>' + escapeHtml(r.comentario) + '</p></article>';
}

function setupBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form || !currentTour) return;

    ['tipoTurista', 'bookingDate', 'bookingPersonas'].forEach(function(id) {
        document.getElementById(id).addEventListener('change', refreshCotizador);
    });

    document.getElementById('btnAplicarCupon').addEventListener('click', aplicarCupon);
    document.getElementById('bookingDate').addEventListener('change', refreshCotizador);

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (!cotizacion || !cotizacion.fecha) {
            mostrarAlerta('Selecciona una fecha valida', 'warning');
            return;
        }
        if (cotizacion.cupos_disponibles < cotizacion.personas) {
            mostrarAlerta('No hay cupos suficientes', 'error');
            return;
        }
        if (!API.isAuthenticated()) {
            if (confirm('Necesitas iniciar sesion para reservar. ¿Ir al login?')) {
                localStorage.setItem('pendingBooking', JSON.stringify(getBookingPayload()));
                window.location.href = 'login.html?redirect=tour-detalle.html?id=' + currentTour.id;
            }
            return;
        }
        try {
            bloqueoActivo = await API.bloquearCupo({
                tour_id: currentTour.id,
                fecha_servicio: cotizacion.fecha,
                num_personas: cotizacion.personas
            });
            openPaymentModal();
        } catch (error) {
            mostrarAlerta(error.message || 'No se pudo bloquear el cupo', 'error');
        }
    });

    refreshCotizador();
}

async function refreshCotizador() {
    const fecha = document.getElementById('bookingDate').value;
    const personas = parseInt(document.getElementById('bookingPersonas').value, 10) || 1;
    const tipo = document.getElementById('tipoTurista').value;
    const cuposBadge = document.getElementById('cuposBadge');
    const precioDisplay = document.getElementById('precioUnitarioDisplay');
    const temporadaLabel = document.getElementById('temporadaLabel');

    if (!fecha) {
        const basePrecio = tipo === 'extranjero' ? currentTour.precio_extranjero : currentTour.precio_nacional;
        precioDisplay.innerHTML = 'S/ ' + basePrecio.toFixed(2) + ' <span>/ persona</span>';
        cuposBadge.textContent = 'Selecciona una fecha para ver cupos';
        cuposBadge.className = 'cupos-badge';
        return;
    }

    try {
        const disp = await API.getDisponibilidad(currentTour.id, fecha, bloqueoActivo ? bloqueoActivo.bloqueo_id : null);
        const precioUnit = tipo === 'extranjero' ? disp.precios.precio_extranjero : disp.precios.precio_nacional;
        const subtotal = precioUnit * personas;
        let descuento = cuponAplicado ? cuponAplicado.descuento : 0;
        if (cuponAplicado && cuponAplicado._subtotal !== subtotal) {
            cuponAplicado = null;
            document.getElementById('cuponHint').textContent = '';
            descuento = 0;
        }
        const total = Math.max(0, subtotal - descuento);

        cotizacion = {
            fecha, personas, tipo, precioUnit, subtotal, descuento, total,
            cupos_disponibles: disp.cupos_disponibles,
            cupo_maximo: disp.cupo_maximo,
            temporada: disp.precios.temporada || null
        };

        precioDisplay.innerHTML = 'S/ ' + precioUnit.toFixed(2) + ' <span>/ persona</span>';
        temporadaLabel.textContent = cotizacion.temporada ? 'Temporada: ' + cotizacion.temporada : '';
        cuposBadge.textContent = disp.cupos_disponibles + ' de ' + disp.cupo_maximo + ' cupos disponibles';
        cuposBadge.className = 'cupos-badge ' + (disp.cupos_disponibles >= personas ? 'cupos-ok' : 'cupos-low');

        document.getElementById('cotSubtotal').textContent = 'S/ ' + subtotal.toFixed(2);
        document.getElementById('cotTotal').textContent = 'S/ ' + total.toFixed(2);
        const descRow = document.getElementById('cotDescRow');
        if (descuento > 0) {
            descRow.classList.remove('hidden');
            document.getElementById('cotDescuento').textContent = '- S/ ' + descuento.toFixed(2);
        } else {
            descRow.classList.add('hidden');
        }

        const personasSelect = document.getElementById('bookingPersonas');
        Array.from(personasSelect.options).forEach(function(opt) {
            opt.disabled = parseInt(opt.value, 10) > disp.cupos_disponibles;
        });
    } catch (error) {
        cuposBadge.textContent = 'Error al consultar disponibilidad';
        cuposBadge.className = 'cupos-badge cupos-low';
    }
}

async function aplicarCupon() {
    const codigo = document.getElementById('codigoCupon').value.trim();
    const hint = document.getElementById('cuponHint');
    if (!cotizacion || !codigo) return;
    try {
        const result = await API.validarCupon(codigo, cotizacion.subtotal);
        cuponAplicado = Object.assign({}, result, { _subtotal: cotizacion.subtotal });
        hint.textContent = result.descripcion + ' (-S/ ' + result.descuento.toFixed(2) + ')';
        hint.style.color = 'var(--primary)';
        refreshCotizador();
    } catch (error) {
        cuponAplicado = null;
        hint.textContent = error.message;
        hint.style.color = '#dc2626';
        refreshCotizador();
    }
}

function getBookingPayload() {
    return {
        tourId: currentTour.id,
        fecha: document.getElementById('bookingDate').value,
        personas: parseInt(document.getElementById('bookingPersonas').value, 10),
        tipo_turista: document.getElementById('tipoTurista').value,
        hora_recojo: document.getElementById('horaRecojo').value,
        lugar_recojo: document.getElementById('lugarRecojo').value,
        codigo_cupon: cuponAplicado ? cuponAplicado.codigo : document.getElementById('codigoCupon').value.trim()
    };
}

function restorePendingBooking() {
    const raw = localStorage.getItem('pendingBooking');
    if (!raw) return;
    try {
        const data = JSON.parse(raw);
        if (String(data.tourId) !== String(currentTour.id)) return;
        if (data.fecha) document.getElementById('bookingDate').value = data.fecha;
        if (data.personas) document.getElementById('bookingPersonas').value = data.personas;
        if (data.tipo_turista) document.getElementById('tipoTurista').value = data.tipo_turista;
        if (data.hora_recojo) document.getElementById('horaRecojo').value = data.hora_recojo;
        if (data.lugar_recojo) document.getElementById('lugarRecojo').value = data.lugar_recojo;
        if (data.codigo_cupon) document.getElementById('codigoCupon').value = data.codigo_cupon;
        localStorage.removeItem('pendingBooking');
        refreshCotizador();
    } catch (_) { /* ignore */ }
}

function applyFechaFromUrl() {
    const fecha = new URLSearchParams(window.location.search).get('fecha');
    const input = document.getElementById('bookingDate');
    if (fecha && input && !input.value) {
        input.value = fecha;
        refreshCotizador();
    }
}

function setupPaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (!modal) return;
    modal.querySelectorAll('[data-close-payment]').forEach(function(el) {
        el.addEventListener('click', closePaymentModal);
    });
}

function openPaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (!modal || !cotizacion || !bloqueoActivo) return;

    const adelanto = Math.round(cotizacion.total * 0.5 * 100) / 100;
    document.getElementById('paymentSummary').innerHTML =
        '<p><strong>' + currentTour.nombre + '</strong></p>' +
        '<p>Fecha: ' + cotizacion.fecha + ' · ' + cotizacion.personas + ' persona(s)</p>' +
        '<p>Total: <strong>S/ ' + cotizacion.total.toFixed(2) + '</strong></p>' +
        '<p>Adelanto 50%: S/ ' + adelanto.toFixed(2) + '</p>';

    document.getElementById('paymentTimer').textContent = bloqueoActivo.minutos_bloqueo + ':00';
    startBloqueoTimer(bloqueoActivo.expira_at);

    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    document.getElementById('btnPagoAdelanto').onclick = function() { procesarPago('adelanto', adelanto); };
    document.getElementById('btnPagoCompleto').onclick = function() { procesarPago('completo', cotizacion.total); };
}

function startBloqueoTimer(expiraAt) {
    clearInterval(bloqueoTimer);
    const timerEl = document.getElementById('paymentTimer');
    bloqueoTimer = setInterval(function() {
        const diff = new Date(expiraAt).getTime() - Date.now();
        if (diff <= 0) {
            clearInterval(bloqueoTimer);
            timerEl.textContent = '0:00';
            mostrarAlerta('El tiempo de bloqueo expiro', 'warning');
            closePaymentModal(true);
            refreshCotizador();
            return;
        }
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        timerEl.textContent = m + ':' + String(s).padStart(2, '0');
    }, 1000);
}

async function closePaymentModal(expired) {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.hidden = true;
        document.body.style.overflow = '';
    }
    clearInterval(bloqueoTimer);
    if (!expired && bloqueoActivo) {
        await API.liberarBloqueo(bloqueoActivo.bloqueo_id);
    }
    bloqueoActivo = null;
}

async function procesarPago(tipo, monto) {
    if (!bloqueoActivo || !cotizacion) return;
    const btnA = document.getElementById('btnPagoAdelanto');
    const btnC = document.getElementById('btnPagoCompleto');
    btnA.disabled = true;
    btnC.disabled = true;

    try {
        const payload = getBookingPayload();
        const resultado = await API.crearReserva({
            tour_id: currentTour.id,
            fecha_servicio: payload.fecha,
            num_personas: payload.personas,
            tipo_turista: payload.tipo_turista,
            hora_recojo: payload.hora_recojo ? payload.hora_recojo + ':00' : '08:00:00',
            lugar_recojo: payload.lugar_recojo || null,
            codigo_cupon: cuponAplicado ? cuponAplicado.codigo : (payload.codigo_cupon || null),
            cupon_id: cuponAplicado ? cuponAplicado.cupon_id : null,
            descuento: cotizacion.descuento,
            bloqueo_id: bloqueoActivo.bloqueo_id,
            tipo_pago: tipo,
            monto_adelanto: monto
        });
        bloqueoActivo = null;
        clearInterval(bloqueoTimer);
        mostrarAlerta('Pago simulado correctamente. Reserva creada.', 'success');
        window.location.href = 'mis-reservas.html?id=' + resultado.reserva.id;
    } catch (error) {
        mostrarAlerta(error.message || 'Error al procesar el pago', 'error');
        btnA.disabled = false;
        btnC.disabled = false;
    }
}

function changeMainImage(src) {
    const img = document.getElementById('mainImage');
    if (img) img.src = src;
}

function getTomorrowDate() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

window.changeMainImage = changeMainImage;

let currentCarouselIndex = 0;
let totalCarouselItems = 0;

function moveCarousel(direction) {
    if(totalCarouselItems <= 1) return;
    currentCarouselIndex += direction;
    if(currentCarouselIndex < 0) currentCarouselIndex = totalCarouselItems - 1;
    if(currentCarouselIndex >= totalCarouselItems) currentCarouselIndex = 0;
    updateCarouselUI();
}

function goToSlide(index) {
    currentCarouselIndex = index;
    updateCarouselUI();
}

function updateCarouselUI() {
    const track = document.getElementById('carouselTrack');
    if(track) {
        track.style.transform = `translateX(-${currentCarouselIndex * (100 / totalCarouselItems)}%)`;
    }
    for(let i=0; i<totalCarouselItems; i++) {
        const dot = document.getElementById('dot-' + i);
        if(dot) {
            dot.style.background = i === currentCarouselIndex ? '#fff' : 'rgba(255,255,255,0.4)';
        }
    }
}

window.moveCarousel = moveCarousel;
window.goToSlide = goToSlide;
