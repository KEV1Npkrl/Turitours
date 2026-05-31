/**
 * ========================================
 * TOUR DETALLE PAGE - Tarapoto Tours
 * ========================================
 */

let currentTour = null;

document.addEventListener('DOMContentLoaded', function() {
    initTourDetallePage();
});

async function initTourDetallePage() {
    const tourContent = document.getElementById('tourContent');
    if (!tourContent) return;
    
    // Obtener ID del tour de la URL o de la ruta dinámica
    const urlParams = new URLSearchParams(window.location.search);
    const pathnameParts = window.location.pathname.split('/').filter(Boolean);
    const tourId = urlParams.get('id') || pathnameParts[pathnameParts.length - 1];
    
    if (!tourId) {
        tourContent.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <p style="color: var(--destructive);">No se especificó un tour.</p>
                <a href="tours.html" class="btn btn-primary" style="margin-top: 1rem;">Ver todos los tours</a>
            </div>
        `;
        return;
    }
    
    await loadTourDetalle(tourId);
}

async function loadTourDetalle(tourId) {
    const tourContent = document.getElementById('tourContent');
    const breadcrumbTour = document.getElementById('breadcrumbTour');
    
    try {
        currentTour = await API.getTourById(tourId);
        
        // Actualizar breadcrumb
        if (breadcrumbTour) {
            breadcrumbTour.textContent = currentTour.nombre;
        }
        
        // Actualizar título de la página
        document.title = `${currentTour.nombre} - Tarapoto Tours`;
        
        // Renderizar contenido
        renderTourDetalle(currentTour, tourContent);
        
        // Configurar formulario de reserva
        setupBookingForm();
        
    } catch (error) {
        console.error('Error cargando tour:', error);
        tourContent.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <p style="color: var(--destructive);">Error al cargar el tour. Por favor, intenta de nuevo.</p>
                <a href="tours.html" class="btn btn-primary" style="margin-top: 1rem;">Ver todos los tours</a>
            </div>
        `;
    }
}

function renderTourDetalle(tour, container) {
    container.innerHTML = `
        <div class="tour-detail">
            <div class="tour-main">
                <!-- Galería -->
                <div class="tour-gallery">
                    <div class="gallery-main">
                        <img src="${tour.imagenes[0]}" alt="${tour.nombre}" id="mainImage">
                    </div>
                    ${tour.imagenes.slice(1, 3).map((img, i) => `
                        <div class="gallery-thumb" onclick="changeMainImage('${img}')">
                            <img src="${img}" alt="${tour.nombre} - Imagen ${i + 2}">
                        </div>
                    `).join('')}
                </div>
                
                <!-- Header del tour -->
                <div class="tour-header">
                    <span class="tour-category">${tour.categoria_nombre}</span>
                    <h1 class="tour-title">${tour.nombre}</h1>
                    <div class="tour-header-meta">
                        <div class="meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#fbbf24" stroke="#fbbf24"/>
                            </svg>
                            <strong>${tour.rating}</strong>
                            <span>(${tour.reviews_count} opiniones)</span>
                        </div>
                        <div class="meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            ${tour.ubicacion}
                        </div>
                        <div class="meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                            ${tour.duracion}
                        </div>
                        <div class="meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                            Máx. ${tour.capacidad_maxima} personas
                        </div>
                    </div>
                </div>
                
                <!-- Descripción -->
                <div class="tour-description">
                    <h3>Descripción</h3>
                    <p>${tour.descripcion}</p>
                </div>
                
                <!-- Itinerario -->
                <div class="tour-itinerary">
                    <h3>Itinerario</h3>
                    <div class="itinerary-list">
                        ${tour.itinerario.map((item, index) => `
                            <div class="itinerary-item">
                                <div class="itinerary-number">${index + 1}</div>
                                <div class="itinerary-content">
                                    <h4>${item.hora} - ${item.titulo}</h4>
                                    <p>${item.descripcion}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Incluye -->
                <div class="tour-includes">
                    <h3>El tour incluye</h3>
                    <div class="includes-grid">
                        ${tour.incluye.map(item => `
                            <div class="include-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                ${item}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- No incluye -->
                <div class="tour-includes" style="margin-top: 1.5rem;">
                    <h3>No incluye</h3>
                    <div class="includes-grid">
                        ${tour.no_incluye.map(item => `
                            <div class="include-item" style="color: var(--muted-foreground);">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                                ${item}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Sidebar de reserva -->
            <aside>
                <div class="booking-card">
                    <div class="booking-price">
                        <span class="booking-price-label">Precio por persona</span>
                        <div class="booking-price-value">S/ ${tour.precio.toFixed(2)} <span>/ persona</span></div>
                    </div>
                    
                    <form class="booking-form" id="bookingForm">
                        <div class="form-group">
                            <label for="bookingDate">Fecha del tour</label>
                            <input type="date" id="bookingDate" name="fecha" required min="${getTomorrowDate()}">
                        </div>
                        
                        <div class="form-group">
                            <label for="bookingPersonas">Número de personas</label>
                            <select id="bookingPersonas" name="personas" required>
                                ${Array.from({length: tour.capacidad_maxima}, (_, i) => i + 1).map(n => `
                                    <option value="${n}">${n} persona${n > 1 ? 's' : ''}</option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <div class="booking-total">
                            <span class="booking-total-label">Total</span>
                            <span class="booking-total-value" id="bookingTotal">S/ ${tour.precio.toFixed(2)}</span>
                        </div>
                        
                        <button type="submit" class="btn btn-primary btn-lg btn-block">
                            Reservar ahora
                        </button>
                    </form>
                    
                    <p style="font-size: 0.8125rem; color: var(--muted-foreground); text-align: center; margin-top: 1rem;">
                        No se cobra hasta confirmar la reserva
                    </p>
                </div>
            </aside>
        </div>
    `;
}

function setupBookingForm() {
    const form = document.getElementById('bookingForm');
    const personasSelect = document.getElementById('bookingPersonas');
    const totalElement = document.getElementById('bookingTotal');
    
    if (!form || !currentTour) return;
    
    // Actualizar total cuando cambia el número de personas
    personasSelect.addEventListener('change', function() {
        const personas = parseInt(this.value);
        const total = currentTour.precio * personas;
        totalElement.textContent = `S/ ${total.toFixed(2)}`;
    });
    
    // Manejar envío del formulario
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const fecha = formData.get('fecha');
        const personas = parseInt(formData.get('personas'));
        
        // Verificar si el usuario está autenticado
        if (!API.isAuthenticated()) {
            if (confirm('Necesitas iniciar sesión para hacer una reserva. ¿Deseas ir a la página de login?')) {
                // Guardar datos de reserva pendiente
                localStorage.setItem('pendingBooking', JSON.stringify({
                    tourId: currentTour.id_tour,
                    fecha,
                    personas
                }));
                window.location.href = 'login.html';
            }
            return;
        }
        
        try {
            const reserva = await API.crearReserva({
                id_tour: currentTour.id_tour,
                fecha_reserva: fecha,
                num_personas: personas,
                monto_total: currentTour.precio * personas
            });
            
            mostrarAlerta('¡Reserva creada exitosamente! Te contactaremos pronto.', 'success');
            
            // Opcional: redirigir a página de confirmación
            // window.location.href = `reserva-confirmada.html?id=${reserva.id_reserva}`;
            
        } catch (error) {
            console.error('Error creando reserva:', error);
            mostrarAlerta('Error al crear la reserva. Por favor, intenta de nuevo.', 'error');
        }
    });
}

function changeMainImage(src) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = src;
    }
}

function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
}

// Exportar funciones
window.changeMainImage = changeMainImage;
