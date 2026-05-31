/**
 * ========================================
 * API SERVICE - Preparado para Java Backend
 * ========================================
 * 
 * Este archivo contiene funciones que simulan llamadas a la API REST.
 * Cuando el backend Java esté listo, solo necesitas cambiar la BASE_URL
 * y las funciones harán fetch a los endpoints reales.
 * 
 * Endpoints esperados del backend Java:
 * - GET  /api/categorias          -> Lista de categorías
 * - GET  /api/destinos            -> Lista de destinos
 * - GET  /api/tours               -> Lista de tours (con filtros opcionales)
 * - GET  /api/tours/:id           -> Detalle de un tour
 * - POST /api/reservas            -> Crear reserva
 * - POST /api/auth/login          -> Login de usuario
 * - POST /api/auth/registro       -> Registro de usuario
 * - GET  /api/usuarios/:id/reservas -> Reservas del usuario
 */

const API = (function() {
    // Cambiar esta URL cuando el backend Java esté listo
    const BASE_URL = '/api'; // Ejemplo: 'http://localhost:8080/api'
    
    // Flag para usar datos mock (cambiar a false cuando el backend esté listo)
    const USE_MOCK = true;

    // Simular delay de red
    const mockDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * Helper para hacer peticiones fetch
     * @param {string} endpoint - Endpoint de la API
     * @param {object} options - Opciones de fetch
     */
    async function request(endpoint, options = {}) {
        const url = `${BASE_URL}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                // Agregar token de autenticación si existe
                ...(getAuthToken() && { 'Authorization': `Bearer ${getAuthToken()}` })
            }
        };

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error en la petición');
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error en ${endpoint}:`, error);
            throw error;
        }
    }

    /**
     * Obtener token de autenticación del localStorage
     */
    function getAuthToken() {
        return localStorage.getItem('authToken');
    }

    /**
     * Guardar token de autenticación
     */
    function setAuthToken(token) {
        localStorage.setItem('authToken', token);
    }

    /**
     * Eliminar token de autenticación
     */
    function removeAuthToken() {
        localStorage.removeItem('authToken');
    }

    // ========================================
    // CATEGORÍAS
    // ========================================

    /**
     * Obtener todas las categorías
     * Endpoint: GET /api/categorias
     */
    async function getCategorias() {
        if (USE_MOCK) {
            await mockDelay();
            return MOCK_DATA.categorias;
        }
        return request('/categorias');
    }

    // ========================================
    // DESTINOS
    // ========================================

    /**
     * Obtener todos los destinos
     * Endpoint: GET /api/destinos
     */
    async function getDestinos() {
        if (USE_MOCK) {
            await mockDelay();
            return MOCK_DATA.destinos;
        }
        return request('/destinos');
    }

    /**
     * Obtener destino por ID
     * Endpoint: GET /api/destinos/:id
     */
    async function getDestinoById(id) {
        if (USE_MOCK) {
            await mockDelay();
            return MOCK_DATA.destinos.find(d => d.id_destino === id);
        }
        return request(`/destinos/${id}`);
    }

    // ========================================
    // TOURS
    // ========================================

    /**
     * Obtener todos los tours con filtros opcionales
     * Endpoint: GET /api/tours?categoria=X&destino=Y&precio_min=Z&precio_max=W
     */
    async function getTours(filtros = {}) {
        if (USE_MOCK) {
            await mockDelay(400);
            let tours = [...MOCK_DATA.tours];

            // Aplicar filtros
            if (filtros.categoria) {
                tours = tours.filter(t => t.id_categoria === parseInt(filtros.categoria));
            }
            if (filtros.destino) {
                tours = tours.filter(t => t.ubicacion.toLowerCase().includes(filtros.destino.toLowerCase()));
            }
            if (filtros.precio_min) {
                tours = tours.filter(t => t.precio >= parseFloat(filtros.precio_min));
            }
            if (filtros.precio_max) {
                tours = tours.filter(t => t.precio <= parseFloat(filtros.precio_max));
            }
            if (filtros.busqueda) {
                const busqueda = filtros.busqueda.toLowerCase();
                tours = tours.filter(t => 
                    t.nombre.toLowerCase().includes(busqueda) ||
                    t.descripcion.toLowerCase().includes(busqueda)
                );
            }

            // Aplicar ordenamiento
            if (filtros.ordenar) {
                switch (filtros.ordenar) {
                    case 'precio_asc':
                        tours.sort((a, b) => a.precio - b.precio);
                        break;
                    case 'precio_desc':
                        tours.sort((a, b) => b.precio - a.precio);
                        break;
                    case 'rating':
                        tours.sort((a, b) => b.rating - a.rating);
                        break;
                    case 'popularidad':
                        tours.sort((a, b) => b.reviews_count - a.reviews_count);
                        break;
                }
            }

            return tours;
        }

        // Construir query string
        const params = new URLSearchParams();
        Object.entries(filtros).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        
        return request(`/tours?${params.toString()}`);
    }

    /**
     * Obtener tours destacados
     * Endpoint: GET /api/tours/destacados
     */
    async function getToursDestacados() {
        if (USE_MOCK) {
            await mockDelay();
            return MOCK_DATA.tours.filter(t => t.destacado);
        }
        return request('/tours/destacados');
    }

    /**
     * Obtener tour por ID
     * Endpoint: GET /api/tours/:id
     */
    async function getTourById(id) {
        if (USE_MOCK) {
            await mockDelay(200);
            const tour = MOCK_DATA.tours.find(t => t.id_tour === parseInt(id));
            if (!tour) {
                throw new Error('Tour no encontrado');
            }
            return tour;
        }
        return request(`/tours/${id}`);
    }

    /**
     * Obtener tours por categoría
     * Endpoint: GET /api/tours/categoria/:id
     */
    async function getToursByCategoria(categoriaId) {
        if (USE_MOCK) {
            await mockDelay();
            return MOCK_DATA.tours.filter(t => t.id_categoria === parseInt(categoriaId));
        }
        return request(`/tours/categoria/${categoriaId}`);
    }

    // ========================================
    // RESERVAS
    // ========================================

    /**
     * Crear una nueva reserva
     * Endpoint: POST /api/reservas
     * Body: { id_tour, id_turista, fecha_reserva, num_personas, monto_total }
     */
    async function crearReserva(datosReserva) {
        if (USE_MOCK) {
            await mockDelay(500);
            // Simular creación exitosa
            return {
                id_reserva: Math.floor(Math.random() * 10000),
                ...datosReserva,
                fecha_creacion: new Date().toISOString(),
                estado: 'PENDIENTE'
            };
        }
        return request('/reservas', {
            method: 'POST',
            body: JSON.stringify(datosReserva)
        });
    }

    /**
     * Obtener reservas del usuario
     * Endpoint: GET /api/usuarios/:id/reservas
     */
    async function getReservasUsuario(usuarioId) {
        if (USE_MOCK) {
            await mockDelay();
            // Simular reservas vacías por ahora
            return [];
        }
        return request(`/usuarios/${usuarioId}/reservas`);
    }

    /**
     * Cancelar una reserva
     * Endpoint: PUT /api/reservas/:id/cancelar
     */
    async function cancelarReserva(reservaId) {
        if (USE_MOCK) {
            await mockDelay();
            return { success: true, message: 'Reserva cancelada exitosamente' };
        }
        return request(`/reservas/${reservaId}/cancelar`, { method: 'PUT' });
    }

    // ========================================
    // AUTENTICACIÓN
    // ========================================

    /**
     * Iniciar sesión
     * Endpoint: POST /api/auth/login
     * Body: { email, password }
     */
    async function login(email, password) {
        if (USE_MOCK) {
            await mockDelay(500);
            // Simular login exitoso
            if (email && password) {
                const token = 'mock_token_' + Date.now();
                setAuthToken(token);
                return {
                    success: true,
                    token: token,
                    usuario: MOCK_DATA.usuario_prueba
                };
            }
            throw new Error('Credenciales incorrectas');
        }
        
        const response = await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (response.token) {
            setAuthToken(response.token);
        }
        
        return response;
    }

    /**
     * Registrar nuevo usuario
     * Endpoint: POST /api/auth/registro
     * Body: { nombre, apellido, email, password, telefono, pais, ciudad }
     */
    async function registro(datosUsuario) {
        if (USE_MOCK) {
            await mockDelay(500);
            return {
                success: true,
                message: 'Usuario registrado exitosamente',
                usuario: {
                    id_turista: Math.floor(Math.random() * 10000),
                    ...datosUsuario
                }
            };
        }
        return request('/auth/registro', {
            method: 'POST',
            body: JSON.stringify(datosUsuario)
        });
    }

    /**
     * Cerrar sesión
     */
    function logout() {
        removeAuthToken();
        // Redirigir a la página principal
        window.location.href = 'index.html';
    }

    /**
     * Verificar si el usuario está autenticado
     */
    function isAuthenticated() {
        return !!getAuthToken();
    }

    /**
     * Obtener usuario actual
     * Endpoint: GET /api/auth/me
     */
    async function getUsuarioActual() {
        if (USE_MOCK) {
            await mockDelay();
            if (isAuthenticated()) {
                return MOCK_DATA.usuario_prueba;
            }
            return null;
        }
        return request('/auth/me');
    }

    // ========================================
    // API PÚBLICA
    // ========================================

    return {
        // Categorías
        getCategorias,
        
        // Destinos
        getDestinos,
        getDestinoById,
        
        // Tours
        getTours,
        getToursDestacados,
        getTourById,
        getToursByCategoria,
        
        // Reservas
        crearReserva,
        getReservasUsuario,
        cancelarReserva,
        
        // Autenticación
        login,
        registro,
        logout,
        isAuthenticated,
        getUsuarioActual
    };
})();

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.API = API;
}
