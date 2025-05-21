### Event Management Platform ###

Plataforma integral para la gestión de eventos, con backend en Node.js (Clean Architecture, principios SOLIYD PostgreSQL) y frontend en React (TailwindCSS). Incluye autenticación, registro, administración de eventos, reservas y carga masiva desde Excel.

## Tabla de Contenidos #

- Descripción General
- Tecnologías
- Estructura del Proyecto
- Instalación y Puesta en Marcha
- Modelado de Base de Datos
- Funcionalidades Principales
- Documentación Swagger
- Buenas Prácticas y Seguridad
- Créditos

## Descripción General ##

# Esta plataforma permite #

- Registro y login de usuarios/organizadores con roles diferenciados.
- Gestión de eventos (crear, listar, actualizar, eliminar) solo para organizadores autenticados.
- Reservas de eventos para usuarios, con validación de cupos y cancelación.
- Visualización pública de eventos disponibles.
- Carga masiva de eventos vía archivo Excel.
- Interfaz moderna y responsiva con dashboards separados por rol.

## Tecnologías ##

# Backend #

- Node.js (Clean Architecture)
- Express.js
- PostgreSQL (Base de datos relacional)
- Swagger (documentación interactiva)
- Joi, bcrypt, JWT, dotenv, multer, xlsx

# Frontend #

- React 18+
- React Router v6
- TailwindCSS (con PostCSS)
- Axios

## Estructura del Proyecto ##

```bash
/backend
  ├── src/
  │   ├── app/               # Casos de uso y lógica de negocio
  │   ├── config/            # Configuración general (DB, Swagger, etc.)
  │   ├── domain/            # Modelos y entidades
  │   ├── infrastructure/    # Repositorios, servicios externos
  │   ├── interfaces/
  │   │   └── routes/        # Rutas y controladores API
  │   └── shared/            # Helpers y utilidades
  ├── .env                   # Variables de entorno
  └── ...
/frontend
  ├── src/
  │   ├── components/        # Componentes reutilizables
  │   ├── pages/             # Vistas principales
  │   └── App.js             # Configuración de rutas
  └── ...
  ```

  ## Instalación y Puesta en Marcha ##

  1. Clonar el repositorio

```bash
  git clone <https://github.com/JhonBobadilla/event-management-platform>
```

  2. Configurar el Backend

```bash
    cd backend
    
    # PORT=3000
    # DATABASE_URL=postgresql
    # JWT_SECRET=<**********>
    
    node src/index.js
```
  3. Configurar el Frontend

```bash
    cd frontend
    
    # PORT=3001
        
    node npm start
```

- Backend corre en: http://localhost:3000
- Frontend corre en: http://localhost:3001

## Modelado de Base de Datos ##

```sql
-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(30),
    numero_documento VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('organizador', 'usuario')),
    creado_en TIMESTAMP DEFAULT NOW()
);

-- Tabla de eventos
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    nombre_evento VARCHAR(100) NOT NULL,
    tipo_evento VARCHAR(30) NOT NULL CHECK (tipo_evento IN ('educativo', 'empresarial', 'deportivo', 'artístico')),
    modalidad VARCHAR(15) NOT NULL CHECK (modalidad IN ('virtual', 'presencial')),
    descripcion TEXT,
    ciudad VARCHAR(50),
    direccion VARCHAR(200),
    telefono_contacto VARCHAR(30),
    requisitos TEXT,
    cupo_maximo INT NOT NULL,
    cupo_actual INT DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'disponible',
    organizador_id INT REFERENCES users(id) ON DELETE CASCADE,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    event_id INT REFERENCES events(id) ON DELETE CASCADE,
    fecha_reserva TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, event_id)
);
```

## Funcionalidades Principales ##

- Backend (Node.js + PostgreSQL)
- Backend (Node.js + PostgreSQL)
- Autenticación y autorización JWT.
- Registro y login para usuarios y organizadores.
- CRUD completo de eventos (solo organizadores).
- Gestión de reservas (solo usuarios, con cancelación).
- Listado público de eventos disponibles.
- Carga masiva de eventos por Excel (.xlsx).
- Documentación Swagger (http://localhost:3000/api-docs).
- Frontend (React)
- Registro/Login en una sola página (AuthPage).
- Dashboards diferenciados por rol (usuario/organizador).
- Navegación protegida según autenticación.
- Validación y feedback de formularios.
- Estilo profesional y responsivo con TailwindCSS.
- Gestión de sesión vía localStorage.
- Prueba todos los endpoints directamente desde la interfaz.
- Consulta detalles de parámetros, ejemplos y flujos de autenticación.
- Buenas Prácticas y Seguridad


- Contraseñas: Se almacenan de forma segura con bcrypt.
- JWT: Todas las rutas protegidas requieren token válido.
- CORS: Configurado para permitir interacción frontend-backend en local.

# Créditos #

Desarrollado por: <Jhon Alexander Bobadilla Lombana>
