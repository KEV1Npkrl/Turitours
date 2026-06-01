CREATE DATABASE IF NOT EXISTS turismo_tarapoto 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE turismo_tarapoto;

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE planes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    max_usuarios SMALLINT NOT NULL DEFAULT 5,
    modulos JSON NOT NULL,
    precio_mes DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE agencias (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    ruc CHAR(11) NOT NULL UNIQUE,
    ciudad VARCHAR(80) NOT NULL DEFAULT 'Tarapoto',
    direccion VARCHAR(200) NULL,
    telefono VARCHAR(20) NULL,
    email VARCHAR(120) NULL,
    logo_url VARCHAR(300) NULL,
    plan_id INT UNSIGNED NOT NULL,
    estado ENUM('activa','suspendida','baja') NOT NULL DEFAULT 'activa',
    fecha_alta DATE NOT NULL,
    fecha_baja DATE NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_agencias_plan FOREIGN KEY (plan_id) REFERENCES planes(id)
) ENGINE=InnoDB;

CREATE TABLE superadmins (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    ultimo_login DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE comunicados (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    superadmin_id INT UNSIGNED NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    cuerpo TEXT NOT NULL,
    tipo ENUM('informativo','alerta','actualizacion') NOT NULL DEFAULT 'informativo',
    enviado_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comunicados_superadmin FOREIGN KEY (superadmin_id) REFERENCES superadmins(id)
) ENGINE=InnoDB;

CREATE TABLE parametros_globales (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    clave VARCHAR(80) NOT NULL UNIQUE,
    valor VARCHAR(200) NOT NULL,
    descripcion VARCHAR(300) NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE versiones_sistema (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    version VARCHAR(20) NOT NULL,
    descripcion TEXT NULL,
    superadmin_id INT UNSIGNED NOT NULL,
    desplegada_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_versiones_superadmin FOREIGN KEY (superadmin_id) REFERENCES superadmins(id)
) ENGINE=InnoDB;

CREATE TABLE roles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agencia_id INT UNSIGNED NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    descripcion VARCHAR(200) NULL,
    CONSTRAINT fk_roles_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id),
    UNIQUE KEY uq_rol_agencia (agencia_id, nombre)
) ENGINE=InnoDB;

CREATE TABLE permisos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rol_id INT UNSIGNED NOT NULL,
    modulo VARCHAR(60) NOT NULL,
    puede_ver TINYINT(1) NOT NULL DEFAULT 0,
    puede_crear TINYINT(1) NOT NULL DEFAULT 0,
    puede_editar TINYINT(1) NOT NULL DEFAULT 0,
    puede_eliminar TINYINT(1) NOT NULL DEFAULT 0,
    CONSTRAINT fk_permisos_rol FOREIGN KEY (rol_id) REFERENCES roles(id),
    UNIQUE KEY uq_permiso_rol_modulo (rol_id, modulo)
) ENGINE=InnoDB;

CREATE TABLE usuarios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agencia_id INT UNSIGNED NOT NULL,
    rol_id INT UNSIGNED NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    dni CHAR(8) NOT NULL,
    email VARCHAR(120) NOT NULL,
    telefono VARCHAR(20) NULL,
    password_hash VARCHAR(255) NOT NULL,
    intentos_fallidos TINYINT NOT NULL DEFAULT 0,
    bloqueado TINYINT(1) NOT NULL DEFAULT 0,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    ultimo_login DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuarios_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id),
    CONSTRAINT fk_usuarios_rol FOREIGN KEY (rol_id) REFERENCES roles(id),
    UNIQUE KEY uq_dni_agencia (agencia_id, dni),
    UNIQUE KEY uq_email_agencia (agencia_id, email)
) ENGINE=InnoDB;

CREATE TABLE sesiones (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    ip VARCHAR(45) NOT NULL,
    dispositivo VARCHAR(200) NULL,
    login_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    logout_at DATETIME NULL,
    CONSTRAINT fk_sesiones_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

CREATE TABLE logs_auditoria (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agencia_id INT UNSIGNED NOT NULL,
    usuario_id INT UNSIGNED NULL,
    accion VARCHAR(80) NOT NULL,
    tabla_afectada VARCHAR(60) NOT NULL,
    registro_id INT UNSIGNED NULL,
    valor_anterior JSON NULL,
    valor_nuevo JSON NULL,
    ip VARCHAR(45) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_log_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id),
    CONSTRAINT fk_log_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

CREATE TABLE tokens_recuperacion (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    token VARCHAR(100) NOT NULL UNIQUE,
    expira_at DATETIME NOT NULL,
    usado TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tokens_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

CREATE TABLE destinos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agencia_id INT UNSIGNED NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    descripcion TEXT NULL,
    latitud DECIMAL(10,7) NULL,
    longitud DECIMAL(10,7) NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    CONSTRAINT fk_destinos_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id),
    UNIQUE KEY uq_destino_agencia (agencia_id, nombre)
) ENGINE=InnoDB;

CREATE TABLE categorias_tour (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agencia_id INT UNSIGNED NOT NULL,
    nombre VARCHAR(80) NOT NULL,
    descripcion VARCHAR(200) NULL,
    CONSTRAINT fk_categorias_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id),
    UNIQUE KEY uq_categoria_agencia (agencia_id, nombre)
) ENGINE=InnoDB;

CREATE TABLE tours (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agencia_id INT UNSIGNED NOT NULL,
    destino_id INT UNSIGNED NOT NULL,
    categoria_id INT UNSIGNED NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT NULL,
    itinerario TEXT NULL,
    duracion_horas SMALLINT NOT NULL DEFAULT 8,
    cupo_maximo SMALLINT NOT NULL,
    -- Precios eliminados de tours: la única fuente de precios es la tabla
    -- temporadas. Cada tour tiene obligatoriamente una temporada por defecto
    -- (fecha_inicio='1900-01-01', fecha_fin='2999-12-31') que actúa como
    -- precio base. Las temporadas reales sobreescriben ese precio por rango.
    estado ENUM('activo','agotado','pausado','eliminado') NOT NULL DEFAULT 'activo',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tours_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id),
    CONSTRAINT fk_tours_destino FOREIGN KEY (destino_id) REFERENCES destinos(id),
    CONSTRAINT fk_tours_categoria FOREIGN KEY (categoria_id) REFERENCES categorias_tour(id)
) ENGINE=InnoDB;

CREATE TABLE tour_imagenes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tour_id INT UNSIGNED NOT NULL,
    url VARCHAR(300) NOT NULL,
    es_principal TINYINT(1) NOT NULL DEFAULT 0,
    orden TINYINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_imagenes_tour FOREIGN KEY (tour_id) REFERENCES tours(id)
) ENGINE=InnoDB;

CREATE TABLE temporadas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agencia_id INT UNSIGNED NOT NULL,
    tour_id INT UNSIGNED NOT NULL,
    -- nombre='Base' con fecha_inicio='1900-01-01' y fecha_fin='2999-12-31'
    -- actua como precio por defecto del tour. Las demas temporadas
    -- definen rangos especificos que prevalecen sobre la base cuando
    -- la fecha_servicio de una reserva cae dentro de su rango.
    nombre VARCHAR(80) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    precio_nacional DECIMAL(10,2) NOT NULL,
    precio_extranjero DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_temporadas_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id),
    CONSTRAINT fk_temporadas_tour FOREIGN KEY (tour_id) REFERENCES tours(id),
    CONSTRAINT chk_temporada_fechas CHECK (fecha_inicio <= fecha_fin),
    UNIQUE KEY uq_temporada_tour_nombre (tour_id, nombre)
) ENGINE=InnoDB;

CREATE TABLE cupones (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agencia_id INT UNSIGNED NOT NULL,
    codigo VARCHAR(30) NOT NULL,
    descripcion VARCHAR(200) NULL,
    tipo ENUM('porcentaje','monto_fijo') NOT NULL,
    valor DECIMAL(8,2) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    usos_max SMALLINT NULL,
    usos_actuales SMALLINT NOT NULL DEFAULT 0,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    CONSTRAINT fk_cupones_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id),
    UNIQUE KEY uq_cupon_agencia (agencia_id, codigo)
) ENGINE=InnoDB;

CREATE TABLE tipos_cambio (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agencia_id INT UNSIGNED NOT NULL,
    moneda_origen CHAR(3) NOT NULL DEFAULT 'USD',
    moneda_destino CHAR(3) NOT NULL DEFAULT 'PEN',
    tasa DECIMAL(10,4) NOT NULL,
    fuente VARCHAR(60) NULL,
    fecha DATE NOT NULL,
    CONSTRAINT fk_tc_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id)
) ENGINE=InnoDB;

CREATE TABLE paises (
    id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE,
    codigo_iso CHAR(2) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE turistas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agencia_id INT UNSIGNED NOT NULL,
    tipo_doc ENUM('DNI','Pasaporte','CE','RUC') NOT NULL,
    documento VARCHAR(20) NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    apellidos VARCHAR(80) NOT NULL,
    email VARCHAR(120) NULL,
    celular VARCHAR(20) NULL,
    fecha_nacimiento DATE NULL,
    pais_id SMALLINT UNSIGNED NULL,
    restricciones_medicas TEXT NULL,
    notas_crm TEXT NULL,
    segmento ENUM('normal','frecuente','vip') NOT NULL DEFAULT 'normal',
    password_hash VARCHAR(255) NULL,
    email_verificado TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_turistas_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id),
    CONSTRAINT fk_turistas_pais FOREIGN KEY (pais_id) REFERENCES paises(id),
    UNIQUE KEY uq_turista_doc_agencia (agencia_id, tipo_doc, documento)
) ENGINE=InnoDB;

CREATE TABLE reservas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agencia_id INT UNSIGNED NOT NULL,
    tour_id INT UNSIGNED NOT NULL,
    turista_id INT UNSIGNED NOT NULL,
    vendedor_id INT UNSIGNED NULL,
    cupon_id INT UNSIGNED NULL,
    fecha_servicio DATE NOT NULL,
    hora_recojo TIME NULL,
    lugar_recojo VARCHAR(200) NULL,
    num_personas SMALLINT NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    saldo_pendiente DECIMAL(10,2) NOT NULL,
    moneda CHAR(3) NOT NULL DEFAULT 'PEN',
    canal ENUM('mostrador','web') NOT NULL DEFAULT 'mostrador',
    estado ENUM('pendiente','confirmada','completada','anulada','reprogramada') NOT NULL DEFAULT 'pendiente',
    motivo_anulacion VARCHAR(300) NULL,
    codigo_qr VARCHAR(100) NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reservas_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id),
    CONSTRAINT fk_reservas_tour FOREIGN KEY (tour_id) REFERENCES tours(id),
    CONSTRAINT fk_reservas_turista FOREIGN KEY (turista_id) REFERENCES turistas(id),
    CONSTRAINT fk_reservas_vendedor FOREIGN KEY (vendedor_id) REFERENCES usuarios(id),
    CONSTRAINT fk_reservas_cupon FOREIGN KEY (cupon_id) REFERENCES cupones(id)
) ENGINE=InnoDB;

CREATE TABLE reprogramaciones (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    reserva_id INT UNSIGNED NOT NULL,
    fecha_anterior DATE NOT NULL,
    fecha_nueva DATE NOT NULL,
    motivo VARCHAR(300) NULL,
    usuario_id INT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reprog_reserva FOREIGN KEY (reserva_id) REFERENCES reservas(id),
    CONSTRAINT fk_reprog_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

CREATE TABLE reserva_pasajeros (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    reserva_id INT UNSIGNED NOT NULL,
    turista_id INT UNSIGNED NOT NULL,
    es_titular TINYINT(1) NOT NULL DEFAULT 0,
    CONSTRAINT fk_rp_reserva FOREIGN KEY (reserva_id) REFERENCES reservas(id),
    CONSTRAINT fk_rp_turista FOREIGN KEY (turista_id) REFERENCES turistas(id)
) ENGINE=InnoDB;

CREATE TABLE cajas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agencia_id INT UNSIGNED NOT NULL,
    cajero_id INT UNSIGNED NOT NULL,
    nombre_caja VARCHAR(60) NOT NULL DEFAULT 'Caja Principal',
    monto_apertura DECIMAL(10,2) NOT NULL,
    monto_cierre_sistema DECIMAL(10,2) NULL,
    monto_cierre_real DECIMAL(10,2) NULL,
    diferencia DECIMAL(10,2) NULL,
    estado ENUM('abierta','cerrada') NOT NULL DEFAULT 'abierta',
    abierta_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cerrada_at DATETIME NULL,
    CONSTRAINT fk_cajas_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id),
    CONSTRAINT fk_cajas_cajero FOREIGN KEY (cajero_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

CREATE TABLE pagos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agencia_id INT UNSIGNED NOT NULL,
    caja_id INT UNSIGNED NOT NULL,
    reserva_id INT UNSIGNED NULL,
    cajero_id INT UNSIGNED NOT NULL,
    tipo ENUM('adelanto','saldo','pago_completo','egreso','devolucion') NOT NULL,
    metodo ENUM('efectivo','yape','plin','transferencia','tarjeta') NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    monto_recibido DECIMAL(10,2) NULL,
    vuelto DECIMAL(10,2) NULL,
    concepto VARCHAR(200) NULL,
    comprobante_ref VARCHAR(100) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pagos_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id),
    CONSTRAINT fk_pagos_caja FOREIGN KEY (caja_id) REFERENCES cajas(id),
    CONSTRAINT fk_pagos_reserva FOREIGN KEY (reserva_id) REFERENCES reservas(id),
    CONSTRAINT fk_pagos_cajero FOREIGN KEY (cajero_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

CREATE TABLE vehiculos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agencia_id INT UNSIGNED NOT NULL,
    placa VARCHAR(10) NOT NULL,
    modelo VARCHAR(80) NOT NULL,
    capacidad SMALLINT NOT NULL,
    tipo ENUM('propio','tercerizado') NOT NULL DEFAULT 'propio',
    soat_vence DATE NULL,
    revision_vence DATE NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    CONSTRAINT fk_vehiculos_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id),
    UNIQUE KEY uq_placa_agencia (agencia_id, placa)
) ENGINE=InnoDB;

CREATE TABLE mantenimientos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vehiculo_id INT UNSIGNED NOT NULL,
    tipo ENUM('preventivo','correctivo') NOT NULL,
    descripcion TEXT NULL,
    costo DECIMAL(10,2) NULL,
    fecha DATE NOT NULL,
    realizado_por VARCHAR(100) NULL,
    CONSTRAINT fk_mant_vehiculo FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id)
) ENGINE=InnoDB;

CREATE TABLE asignaciones_tour (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agencia_id INT UNSIGNED NOT NULL,
    reserva_id INT UNSIGNED NOT NULL,
    guia_id INT UNSIGNED NULL,
    chofer_id INT UNSIGNED NULL,
    vehiculo_id INT UNSIGNED NULL,
    notas VARCHAR(300) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_asig_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id),
    CONSTRAINT fk_asig_reserva FOREIGN KEY (reserva_id) REFERENCES reservas(id),
    CONSTRAINT fk_asig_guia FOREIGN KEY (guia_id) REFERENCES usuarios(id),
    CONSTRAINT fk_asig_chofer FOREIGN KEY (chofer_id) REFERENCES usuarios(id),
    CONSTRAINT fk_asig_vehiculo FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id)
) ENGINE=InnoDB;

CREATE TABLE checklists (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    asignacion_id INT UNSIGNED NOT NULL,
    usuario_id INT UNSIGNED NOT NULL,
    item VARCHAR(150) NOT NULL,
    marcado TINYINT(1) NOT NULL DEFAULT 0,
    observacion VARCHAR(200) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_check_asignacion FOREIGN KEY (asignacion_id) REFERENCES asignaciones_tour(id),
    CONSTRAINT fk_check_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

CREATE TABLE rutas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agencia_id INT UNSIGNED NOT NULL,
    tour_id INT UNSIGNED NOT NULL,
    nombre_parada VARCHAR(100) NOT NULL,
    orden TINYINT NOT NULL,
    latitud DECIMAL(10,7) NULL,
    longitud DECIMAL(10,7) NULL,
    tiempo_minutos SMALLINT NULL,
    CONSTRAINT fk_rutas_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id),
    CONSTRAINT fk_rutas_tour FOREIGN KEY (tour_id) REFERENCES tours(id)
) ENGINE=InnoDB;

CREATE TABLE incidentes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agencia_id INT UNSIGNED NOT NULL,
    reserva_id INT UNSIGNED NOT NULL,
    categoria ENUM('accidente','falla_vehicular','queja_cliente','climatico','otro') NOT NULL,
    descripcion TEXT NOT NULL,
    involucrados VARCHAR(300) NULL,
    reportado_por INT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inc_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id),
    CONSTRAINT fk_inc_reserva FOREIGN KEY (reserva_id) REFERENCES reservas(id),
    CONSTRAINT fk_inc_usuario FOREIGN KEY (reportado_por) REFERENCES usuarios(id)
) ENGINE=InnoDB;

CREATE TABLE gastos_operativos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agencia_id INT UNSIGNED NOT NULL,
    reserva_id INT UNSIGNED NOT NULL,
    concepto VARCHAR(200) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    pagado_por INT UNSIGNED NOT NULL,
    caja_id INT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_gasto_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id),
    CONSTRAINT fk_gasto_reserva FOREIGN KEY (reserva_id) REFERENCES reservas(id),
    CONSTRAINT fk_gasto_usuario FOREIGN KEY (pagado_por) REFERENCES usuarios(id),
    CONSTRAINT fk_gasto_caja FOREIGN KEY (caja_id) REFERENCES cajas(id)
) ENGINE=InnoDB;

CREATE TABLE categorias_proveedor (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agencia_id INT UNSIGNED NOT NULL,
    nombre VARCHAR(80) NOT NULL,
    CONSTRAINT fk_catprov_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id),
    UNIQUE KEY uq_catprov (agencia_id, nombre)
) ENGINE=InnoDB;

CREATE TABLE proveedores (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agencia_id INT UNSIGNED NOT NULL,
    categoria_id INT UNSIGNED NOT NULL,
    razon_social VARCHAR(150) NOT NULL,
    ruc CHAR(11) NOT NULL,
    contacto_nombre VARCHAR(100) NULL,
    telefono VARCHAR(20) NULL,
    email VARCHAR(120) NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    CONSTRAINT fk_prov_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id),
    CONSTRAINT fk_prov_categoria FOREIGN KEY (categoria_id) REFERENCES categorias_proveedor(id),
    UNIQUE KEY uq_ruc_agencia (agencia_id, ruc)
) ENGINE=InnoDB;

CREATE TABLE servicios_proveedor (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agencia_id INT UNSIGNED NOT NULL,
    proveedor_id INT UNSIGNED NOT NULL,
    reserva_id INT UNSIGNED NULL,
    descripcion VARCHAR(200) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_servicio DATE NOT NULL,
    estado ENUM('pendiente','pagado') NOT NULL DEFAULT 'pendiente',
    fecha_pago DATE NULL,
    CONSTRAINT fk_sp_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id),
    CONSTRAINT fk_sp_proveedor FOREIGN KEY (proveedor_id) REFERENCES proveedores(id),
    CONSTRAINT fk_sp_reserva FOREIGN KEY (reserva_id) REFERENCES reservas(id)
) ENGINE=InnoDB;

CREATE TABLE equipos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agencia_id INT UNSIGNED NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    cantidad_total SMALLINT NOT NULL DEFAULT 0,
    cantidad_disponible SMALLINT NOT NULL DEFAULT 0,
    stock_minimo SMALLINT NOT NULL DEFAULT 2,
    ubicacion VARCHAR(100) NULL,
    CONSTRAINT fk_equipos_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id)
) ENGINE=InnoDB;

CREATE TABLE asignacion_equipos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    asignacion_id INT UNSIGNED NOT NULL,
    equipo_id INT UNSIGNED NOT NULL,
    cantidad SMALLINT NOT NULL DEFAULT 1,
    devuelto TINYINT(1) NOT NULL DEFAULT 0,
    CONSTRAINT fk_ae_asignacion FOREIGN KEY (asignacion_id) REFERENCES asignaciones_tour(id),
    CONSTRAINT fk_ae_equipo FOREIGN KEY (equipo_id) REFERENCES equipos(id)
) ENGINE=InnoDB;

CREATE TABLE reseñas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agencia_id INT UNSIGNED NOT NULL,
    tour_id INT UNSIGNED NOT NULL,
    turista_id INT UNSIGNED NOT NULL,
    reserva_id INT UNSIGNED NOT NULL UNIQUE,
    calificacion TINYINT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT NULL,
    visible TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reseñas_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id),
    CONSTRAINT fk_reseñas_tour FOREIGN KEY (tour_id) REFERENCES tours(id),
    CONSTRAINT fk_reseñas_turista FOREIGN KEY (turista_id) REFERENCES turistas(id),
    CONSTRAINT fk_reseñas_reserva FOREIGN KEY (reserva_id) REFERENCES reservas(id)
) ENGINE=InnoDB;

CREATE TABLE notificaciones (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agencia_id INT UNSIGNED NOT NULL,
    turista_id INT UNSIGNED NULL,
    usuario_id INT UNSIGNED NULL,
    tipo ENUM('confirmacion_reserva','recordatorio_24h','anulacion','comunicado') NOT NULL,
    destinatario VARCHAR(120) NOT NULL,
    asunto VARCHAR(200) NOT NULL,
    cuerpo TEXT NOT NULL,
    enviado TINYINT(1) NOT NULL DEFAULT 0,
    enviado_at DATETIME NULL,
    error VARCHAR(300) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id),
    CONSTRAINT fk_notif_turista FOREIGN KEY (turista_id) REFERENCES turistas(id),
    CONSTRAINT fk_notif_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

INSERT INTO planes (nombre, max_usuarios, modulos, precio_mes) VALUES
('Básico', 3, '["reservas","caja","clientes"]', 0.00),
('Estándar', 10, '["reservas","caja","clientes","inventario","reportes"]', 150.00),
('Premium', 999, '["all"]', 300.00);

INSERT INTO paises (nombre, codigo_iso) VALUES
('Perú','PE'),('Estados Unidos','US'),('Francia','FR'),('Alemania','DE'),
('España','ES'),('Brasil','BR'),('Chile','CL'),('Colombia','CO'),
('Argentina','AR'),('México','MX'),('Reino Unido','GB'),('Italia','IT'),
('Japón','JP'),('China','CN'),('Israel','IL'),('Australia','AU'),
('Canadá','CA'),('Ecuador','EC'),('Bolivia','BO'),('Uruguay','UY');

INSERT INTO parametros_globales (clave, valor, descripcion) VALUES
('tipo_cambio_usd', '3.75', 'Tipo de cambio USD a PEN'),
('moneda_default', 'PEN', 'Moneda predeterminada'),
('iva_porcentaje', '18', 'IGV aplicable'),
('reserva_bloqueo_min', '10', 'Minutos de bloqueo cupo online');

SET FOREIGN_KEY_CHECKS = 1;
-- ─────────────────────────────────────────────────────────────────────────────
-- NOTA DE USO: Consulta del precio vigente de un tour para una fecha dada
-- Usar esta lógica en el backend/frontend al crear una reserva:
--
--   SELECT precio_nacional, precio_extranjero
--   FROM temporadas
--   WHERE tour_id = ?
--     AND fecha_inicio <= :fecha_servicio
--     AND fecha_fin    >= :fecha_servicio
--   ORDER BY fecha_inicio DESC   -- la temporada más específica gana
--   LIMIT 1;
--
-- La temporada 'Base' (1900-01-01 a 2999-12-31) siempre hace de fallback.
-- ─────────────────────────────────────────────────────────────────────────────
