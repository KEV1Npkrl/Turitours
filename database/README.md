# Base de datos — turismo_tarapoto

Esquema MySQL oficial del **Sistema Estandar de Gestion Turistica — Tarapoto**.

## Archivo

- `bd_turismo_tarapoto.sql` — crea la BD `turismo_tarapoto` con todas las tablas del informe de requerimientos.

## Importar en XAMPP

1. Abre phpMyAdmin: `http://localhost/phpmyadmin`
2. Importa `bd_turismo_tarapoto.sql`
3. Verifica que exista la BD `turismo_tarapoto`

## Relacion con el frontend

El mock en `public/js/data.js` replica la estructura de estas tablas para el **Modelo Cliente**:

- `agencias`, `destinos`, `categorias_tour`, `tours`, `tour_imagenes`
- `turistas`, `reservas`, `resenas`, `temporadas`, `cupones`, `paises`

Cuando el backend Java este listo, los endpoints REST devolveran los mismos campos.

## Multitenancy

Todas las tablas operativas incluyen `agencia_id`. El portal publico actual usa `agencia_id = 1` (Turi Tours).
