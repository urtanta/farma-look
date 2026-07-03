# Arquitectura - Farmacias de Guardia

## Descripción General
Este proyecto es un buscador de farmacias de guardia que proporciona información sobre qué farmacias están disponibles fuera del horario normal.

## Estructura del Proyecto

### Frontend (`public/`)
- `index.html` - Página principal
- `styles.css` - Estilos del aplicativo
- `app.js` - Lógica del cliente

### Backend (`backend/`)
- `server.js` - Servidor Express principal
- `config.js` - Configuración global
- `db/supabase.js` - Conexión a base de datos
- `routes/guardias.js` - Rutas API
- `scrapers/` - Web scrapers para obtener datos
- `services/` - Servicios de negocio

### Base de Datos (`database/`)
- `schema.sql` - Esquema de base de datos

## Stack Tecnológico
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Base de Datos: Supabase (PostgreSQL)
- Scraping: Custom web scrapers
