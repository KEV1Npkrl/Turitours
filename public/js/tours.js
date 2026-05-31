/**
 * TOURS PAGE — RF-C01
 */
document.addEventListener('DOMContentLoaded', initToursPage);

let currentFilters = {
    categoria: '',
    precio: '',
    ordenar: '',
    destino: '',
    fecha: '',
    solo_disponibles: false
};

async function initToursPage() {
    const toursGrid = document.getElementById('toursGrid');
    if (!toursGrid) return;

    const urlParams = new URLSearchParams(window.location.search);
    currentFilters.categoria = urlParams.get('categoria') || '';
    currentFilters.destino = urlParams.get('destino') || '';

    const filterFecha = document.getElementById('filterFecha');
    if (filterFecha) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        filterFecha.min = tomorrow.toISOString().split('T')[0];
    }

    await loadCategorias();
    setupFilters();
    await loadTours();
}

async function loadCategorias() {
    const filterCategoria = document.getElementById('filterCategoria');
    if (!filterCategoria) return;
    try {
        const categorias = await API.getCategorias();
        categorias.forEach(function(cat) {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.nombre;
            if (cat.id.toString() === currentFilters.categoria) option.selected = true;
            filterCategoria.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando categorias:', error);
    }
}

function setupFilters() {
    const filterCategoria = document.getElementById('filterCategoria');
    const filterPrecio = document.getElementById('filterPrecio');
    const filterOrdenar = document.getElementById('filterOrdenar');
    const filterFecha = document.getElementById('filterFecha');
    const filterSolo = document.getElementById('filterSoloDisponibles');
    const viewBtns = document.querySelectorAll('.view-btn');

    if (filterCategoria) {
        filterCategoria.addEventListener('change', function() {
            currentFilters.categoria = this.value;
            loadTours();
        });
    }
    if (filterPrecio) {
        filterPrecio.addEventListener('change', function() {
            currentFilters.precio = this.value;
            loadTours();
        });
    }
    if (filterOrdenar) {
        filterOrdenar.addEventListener('change', function() {
            currentFilters.ordenar = this.value;
            loadTours();
        });
    }
    if (filterFecha) {
        filterFecha.addEventListener('change', function() {
            currentFilters.fecha = this.value;
            loadTours();
        });
    }
    if (filterSolo) {
        filterSolo.addEventListener('change', function() {
            currentFilters.solo_disponibles = this.checked;
            loadTours();
        });
    }

    viewBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            viewBtns.forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
            const toursGrid = document.getElementById('toursGrid');
            toursGrid.style.gridTemplateColumns = this.dataset.view === 'list' ? '1fr' : '';
        });
    });
}

async function loadTours() {
    const toursGrid = document.getElementById('toursGrid');
    const resultsCount = document.getElementById('resultsCount');
    mostrarLoading(toursGrid);

    try {
        const filtros = { ordenar: currentFilters.ordenar };
        if (currentFilters.categoria) filtros.categoria = currentFilters.categoria;
        if (currentFilters.destino) filtros.destino = currentFilters.destino;
        if (currentFilters.fecha) {
            filtros.fecha = currentFilters.fecha;
            if (currentFilters.solo_disponibles) filtros.solo_disponibles = true;
        }
        if (currentFilters.precio) {
            const parts = currentFilters.precio.split('-');
            if (parts[0]) filtros.precio_min = parts[0];
            if (parts[1] && parts[1] !== '+') filtros.precio_max = parts[1];
        }

        const tours = await API.getTours(filtros);
        if (resultsCount) resultsCount.textContent = tours.length;

        if (!tours.length) {
            toursGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;">' +
                '<p style="color:var(--muted-foreground);">No se encontraron tours con los filtros seleccionados.</p>' +
                '<a href="tours.html" class="btn btn-primary" style="margin-top:1rem;">Ver todos</a></div>';
            return;
        }

        renderTours(tours, toursGrid, null, {
            showCupos: !!currentFilters.fecha,
            fecha: currentFilters.fecha
        });
    } catch (error) {
        console.error(error);
        toursGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;">' +
            '<p style="color:var(--destructive);">Error al cargar tours.</p>' +
            '<button class="btn btn-primary" onclick="loadTours()" style="margin-top:1rem;">Reintentar</button></div>';
    }
}

window.loadTours = loadTours;
