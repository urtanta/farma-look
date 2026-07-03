# Farmacias de Guardia 🏥

Buscador de farmacias de guardia - Encuentra las farmacias disponibles fuera del horario normal.

## 📋 Descripción

Este proyecto proporciona una plataforma para consultar qué farmacias están de guardia en diferentes provincias. Utiliza web scraping para recopilar información actualizada de múltiples fuentes.

## 🚀 Características

- Búsqueda de farmacias de guardia por provincia
- Información de horarios y ubicación
- API REST para integración
- Web scraping automático de datos

## 📁 Estructura del Proyecto

Ver `docs/arquitectura.md` para más detalles.

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone https://github.com/urtanta/farma-look.git

# Instalar dependencias
cd farmacias-guardia
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor
npm start
```

## 📝 Configuración

Edita el archivo `.env` con tus credenciales de Supabase:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
PORT=3000
```

## 🔌 API Endpoints

- `GET /api/guardias` - Obtener todas las farmacias de guardia
- `GET /api/guardias/:province` - Obtener farmacias de guardia por provincia

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

ISC
