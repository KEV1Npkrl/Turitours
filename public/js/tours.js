/**
 * ========================================
 * TOURS PAGE - Tarapoto Tours
 * ========================================
 */

document.addEventListener('DOMContentLoaded', function() {
    initToursPage();
});

let currentFilters = {
    categoria: '',
    precio: '',
    ordenar: '',
    destino: ''
};

async function initToursPage() {
    const toursGrid = document.getElementById('toursGrid');
    if (!toursGrid) return;
    
    // Obtener parámetros de URL
    const urlParams = new URLSearchParams(window.location.search);
    currentFilters.categoria = urlParams.get('categoria') || '';
    currentFilters.destino = urlParams.get('destino') || '';
    
    // Cargar categorías para el filtro
    await loadCategorias();
    
    // Configurar event listeners para filtros
    setupFilters();
    
    // Cargar tours
    await loadTours();
}

async function loadCategorias() {
    const filterCategoria = document.getElementById('filterCategoria');
    if (!filterCategoria) return;
    
    try {
        const categorias = await API.getCategorias();
        
        categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.nombre;
            if (cat.id.toString() === currentFilters.categoria) {
                option.selected = true;
            }
            filterCategoria.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando categorías:', error);
    }
}

function setupFilters() {
    const filterCategoria = document.getElementById('filterCategoria');
    const filterPrecio = document.getElementById('filterPrecio');
    const filterOrdenar = document.getElementById('filterOrdenar');
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
    
    // View toggle
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const toursGrid = document.getElementById('toursGrid');
            if (this.dataset.view === 'list') {
                toursGrid.style.gridTemplateColumns = '1fr';
            } else {
                toursGrid.style.gridTemplateColumns = '';
            }
        });
    });
}

async function loadTours() {
    const toursGrid = document.getElementById('toursGrid');
    const resultsCount = document.getElementById('resultsCount');
    
    mostrarLoading(toursGrid);
    
    try {
        // Preparar filtros para la API
        const filtros = {
            ordenar: currentFilters.ordenar
        };
        
        if (currentFilters.categoria) {
            filtros.categoria = currentFilters.categoria;
        }
        
        if (currentFilters.destino) {
            filtros.destino = currentFilters.destino;
        }
        
        // Filtro de precio
        if (currentFilters.precio) {
            const [min, max] = currentFilters.precio.split('-');
            if (min) filtros.precio_min = min;
            if (max && max !== '+') filtros.precio_max = max;
        }
        
        const tours = await API.getTours(filtros);
        
        if (resultsCount) {
            resultsCount.textContent = tours.length;
        }
        
        if (tours.length === 0) {
            toursGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <p style="color: var(--muted-foreground);">No se encontraron tours con los filtros seleccionados.</p>
                    <a href="tours.html" class="btn btn-primary" style="margin-top: 1rem;">Ver todos los tours</a>
                </div>
            `;
            return;
        }
        
        renderTours(tours, toursGrid, null);
        
    } catch (error) {
        console.error('Error cargando tours:', error);
        toursGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <p style="color: var(--destructive);">Error al cargar los tours. Por favor, intenta de nuevo.</p>
                <button class="btn btn-primary" onclick="loadTours()" style="margin-top: 1rem;">Reintentar</button>
            </div>
        `;
    }
}
