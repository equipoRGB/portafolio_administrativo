# Portfolio Full-Stack

Portafolio Full-Stack desarrollado como proyecto de aprendizaje y demostración profesional.

Este proyecto está dividido en un frontend desarrollado con React y un backend desarrollado con Express, compartiendo una arquitectura consistente y preparada para crecer de forma progresiva.

---

# Tecnologías

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React Hook Form
- Zod

## Backend

- Node.js
- Express
- TypeScript
- PostgreSQL
- pg

---

# Estructura del proyecto

```text
portafolio_rgb/

├── frontend/
├── backend/
├── shared/
├── database/
│   ├── migrations/
│   └── scripts/
│
├── README.MD
└── .gitignore
```

---

# Requisitos

- Node.js LTS
- npm
- PostgreSQL
- Git

---

# Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd portafolio_rgb
```

### 2. Instalar dependencias

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# Shared (esquemas compartidos)
cd ../shared
npm install
```

### 3. Configurar variables de entorno

En la carpeta `backend/` crear un archivo `.env` basado en el ejemplo:

```bash
cp backend/.env.example backend/.env
```

Editar `backend/.env` con tus credenciales reales:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=portafolio
DB_USER=postgres
DB_PASSWORD=tu_password

JWT_SECRET=tu_secreto_jwt

CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 4. Crear la base de datos

Ejecutar los scripts SQL en orden secuencial desde la carpeta `database/migrations/`:

```bash
psql -U postgres -d portafolio -f database/migrations/001_crear_usuarios.sql
psql -U postgres -d portafolio -f database/migrations/002_crear_informacion_general.sql
psql -U postgres -d portafolio -f database/migrations/003_crear_experiencias.sql
psql -U postgres -d portafolio -f database/migrations/004_crear_categorias.sql
psql -U postgres -d portafolio -f database/migrations/005_crear_herramientas.sql
psql -U postgres -d portafolio -f database/migrations/006_crear_proyectos.sql
psql -U postgres -d portafolio -f database/migrations/007_crear_mensajes.sql
```

O ejecutar todos de una sola vez:

```bash
psql -U postgres -d portafolio -f database/migrations/001_crear_usuarios.sql -f database/migrations/002_crear_informacion_general.sql -f database/migrations/003_crear_experiencias.sql -f database/migrations/004_crear_categorias.sql -f database/migrations/005_crear_herramientas.sql -f database/migrations/006_crear_proyectos.sql -f database/migrations/007_crear_mensajes.sql
```

### 5. Crear usuario administrador

Ejecutar el script seed para crear el usuario admin por defecto (`admin` / `admin123`):

```bash
cd backend
npm run seed
```

Este script crea el usuario con contraseña encriptada. Si el usuario ya existe, no se duplica.

### 6. Ejecutar el proyecto

```bash
# Backend (terminal 1)
cd backend
npm run dev

# Frontend (terminal 2)
cd frontend
npm run dev
```

El frontend se ejecuta en `http://localhost:5173` y el backend en `http://localhost:3000`.

---

# Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del servidor backend |
| `DB_HOST` | Host de PostgreSQL |
| `DB_PORT` | Puerto de PostgreSQL |
| `DB_NAME` | Nombre de la base de datos |
| `DB_USER` | Usuario de PostgreSQL |
| `DB_PASSWORD` | Contraseña de PostgreSQL |
| `JWT_SECRET` | Secreto para firmar tokens JWT |
| `CLOUDINARY_CLOUD_NAME` | Nombre del cloud de Cloudinary |
| `CLOUDINARY_API_KEY` | API key de Cloudinary |
| `CLOUDINARY_API_SECRET` | API secret de Cloudinary |

---

# Migraciones

Las migraciones se encuentran en `database/migrations/` y están numeradas secuencialmente:

| Archivo | Tabla |
|---------|-------|
| `001_crear_usuarios.sql` | `usuarios` |
| `002_crear_informacion_general.sql` | `informacion_general` |
| `003_crear_experiencias.sql` | `experiencias` |
| `004_crear_categorias.sql` | `categorias` |
| `005_crear_herramientas.sql` | `herramientas` |
| `006_crear_proyectos.sql` | `proyectos` |
| `007_crear_mensajes.sql` | `mensajes` |

Usan `CREATE TABLE IF NOT EXISTS` por lo que son seguros de ejecutar múltiples veces.

---
