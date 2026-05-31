/**
 * ========================================
 * DESTINOS PAGE - Tarapoto Tours
 * ========================================
 */

document.addEventListener('DOMContentLoaded', function() {
    initDestinosPage();
});

let destinosState = {
    q: '',
    ordenar: 'relevancia'
};

let destinosBase = [];

async function initDestinosPage() {
    const destinosGrid = document.getElementById('destinosGrid');
    if (!destinosGrid) return;

    const params = new URLSearchParams(window.location.search);
    destinosState.q = params.get('q') || '';
    destinosState.ordenar = params.get('ordenar') || 'relevancia';

    const searchInput = document.getElementById('searchDestinos');
    const sortSelect = document.getElementById('sortDestinos');

    if (searchInput) {
        searchInput.value = destinosState.q;
        searchInput.addEventListener('input', function() {
            destinosState.q = this.value.trim();
            renderDestinosPage();
        });
    }

    if (sortSelect) {
        sortSelect.value = destinosState.ordenar;
        sortSelect.addEventListener('change', function() {
            destinosState.ordenar = this.value;
            renderDestinosPage();
        });
    }

    try {
        destinosBase = await API.getDestinos();
        renderDestinosPage();
    } catch (error) {
        console.error('Error cargando destinos:', error);
        destinosGrid.innerHTML = `
            <div class="destinos-empty">
                <p>No se pudieron cargar los destinos.</p>
                <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 1rem;">Reintentar</button>
            </div>
        `;
    }
}

function getDestinosFiltrados() {
    let destinos = [...destinosBase];

    if (destinosState.q) {
        const q = destinosState.q.toLowerCase();
        destinos = destinos.filter(dest =>
            dest.nombre.toLowerCase().includes(q) ||
            dest.descripcion.toLowerCase().includes(q)
        );
    }

    switch (destinosState.ordenar) {
        case 'nombre_asc':
            destinos.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
            break;
        case 'nombre_desc':
            destinos.sort((a, b) => b.nombre.localeCompare(a.nombre, 'es'));
            break;
        case 'tours_desc':
            destinos.sort((a, b) => b.tours_count - a.tours_count);
            break;
        case 'tours_asc':
            destinos.sort((a, b) => a.tours_count - b.tours_count);
            break;
        default:
            destinos.sort((a, b) => b.tours_count - a.tours_count);
            break;
    }

    return destinos;
}

function renderDestinosPage() {
    const destinosGrid = document.getElementById('destinosGrid');
    const destinosCount = document.getElementById('destinosCount');
    if (!destinosGrid) return;

    const destinos = getDestinosFiltrados();

    if (destinosCount) {
        destinosCount.textContent = destinos.length;
    }

    if (!destinos.length) {
        destinosGrid.innerHTML = `
            <div class="destinos-empty">
                <p>No se encontraron destinos con ese criterio.</p>
                <button class="btn btn-primary" id="clearDestinosFilters" style="margin-top: 1rem;">Limpiar filtros</button>
            </div>
        `;

        const clearBtn = document.getElementById('clearDestinosFilters');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                destinosState.q = '';
                destinosState.ordenar = 'relevancia';
                const searchInput = document.getElementById('searchDestinos');
                const sortSelect = document.getElementById('sortDestinos');
                if (searchInput) searchInput.value = '';
                if (sortSelect) sortSelect.value = 'relevancia';
                renderDestinosPage();
            });
        }
        return;
    }

    destinosGrid.innerHTML = destinos.map(dest => `
        <a href="tours.html?destino=${encodeURIComponent(dest.nombre)}" class="destino-card">
            <img src="${dest.imagen}" alt="${dest.nombre}" loading="lazy">
            <div class="destino-overlay">
                <div class="destino-info">
                    <span class="destino-pill">${dest.tours_count} tours</span>
                    <h3 class="destino-name">${dest.nombre} ${dest.bandera}</h3>
                    <p class="destino-count">${dest.descripcion}</p>
                    <p class="destino-meta">Explora tours, precios y disponibilidad en esta zona.</p>
                    <div class="destino-actions">
                        <span class="btn btn-white btn-sm">Ver tours</span>
                    </div>
                </div>
            </div>
        </a>
    `).join('');
}
