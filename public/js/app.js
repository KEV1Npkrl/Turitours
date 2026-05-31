/**
 * ========================================
 * MAIN APPLICATION - Tarapoto Tours
 * ========================================
 */

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initAuthHeader();
    initHomePage();
});

/**
 * ========================================
 * MOBILE MENU
 * ========================================
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
            
            // Cambiar icono
            const isOpen = mobileMenu.classList.contains('open');
            menuToggle.innerHTML = isOpen 
                ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
                : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        });
        
        // Cerrar menú al hacer click fuera
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('open');
            }
        });
    }
}

/**
 * Header dinamico cuando hay sesion de turista
 */
async function initAuthHeader() {
    if (typeof API === 'undefined') return;

    const headerActions = document.querySelector('.header-actions');
    const mobileAuth = document.querySelector('.mobile-auth');
    if (!headerActions || !API.isAuthenticated()) return;

    try {
        const user = await API.getUsuarioActual();
        const label = user ? user.nombre.split(' ')[0] : 'Cuenta';
        const initials = user
            ? (user.nombre.charAt(0) + (user.apellidos ? user.apellidos.charAt(0) : '')).toUpperCase()
            : '?';

        headerActions.innerHTML = `
            <a href="mis-reservas.html" class="btn btn-outline">Mis reservas</a>
            <a href="mi-perfil.html" class="header-profile" title="Ver mi perfil">
                <span class="header-profile-avatar" aria-hidden="true">${initials}</span>
                <span class="header-profile-name">${label}</span>
            </a>
            <button type="button" class="btn btn-outline btn-sm" id="logoutBtn" title="Cerrar sesion">Salir</button>
        `;

        if (mobileAuth) {
            mobileAuth.innerHTML = `
                <a href="mi-perfil.html" class="header-profile header-profile-mobile btn-block">
                    <span class="header-profile-avatar" aria-hidden="true">${initials}</span>
                    <span class="header-profile-name">Mi perfil (${label})</span>
                </a>
                <a href="mis-reservas.html" class="btn btn-outline btn-block">Mis reservas</a>
                <button type="button" class="btn btn-primary btn-block" id="logoutBtnMobile">Cerrar sesion</button>
            `;
        }

        const logout = () => API.logout();
        document.getElementById('logoutBtn')?.addEventListener('click', logout);
        document.getElementById('logoutBtnMobile')?.addEventListener('click', logout);
    } catch (error) {
        console.error('Error cargando sesion:', error);
    }
}

/**
 * ========================================
 * HOME PAGE
 * ========================================
 */
async function initHomePage() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    const destinosGrid = document.getElementById('destinosGrid');
    const toursGrid = document.getElementById('toursGrid');
    
    // Solo ejecutar en la página principal
    if (!categoriesGrid && !destinosGrid && !toursGrid) return;
    
    try {
        // Cargar datos en paralelo
        const [categorias, destinos, tours] = await Promise.all([
            categoriesGrid ? API.getCategorias() : null,
            destinosGrid ? API.getDestinos() : null,
            toursGrid ? API.getToursDestacados() : null
        ]);
        
        if (categorias && categoriesGrid) {
            renderCategorias(categorias, categoriesGrid);
        }
        
        if (destinos && destinosGrid) {
            renderDestinos(destinos, destinosGrid);
        }
        
        if (tours && toursGrid) {
            renderTours(tours, toursGrid);
        }
    } catch (error) {
        console.error('Error cargando datos:', error);
    }
}

/**
 * Renderizar categorías
 */
function renderCategorias(categorias, container) {
    const iconos = {
        waterfall: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v6M12 18v4M4.93 10.93l4.24 4.24M14.83 14.83l4.24 4.24M2 18h2M20 18h2M6.34 6.34L8.46 8.46M15.54 15.54l2.12 2.12M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>',
        lake: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20M2 16h20M2 20h20M6 8c1.5-2 3-3 6-3s4.5 1 6 3"/></svg>',
        adventure: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"/><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/><path d="M10 9.5c0 .83-.67 1.5-1.5 1.5h-5C2.67 11 2 10.33 2 9.5S2.67 8 3.5 8h5c.83 0 1.5.67 1.5 1.5z"/><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"/></svg>',
        cultural: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l8-4 8 4v14M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4M9 8h1M14 8h1M9 12h1M14 12h1"/></svg>',
        nature: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L8 8h8l-4-6zM4 14l-2 6h20l-2-6H4zM12 14v8"/><path d="M8 8l-4 6M16 8l4 6"/></svg>'
    };
    
    container.innerHTML = categorias.map(cat => `
        <a href="tours.html?categoria=${cat.id}" class="category-card">
            <div class="category-icon">
                ${iconos[cat.icono] || iconos.nature}
            </div>
            <span class="category-name">${cat.nombre}</span>
        </a>
    `).join('');
}

/**
 * Renderizar destinos
 */
function renderDestinos(destinos, container) {
    container.innerHTML = destinos.map(dest => `
        <a href="tours.html?destino=${encodeURIComponent(dest.nombre)}" class="destino-card">
            <img src="${dest.imagen}" alt="${dest.nombre}" loading="lazy">
            <div class="destino-overlay">
                <div class="destino-info">
                    <h3 class="destino-name">${dest.nombre} ${dest.bandera}</h3>
                    <p class="destino-count">${dest.tours_count} tours disponibles</p>
                </div>
            </div>
        </a>
    `).join('');
}

/**
 * Renderizar tours
 */
function renderTours(tours, container, limite = 4) {
    const toursToShow = limite ? tours.slice(0, limite) : tours;
    
    container.innerHTML = toursToShow.map(tour => `
        <article class="tour-card">
            <a href="tour-detalle.html?id=${tour.id_tour}">
                <div class="tour-image">
                    <img src="${tour.imagen_principal}" alt="${tour.nombre}" loading="lazy">
                    ${tour.destacado ? '<span class="tour-badge">Destacado</span>' : ''}
                    <button class="tour-favorite" onclick="event.preventDefault(); toggleFavorito(${tour.id_tour})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </button>
                </div>
                <div class="tour-content">
                    <span class="tour-category">${tour.categoria_nombre}</span>
                    <h3 class="tour-title">${tour.nombre}</h3>
                    <div class="tour-location">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                        ${tour.ubicacion}
                    </div>
                    <div class="tour-meta">
                        <div class="tour-rating">
                            <svg viewBox="0 0 24 24">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                            <span>${tour.rating}</span>
                            <span style="color: var(--muted-foreground)">(${tour.reviews_count})</span>
                        </div>
                        <div class="tour-price">
                            <span class="tour-price-label">Desde</span>
                            <span class="tour-price-value">S/ ${tour.precio.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </a>
        </article>
    `).join('');
}

/**
 * Toggle favorito
 */
function toggleFavorito(tourId) {
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    const index = favoritos.indexOf(tourId);
    
    if (index > -1) {
        favoritos.splice(index, 1);
    } else {
        favoritos.push(tourId);
    }
    
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    
    // Actualizar UI
    const btn = event.target.closest('.tour-favorite');
    if (btn) {
        btn.classList.toggle('active', favoritos.includes(tourId));
    }
}

/**
 * ========================================
 * UTILIDADES
 * ========================================
 */

/**
 * Formatear precio
 */
function formatPrecio(precio) {
    return `S/ ${parseFloat(precio).toFixed(2)}`;
}

/**
 * Formatear fecha
 */
function formatFecha(fecha) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-PE', options);
}

/**
 * Mostrar mensaje de alerta
 */
function mostrarAlerta(mensaje, tipo = 'success') {
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo}`;
    alerta.textContent = mensaje;
    
    document.body.insertBefore(alerta, document.body.firstChild);
    
    setTimeout(() => {
        alerta.remove();
    }, 5000);
}

/**
 * Mostrar loading
 */
function mostrarLoading(container) {
    container.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
        </div>
    `;
}

// Exportar funciones para uso global
window.renderTours = renderTours;
window.renderDestinos = renderDestinos;
window.renderCategorias = renderCategorias;
window.toggleFavorito = toggleFavorito;
window.formatPrecio = formatPrecio;
window.formatFecha = formatFecha;
window.mostrarAlerta = mostrarAlerta;
window.mostrarLoading = mostrarLoading;
window.initAuthHeader = initAuthHeader;
