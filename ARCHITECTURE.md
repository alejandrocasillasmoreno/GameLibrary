# Arquitectura del Proyecto - GameLibrary

## Patrón MVC (Modelo-Vista-Controlador)

Esta aplicación sigue el patrón MVC para separar claramente la lógica de negocio de la presentación.

### Modelo (Model)
**Ubicación:** `backend/src/models/`

- **userModel.js**: Gestiona la entidad Usuario
- **gameModel.js**: Gestiona la entidad Juego  
- **libraryModel.js**: Gestiona la entidad Biblioteca (relación usuario-juego)
- **reviewModel.js**: Gestiona la entidad Reseña

**Responsabilidades:**
- Definición de esquemas de base de datos
- Validación de datos
- Operaciones CRUD básicas
- Relaciones entre entidades

### Vista (View)
**Ubicación:** `frontend/src/components/`

- **Login.jsx**: Formulario de autenticación
- **Register.jsx**: Formulario de registro
- **Catalog.jsx**: Catálogo de juegos con búsqueda
- **MyLibrary.jsx**: Panel de gestión de biblioteca
- **Dashboard.jsx**: Estadísticas y métricas
- **GameDetail.jsx**: Detalle de juego con reseñas

**Responsabilidades:**
- Interfaz de usuario
- Interacción con el usuario
- Presentación de datos
- Validación de formularios

### Controlador (Controller)
**Ubicación:** `backend/src/controllers/`

- **authController.js**: Controla autenticación y registro
- **gameController.js**: Controla operaciones de juegos
- **libraryController.js**: Controla operaciones de biblioteca
- **reviewController.js**: Controla operaciones de reseñas

**Responsabilidades:**
- Recibir solicitudes HTTP
- Validar datos de entrada
- Coordinar con servicios y modelos
- Devolver respuestas HTTP

## Arquitectura por Capas

### Capa de Rutas (Routes)
**Ubicación:** `backend/src/routes/`

- **authRoutes.js**: Rutas de autenticación
- **gameRoutes.js**: Rutas de juegos
- **libraryRoutes.js**: Rutas de biblioteca
- **reviewRoutes.js**: Rutas de reseñas

**Responsabilidades:**
- Definir endpoints REST
- Aplicar middleware de autenticación
- Enrutar solicitudes a controladores

### Capa de Servicios (Services)
**Ubicación:** `backend/src/services/`

- **authService.js**: Lógica de autenticación
- **gameService.js**: Lógica de juegos
- **libraryService.js**: Lógica de biblioteca
- **reviewService.js**: Lógica de reseñas

**Responsabilidades:**
- Lógica de negocio
- Validaciones complejas
- Comunicación con múltiples modelos
- Procesamiento de datos

### Capa de Datos (Data Access)
**Ubicación:** `backend/src/models/`

**Responsabilidades:**
- Conexión a base de datos
- Consultas SQL
- Mapeo de resultados
- Gestión de transacciones

## Frontend Architecture

### Context API
**Ubicación:** `frontend/src/context/AuthContext.jsx`

**Responsabilidades:**
- Gestión global de estado de autenticación
- Persistencia de sesión
- Proveer datos a componentes hijos

### Servicios Frontend
**Ubicación:** `frontend/src/services/`

- **gameService.js**: Comunicación con API de juegos
- **libraryService.js**: Comunicación con API de biblioteca

**Responsabilidades:**
- Llamadas HTTP a backend
- Manejo de errores
- Formateo de datos

## Base de Datos

### Modelo Relacional

```sql
-- Usuarios (Entidad Principal)
users {
  id: PK
  name: VARCHAR
  email: VARCHAR UNIQUE
  password: VARCHAR (hashed)
  created_at: TIMESTAMP
}

-- Juegos (Entidad Principal)
games {
  id: PK
  title: VARCHAR
  description: TEXT
  genre: VARCHAR
  platform: VARCHAR
  image_url: VARCHAR
  released_date: DATE
}

-- Biblioteca (Entidad Relacional)
user_library {
  id: PK
  user_id: FK(users.id)
  game_id: FK(games.id)
  status: ENUM('pending', 'playing', 'completed', 'dropped')
  rating: INT(0-10)
  hours_played: INT
  added_at: TIMESTAMP
}

-- Reseñas (Entidad Secundaria)
reviews {
  id: PK
  user_id: FK(users.id)
  game_id: INT (RAWG ID)
  rating: INT(1-5)
  comment: TEXT
  created_at: TIMESTAMP
}
```

### Relaciones

1. **Usuarios → Biblioteca**: One-to-Many
2. **Juegos → Biblioteca**: One-to-Many  
3. **Usuarios → Reseñas**: One-to-Many
4. **Juegos (RAWG) → Reseñas**: One-to-Many

## Seguridad Implementada

### Autenticación JWT
- Tokens con expiración de 24 horas
- Middleware de verificación
- Protección de rutas sensibles

### Validación de Datos
- Validación de emails con regex
- Contraseñas encriptadas con bcryptjs
- Validación de rangos (rating 0-10, etc.)

### Autorización
- Verificación de propietario en operaciones
- Acceso restringido a datos personales
- Protección contra ataques CSRF

## Flujo de Datos

### Registro de Usuario
1. Vista → Formulario de registro
2. Frontend → Validación de datos
3. Frontend → Llamada a API
4. Backend → Validación y encriptación
5. Backend → Guardar en base de datos
6. Backend → Devolver token JWT
7. Frontend → Almacenar token y redirigir

### Gestión de Biblioteca
1. Vista → Selección de juego
2. Frontend → Llamada a API con token
3. Backend → Verificar autenticación
4. Backend → Validar permisos
5. Backend → Operación en base de datos
6. Backend → Devolver resultado
7. Frontend → Actualizar estado y UI

## Mejoras de Rendimiento

### Backend
- Conexión única a base de datos
- Consultas SQL optimizadas
- Middleware de compresión

### Frontend
- Carga diferida de componentes
- Caché de datos en memoria
- Optimización de renders

## Testing

### Backend Tests
**Ubicación:** `backend/app.test.js`

- Pruebas de endpoints básicos
- Pruebas de autenticación
- Pruebas de validación

### Frontend Tests
- Componentes React testeados
- Pruebas de integración
- Pruebas de usuario

## Despliegue

### Entorno de Desarrollo
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`
- Base de datos: XAMPP MySQL

### Entorno de Producción
- Backend: Node.js server
- Frontend: Build estático
- Base de datos: MySQL/MariaDB
- Reverse proxy: Nginx/Apache

## Cumplimiento de Requisitos Académicos

✅ **Separación clara de lógica de negocio y presentación**
✅ **Patrón MVC implementado**
✅ **Arquitectura por capas (Rutas, Controladores, Servicios, Modelos)**
✅ **Base de datos relacional con relaciones**
✅ **API REST completa**
✅ **Autenticación segura**
✅ **CRUD completo**
✅ **Validación de datos**
✅ **Manejo de errores**
✅ **Documentación del código**
✅ **Estructura de proyecto organizada**