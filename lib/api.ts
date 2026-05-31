// ============================================================
// API SERVICE - Preparado para integración con Java + MySQL
// ============================================================
// Este archivo contiene funciones que simulan llamadas API.
// Al integrar con el backend Java, reemplazar por fetch() reales.
// ============================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// ============================================================
// TIPOS DE DATOS - Basados en el esquema MySQL
// ============================================================

export interface Destino {
  id: number;
  agencia_id: number;
  nombre: string;
  descripcion: string | null;
  latitud: number | null;
  longitud: number | null;
  activo: boolean;
  imagen?: string;
}

export interface CategoriaTour {
  id: number;
  agencia_id: number;
  nombre: string;
  descripcion: string | null;
  icono?: string;
}

export interface Tour {
  id: number;
  agencia_id: number;
  destino_id: number;
  categoria_id: number;
  nombre: string;
  descripcion: string | null;
  itinerario: string | null;
  duracion_horas: number;
  cupo_maximo: number;
  precio_nacional: number;
  precio_extranjero: number;
  estado: "activo" | "agotado" | "pausado" | "eliminado";
  created_at: string;
  destino?: Destino;
  categoria?: CategoriaTour;
  imagenes?: TourImagen[];
  rating?: number;
  total_resenas?: number;
}

export interface TourImagen {
  id: number;
  tour_id: number;
  url: string;
  es_principal: boolean;
  orden: number;
}

export interface Turista {
  id: number;
  agencia_id: number;
  tipo_doc: "DNI" | "Pasaporte" | "CE" | "RUC";
  documento: string;
  nombre: string;
  apellidos: string;
  email: string | null;
  celular: string | null;
  fecha_nacimiento: string | null;
  pais_id: number | null;
  segmento: "normal" | "frecuente" | "vip";
}

export interface Reserva {
  id: number;
  agencia_id: number;
  tour_id: number;
  turista_id: number;
  fecha_servicio: string;
  hora_recojo: string | null;
  lugar_recojo: string | null;
  num_personas: number;
  precio_unitario: number;
  descuento: number;
  total: number;
  saldo_pendiente: number;
  moneda: string;
  canal: "mostrador" | "web";
  estado: "pendiente" | "confirmada" | "completada" | "anulada" | "reprogramada";
  codigo_qr: string | null;
}

export interface SearchFilters {
  destino?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  personas?: number;
  categoria_id?: number;
  precio_min?: number;
  precio_max?: number;
}

// ============================================================
// DATOS MOCK - Reemplazar por llamadas API reales
// ============================================================

const MOCK_DESTINOS: Destino[] = [
  {
    id: 1,
    agencia_id: 1,
    nombre: "Laguna Azul",
    descripcion: "Hermosa laguna de aguas cristalinas rodeada de selva",
    latitud: -6.5833,
    longitud: -76.3333,
    activo: true,
    imagen: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
  },
  {
    id: 2,
    agencia_id: 1,
    nombre: "Cataratas de Ahuashiyacu",
    descripcion: "Impresionante caída de agua de 40 metros",
    latitud: -6.4167,
    longitud: -76.3833,
    activo: true,
    imagen: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800",
  },
  {
    id: 3,
    agencia_id: 1,
    nombre: "Laguna de Sauce",
    descripcion: "Lago navegable con deportes acuáticos",
    latitud: -6.6833,
    longitud: -76.2167,
    activo: true,
    imagen: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
  },
  {
    id: 4,
    agencia_id: 1,
    nombre: "Baños Termales de San Mateo",
    descripcion: "Aguas termales naturales con propiedades medicinales",
    latitud: -6.5,
    longitud: -76.35,
    activo: true,
    imagen: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
  },
];

const MOCK_CATEGORIAS: CategoriaTour[] = [
  { id: 1, agencia_id: 1, nombre: "Full Day", descripcion: "Tours de día completo", icono: "sun" },
  { id: 2, agencia_id: 1, nombre: "Pernocte", descripcion: "Tours con alojamiento", icono: "moon" },
  { id: 3, agencia_id: 1, nombre: "Aventura", descripcion: "Tours de aventura extrema", icono: "mountain" },
  { id: 4, agencia_id: 1, nombre: "Relax", descripcion: "Tours de descanso y bienestar", icono: "spa" },
];

const MOCK_TOURS: Tour[] = [
  {
    id: 1,
    agencia_id: 1,
    destino_id: 1,
    categoria_id: 1,
    nombre: "Laguna Azul Full Day",
    descripcion: "Disfruta de un día completo en la hermosa Laguna Azul. Incluye transporte, guía y almuerzo típico.",
    itinerario: "7:00 Recojo - 9:00 Llegada - 12:00 Almuerzo - 16:00 Retorno",
    duracion_horas: 10,
    cupo_maximo: 20,
    precio_nacional: 85,
    precio_extranjero: 120,
    estado: "activo",
    created_at: "2025-01-01",
    rating: 4.8,
    total_resenas: 156,
    imagenes: [{ id: 1, tour_id: 1, url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", es_principal: true, orden: 0 }],
  },
  {
    id: 2,
    agencia_id: 1,
    destino_id: 2,
    categoria_id: 3,
    nombre: "Cataratas de Ahuashiyacu - Aventura",
    descripcion: "Trekking y baño en las cataratas más famosas de San Martín.",
    itinerario: "8:00 Recojo - 9:30 Llegada - 13:00 Retorno",
    duracion_horas: 5,
    cupo_maximo: 15,
    precio_nacional: 45,
    precio_extranjero: 65,
    estado: "activo",
    created_at: "2025-01-01",
    rating: 4.9,
    total_resenas: 243,
    imagenes: [{ id: 2, tour_id: 2, url: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800", es_principal: true, orden: 0 }],
  },
  {
    id: 3,
    agencia_id: 1,
    destino_id: 3,
    categoria_id: 2,
    nombre: "Laguna de Sauce - 2 Días",
    descripcion: "Escapada de fin de semana con deportes acuáticos y alojamiento.",
    itinerario: "Día 1: Viaje y actividades - Día 2: Descanso y retorno",
    duracion_horas: 48,
    cupo_maximo: 12,
    precio_nacional: 280,
    precio_extranjero: 380,
    estado: "activo",
    created_at: "2025-01-01",
    rating: 4.7,
    total_resenas: 89,
    imagenes: [{ id: 3, tour_id: 3, url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800", es_principal: true, orden: 0 }],
  },
  {
    id: 4,
    agencia_id: 1,
    destino_id: 4,
    categoria_id: 4,
    nombre: "Baños Termales San Mateo",
    descripcion: "Relájate en las aguas termales naturales con propiedades curativas.",
    itinerario: "9:00 Recojo - 10:00 Llegada - 14:00 Retorno",
    duracion_horas: 5,
    cupo_maximo: 25,
    precio_nacional: 55,
    precio_extranjero: 75,
    estado: "activo",
    created_at: "2025-01-01",
    rating: 4.6,
    total_resenas: 178,
    imagenes: [{ id: 4, tour_id: 4, url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800", es_principal: true, orden: 0 }],
  },
  {
    id: 5,
    agencia_id: 1,
    destino_id: 1,
    categoria_id: 3,
    nombre: "Kayak en Laguna Azul",
    descripcion: "Aventura en kayak por las aguas cristalinas de la Laguna Azul.",
    itinerario: "6:00 Recojo - 8:00 Inicio kayak - 12:00 Almuerzo - 15:00 Retorno",
    duracion_horas: 9,
    cupo_maximo: 10,
    precio_nacional: 120,
    precio_extranjero: 160,
    estado: "activo",
    created_at: "2025-01-01",
    rating: 4.95,
    total_resenas: 67,
    imagenes: [{ id: 5, tour_id: 5, url: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800", es_principal: true, orden: 0 }],
  },
  {
    id: 6,
    agencia_id: 1,
    destino_id: 2,
    categoria_id: 1,
    nombre: "Cascadas y Cacao Tour",
    descripcion: "Visita las cataratas y aprende sobre el proceso del cacao amazónico.",
    itinerario: "8:00 Recojo - 9:30 Cataratas - 11:00 Finca de cacao - 14:00 Retorno",
    duracion_horas: 6,
    cupo_maximo: 18,
    precio_nacional: 75,
    precio_extranjero: 95,
    estado: "activo",
    created_at: "2025-01-01",
    rating: 4.85,
    total_resenas: 112,
    imagenes: [{ id: 6, tour_id: 6, url: "https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?w=800", es_principal: true, orden: 0 }],
  },
];

// ============================================================
// FUNCIONES API - Preparadas para backend Java
// ============================================================

// Simula delay de red
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * GET /api/destinos
 * Obtiene todos los destinos activos
 */
export async function getDestinos(): Promise<Destino[]> {
  // TODO: Reemplazar por fetch real
  // return fetch(`${API_BASE_URL}/destinos`).then(res => res.json());
  await delay(300);
  return MOCK_DESTINOS;
}

/**
 * GET /api/categorias
 * Obtiene todas las categorías de tours
 */
export async function getCategorias(): Promise<CategoriaTour[]> {
  // TODO: Reemplazar por fetch real
  // return fetch(`${API_BASE_URL}/categorias`).then(res => res.json());
  await delay(200);
  return MOCK_CATEGORIAS;
}

/**
 * GET /api/tours
 * Obtiene tours con filtros opcionales
 */
export async function getTours(filters?: SearchFilters): Promise<Tour[]> {
  // TODO: Reemplazar por fetch real
  // const params = new URLSearchParams(filters as any);
  // return fetch(`${API_BASE_URL}/tours?${params}`).then(res => res.json());
  await delay(400);
  
  let tours = [...MOCK_TOURS];
  
  if (filters?.destino) {
    tours = tours.filter((t) => 
      MOCK_DESTINOS.find((d) => d.id === t.destino_id)?.nombre
        .toLowerCase()
        .includes(filters.destino!.toLowerCase())
    );
  }
  
  if (filters?.categoria_id) {
    tours = tours.filter((t) => t.categoria_id === filters.categoria_id);
  }
  
  if (filters?.precio_max) {
    tours = tours.filter((t) => t.precio_nacional <= filters.precio_max!);
  }
  
  return tours;
}

/**
 * GET /api/tours/:id
 * Obtiene un tour por ID
 */
export async function getTourById(id: number): Promise<Tour | null> {
  // TODO: Reemplazar por fetch real
  // return fetch(`${API_BASE_URL}/tours/${id}`).then(res => res.json());
  await delay(300);
  return MOCK_TOURS.find((t) => t.id === id) || null;
}

/**
 * GET /api/tours/destacados
 * Obtiene tours destacados/populares
 */
export async function getToursDestacados(): Promise<Tour[]> {
  // TODO: Reemplazar por fetch real
  await delay(300);
  return MOCK_TOURS.filter((t) => (t.rating || 0) >= 4.8);
}

/**
 * POST /api/reservas
 * Crea una nueva reserva
 */
export async function crearReserva(data: {
  tour_id: number;
  turista_id?: number;
  fecha_servicio: string;
  num_personas: number;
  turista_data?: Partial<Turista>;
}): Promise<{ success: boolean; reserva_id?: number; codigo_qr?: string; error?: string }> {
  // TODO: Reemplazar por fetch real
  // return fetch(`${API_BASE_URL}/reservas`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // }).then(res => res.json());
  await delay(500);
  return {
    success: true,
    reserva_id: Math.floor(Math.random() * 10000),
    codigo_qr: `QR-${Date.now()}`,
  };
}

/**
 * POST /api/auth/login
 * Login de turista
 */
export async function loginTurista(email: string, password: string): Promise<{ success: boolean; turista?: Turista; token?: string; error?: string }> {
  // TODO: Reemplazar por fetch real
  await delay(400);
  if (email && password) {
    return {
      success: true,
      turista: {
        id: 1,
        agencia_id: 1,
        tipo_doc: "DNI",
        documento: "12345678",
        nombre: "Usuario",
        apellidos: "Demo",
        email: email,
        celular: null,
        fecha_nacimiento: null,
        pais_id: 1,
        segmento: "normal",
      },
      token: "mock-jwt-token",
    };
  }
  return { success: false, error: "Credenciales inválidas" };
}

/**
 * POST /api/auth/register
 * Registro de turista
 */
export async function registrarTurista(data: Partial<Turista> & { password: string }): Promise<{ success: boolean; turista?: Turista; error?: string }> {
  // TODO: Reemplazar por fetch real
  await delay(500);
  return {
    success: true,
    turista: {
      id: Math.floor(Math.random() * 1000),
      agencia_id: 1,
      tipo_doc: data.tipo_doc || "DNI",
      documento: data.documento || "",
      nombre: data.nombre || "",
      apellidos: data.apellidos || "",
      email: data.email || null,
      celular: data.celular || null,
      fecha_nacimiento: data.fecha_nacimiento || null,
      pais_id: data.pais_id || null,
      segmento: "normal",
    },
  };
}
