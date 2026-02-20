# 🚀 QUICK START - GAMELIBRARY

## 📋 Requisitos Previos

- ✅ Node.js instalado
- ✅ XAMPP corriendo (MySQL en localhost:3306)
- ✅ Puertos 3000 y 5173 libres

---

## ⚡ Pasos Rápidos (5 minutos)

### 1️⃣ Instalación de Dependencias (Una sola vez)

```bash
cd c:\Users\Ceratulk\Desktop\GameLibrary

# Instala todas las dependencias
npm run install-all
```

**Esto instala:**
- Backend: express, mysql2, bcryptjs, cors
- Frontend: react, react-router-dom, react-hot-toast, axios

---

### 2️⃣ Inicializar Base de Datos (Una sola vez)

```bash
cd backend

# Crea las tablas
node init-db.js

# Carga 12 juegos con imágenes RAWG
node seed-games.js

cd ..
```

**Se verá así:**
```
✅ Conectado a MySQL correctamente
✅ Base de datos inicializada correctamente!
   ✓ users
   ✓ games
   ✓ user_library

🌱 Cargando juegos a la base de datos...
✅ The Witcher 3: Wild Hunt
✅ Baldur's Gate 3
... (12 juegos totales)
✅ Base de datos populada correctamente
```

---

### 3️⃣ Ejecutar el Backend

**Terminal 1:**
```bash
npm run dev-backend
```

**Verás:**
```
✅ Servidor Backend listo en http://localhost:3000
📍 Prueba salud: http://localhost:3000/api/health
📍 Prueba BD: http://localhost:3000/api/db-test
```

---

### 4️⃣ Ejecutar el Frontend

**Terminal 2 (Nueva ventana):**
```bash
npm run dev-frontend
```

**Verás:**
```
  VITE v7.2.5 running at:

  ➜  Local:   http://localhost:5173/
```

---

## 🎮 ¡LISTO! Abre el navegador

```
http://localhost:5173
```

---

## 📝 Cuenta de Prueba

```
Email:    demo@test.com
Password: (cualquiera, es solo demostración)
```

O crea una nueva cuenta con el botón **"Crear cuenta gratis"**

---

## 🔍 Páginas Disponibles

| URL | Descripción |
|-----|------------|
| http://localhost:5173/ | Login (inicio) |
| http://localhost:5173/register | Registro |
| http://localhost:5173/catalog | Catálogo de juegos (requiere login) |
| http://localhost:5173/library | Mi biblioteca (requiere login) |
| http://localhost:5173/dashboard | Estadísticas (requiere login) |

---

## ⚙️ Solución de Problemas

### ❌ "No se puede conectar a MySQL"
```
Solución: Abre XAMPP y start MySQL/Apache
```

### ❌ "Puerto 3000 ya está en uso"
```
Solución: Cierra otras aplicaciones o usa:
node backend/app.js
```

### ❌ "Las imágenes no cargan"
```
Solución: Haz hard refresh (Ctrl+Shift+R)
o limpia localStorage del navegador
```

### ❌ "Error de CORS"
```
Solución: Asegúrate que el backend esté corriendo
en http://localhost:3000
```

---

## 🧪 Probar Endpoints (Opcional)

Con **Postman** o **curl**:

```bash
# Salud del servidor
curl http://localhost:3000/api/health

# Prueba BD
curl http://localhost:3000/api/db-test

# Obtener juegos
curl http://localhost:3000/api/games

# Buscar juego
curl "http://localhost:3000/api/games?query=witcher"

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@test.com","password":"test"}'
```

---

## 📊 Estructura Base de Datos

```sql
-- Usuarios
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
)

-- Juegos disponibles
CREATE TABLE games (
  id INT PRIMARY KEY,
  title VARCHAR(255),
  description LONGTEXT,
  genre VARCHAR(255),
  platform VARCHAR(255),
  image_url LONGTEXT,
  rating DECIMAL(3,2)
)

-- Biblioteca del usuario
CREATE TABLE user_library (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  game_id INT,
  titulo VARCHAR(255),
  imagen_url LONGTEXT,
  plataforma VARCHAR(100),
  status ENUM('pending','playing','completed','dropped')
)
```

---

## 📱 Características

- ✅ Crear cuenta / Login
- ✅ Ver catálogo de 12 juegos
- ✅ Buscar juegos por nombre
- ✅ Añadir juegos a mi biblioteca
- ✅ Ver mis juegos guardados
- ✅ Ver estadísticas
- ✅ Imágenes RAWG en alta definición
- ✅ Notificaciones toast elegantes

---

## 🛠️ Tech Stack

**Frontend:**
- React 19
- Vite 7
- React Router 7
- React Hot Toast
- CSS3 (Responsive)

**Backend:**
- Node.js
- Express 4
- MySQL 2
- bcryptjs (hashing)
- CORS

**Base de Datos:**
- MySQL / Apache (XAMPP)
- 12 juegos seeded
- Imágenes RAWG CDN

---

## 🎓 Aprende Más

```
Frontend: src/components/
Backend:  backend/src/
BD:       database.sql
Config:   backend/src/config/db.js
```

---

## ✅ Checklist Inicial

- [ ] XAMPP corriendo
- [ ] Ejecuté `npm run install-all`
- [ ] Ejecuté `node init-db.js`
- [ ] Ejecuté `node seed-games.js`
- [ ] Backend corriendo en Terminal 1
- [ ] Frontend corriendo en Terminal 2
- [ ] Abrí http://localhost:5173 en navegador
- [ ] Hice login / cree cuenta

---

## 🎯 ¡Listo para usar!

Disfruta explorando tu colección de videojuegos.

**¿Dudas? Revisa los archivos de documentación:**
- `PROJECT_AUDIT.md` - Auditoría completa
- `VALIDATION_REPORT.md` - Reporte detallado
- `README.md` - Información general

---

**¡A jugar! 🎮**
