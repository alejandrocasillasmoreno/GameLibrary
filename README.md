# 🎮 GameLibrary - Gestor Personal de Juegos

Una aplicación web completa para gestionar tu biblioteca de videojuegos, con autenticación segura, catálogo de juegos y estadísticas personalizadas.

## ✨ Características

### 🔐 Autenticación & Seguridad
- Registro con validación de email y contraseña
- Login seguro con tokens JWT
- Contraseñas encriptadas con bcryptjs
- Tokens con expiración de 24 horas

### 🎮 Catálogo de Juegos
- Más de 100 juegos disponibles
- Búsqueda por título o género en tiempo real
- Información detallada de cada juego
- Imágenes descargadas automáticamente

### 📚 Biblioteca Personal
- Agregar/eliminar juegos
- Cambiar estado: Pendiente, Jugando, Completado, Abandonado
- Calificar juegos de 0-10 con slider intuitivo
- Actualizar información al instante

### 📊 Dashboard & Estadísticas
- Horas totales de juego
- Total de juegos en biblioteca
- Juegos completados
- Tasa de finalización
- Gráfico interactivo (Pie Chart)

### 🎨 Diseño Moderno
- Interfaz responsiva y mobile-friendly
- Gradientes y efectos visuales
- Paleta de colores profesional
- Animaciones suaves y transiciones

---

## 🏗️ Stack Tecnológico

### Backend
- **Node.js** - Servidor JavaScript
- **Express.js** - Framework web
- **MySQL** - Base de datos relacional
- **bcryptjs** - Encriptación de contraseñas
- **jsonwebtoken** - Autenticación JWT
- **CORS** - Control de acceso

### Frontend
- **React** - Librería UI
- **Vite** - Bundler rápido
- **React Router** - Navegación
- **Axios/Fetch** - HTTP requests
- **Chart.js** - Gráficos
- **React Hot Toast** - Notificaciones
- **CSS3** - Estilos modernos

### Base de Datos
- **MySQL/MariaDB** - XAMPP
- **3 tablas:** users, games, user_library
- **Relaciones:** Foreign Keys
- **Integridad:** Constraints

---

## 📋 Requisitos

- Node.js (v14+)
- XAMPP con MySQL y Apache
- npm (viene con Node.js)

---

## 🚀 Instalación

### 1. Clonar/Descargar el Proyecto
```bash
cd GameLibrary_Final
```

### 2. Crear Base de Datos
1. Abre phpMyAdmin: `http://localhost/phpmyadmin`
2. Copia y ejecuta el contenido de `database.sql`

### 3. Instalar Backend
```bash
npm install
node app.js
```
✅ Servidor en `http://localhost:3000`

### 4. Instalar Frontend
```bash
cd frontend
npm install
npm run dev
```
✅ Aplicación en `http://localhost:5173`

---

## � Usuarios de Prueba

Después de ejecutar `database.sql`, puedes probar la aplicación con estos usuarios:

### Usuario 1
- **Email:** demo@test.com
- **Contraseña:** demo123

### Usuario 2 (Crear nuevo)
Puedes registrarte directamente desde la aplicación:
1. Haz clic en **"Regístrate"**
2. Completa el formulario
3. ¡Listo! Tu biblioteca estará lista

---

## �📁 Estructura del Proyecto

```
GameLibrary_Final/
├── app.js                  # Servidor Express (Backend)
├── db.js                   # Configuración de BD
├── seed.js                 # Script para cargar juegos
├── database.sql            # Script BD completo
├── package.json            # Dependencias backend
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Componente principal
│   │   ├── App.css         # Estilos globales
│   │   ├── main.jsx        # Punto entrada React
│   │   ├── components/
│   │   │   ├── Login.jsx       # Autenticación
│   │   │   ├── Register.jsx    # Registro
│   │   │   ├── Catalog.jsx     # Catálogo + búsqueda
│   │   │   ├── MyLibrary.jsx   # Biblioteca personal
│   │   │   └── Dashboard.jsx   # Estadísticas
│   │   └── assets/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── GUIA_CONFIGURACION.md
├── INICIO_RAPIDO.md
└── README.md
```

---

## 🔌 Rutas de API

### Autenticación
- `POST /api/auth/register` - Crear cuenta
- `POST /api/auth/login` - Iniciar sesión

### Juegos (Público)
- `GET /api/games` - Obtener catálogo
- `GET /api/games/:id` - Detalles de un juego

### Biblioteca (Protegido)
- `POST /api/user/library` - Añadir juego
- `GET /api/user/library` - Obtener mi biblioteca
- `PUT /api/user/library/:gameId` - Actualizar juego
- `DELETE /api/user/library/:gameId` - Eliminar juego

### Estadísticas (Protegido)
- `GET /api/user/stats` - Obtener estadísticas

---

## 🔐 Seguridad Implementada

- ✅ Validación de emails con regex
- ✅ Validación de contraseñas (mín. 6 caracteres)
- ✅ Confirmación de contraseña en registro
- ✅ Hash de contraseñas con bcryptjs
- ✅ Tokens JWT con expiración
- ✅ Middleware de autenticación
- ✅ Verificación de propietario en operaciones
- ✅ Email único en la BD
- ✅ CORS configurado

---

## 📊 Modelos de Datos

### Users
```sql
- id (PK)
- name (VARCHAR)
- email (UNIQUE)
- password (HASH)
- created_at
- updated_at
```

### Games
```sql
- id (PK)
- title
- description
- genre
- platform
- image_url
- released_date
```

### User_Library
```sql
- id (PK)
- user_id (FK)
- game_id (FK)
- status (pending, playing, completed, dropped)
- rating (0-10)
- hours_played
- added_at
- updated_at
```

---

## 🎯 Casos de Uso

1. **Nuevo Usuario**: Registro → Login → Ver Catálogo → Añadir Juegos
2. **Gamer Activo**: Dashboard → Buscar Juegos → Añadir → Calificar
3. **Tracking**: Ver biblioteca → Cambiar estado → Ver estadísticas

---

## 🚨 Troubleshooting

### Puerto 3000 en uso
```bash
netstat -ano | findstr :3000  # Windows
lsof -i :3000                  # Mac/Linux
```

### BD no conecta
- Verifica que XAMPP MySQL esté running
- Comprueba la contraseña en `app.js`

### Juegos no aparecen
```bash
node seed.js  # Cargar desde RAWG API
```

### Módulos no encontrados
```bash
npm install  # Reinstalar dependencias
```

---

## 📝 Variables de Entorno

Crea `.env` (opcional):
```
JWT_SECRET=tu_secreto_aqui
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=gamelibrary
PORT=3000
```

---

## 🎨 Paleta de Colores

| Nombre | Hex | Uso |
|--------|-----|-----|
| Primario | #e94560 | Botones, CTA |
| Secundario | #f39c12 | Acentos |
| Fondo Oscuro | #1a1a2e | Fondo principal |
| Blanco | #ffffff | Tarjetas |
| Verde | #27ae60 | Éxito |
| Rojo | #e74c3c | Peligro |

---

## 📱 Responsive Design

- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (< 768px)

---

## 🔄 Estado del Proyecto

- ✅ Backend completamente funcional
- ✅ Frontend responsivo
- ✅ BD normalizada
- ✅ Autenticación segura
- ✅ Búsqueda funcionando
- ✅ Estadísticas en tiempo real
- ✅ Validaciones completas

---

## 🚀 Mejoras Futuras

- [ ] Subida de imágenes personalizadas
- [ ] Historial de cambios
- [ ] Exportar estadísticas (PDF/CSV)
- [ ] Sistema de comentarios
- [ ] Social features (compartir lista)
- [ ] Dark mode
- [ ] Notificaciones por email
- [ ] Sincronización con Steam

---

## 👨‍💻 Autor

GameLibrary v1.0 - 2025

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la Licencia ISC.

---

## 📞 Soporte

Para problemas, consulta:
1. `GUIA_CONFIGURACION.md` - Configuración detallada
2. `INICIO_RAPIDO.md` - Guía rápida
3. Console de navegador (F12)
4. Terminal del servidor

---

**¡Disfruta organizando tu biblioteca de juegos!** 🎮🚀
