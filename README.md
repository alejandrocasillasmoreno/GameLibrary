# GameLibrary
## Idea y temática de la aplicación
GameLibrary será una aplicación web que permitirá a los usuarios gestionar su biblioteca
personal de videojuegos de forma centralizada.
## Tecnologías utilizadas
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## Intrucciones de instalación y ejecución
### 📋 1. Prerrequisitos
Asegúrate de tener instalado:
* **Node.js** (v16 o superior)
* **MySQL** (Puede ser a través de **XAMPP** o instalación nativa)
* **Git**

---

### 🗄️ 2. Configuración de la Base de Datos
1.  Inicia tu servidor MySQL (si usas XAMPP, arranca el módulo **MySQL**).
2.  Abre tu herramienta de gestión (phpMyAdmin o MySQL Workbench).
3.  Crea una base de datos vacía llamada: `gamelibrary`.
4.  Importa el archivo `database.sql` ubicado en la raíz del proyecto para generar las tablas y datos iniciales.

---

### 🔙 3. Configuración del Backend (Servidor)

1.  Abre una terminal y entra en la carpeta del servidor:
    ```bash
    cd backend
    ```

2.  Instala las dependencias:
    ```bash
    npm install
    ```

3.  **Variables de Entorno:** Crea un archivo llamado `.env` en la carpeta `backend/` y añade la configuración de tu base de datos:
    ```text
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=gamelibrary
    PORT=3000
    ```
    *(Nota: Si tu base de datos tiene contraseña, cámbiala donde dice `DB_PASSWORD`)*.

4.  Inicia el servidor:
    ```bash
    node app.js
    ```
    ✅ *Verás un mensaje indicando que el servidor corre en el puerto 3000.*

---

### 🖥️ 4. Configuración del Frontend (Cliente)

1.  Abre una **nueva terminal** (no cierres la del backend) y entra en la carpeta del cliente:
    ```bash
    cd frontend
    ```

2.  Instala las dependencias:
    ```bash
    npm install
    ```

3.  Inicia la aplicación React:
    ```bash
    npm run dev
    ```

4.  Abre tu navegador en la URL que aparece (normalmente `http://localhost:5173`).

---

### 🧪 5. Verificación
* **Login:** Intenta acceder con el usuario de prueba.
* **Catálogo:** Verifica que cargan los juegos desde la API externa.
* **Base de Datos:** Al añadir un juego, revisa en phpMyAdmin que se ha creado el registro en la tabla `games`.

## Estructura del proyecto
### 📂 Estructura del Proyecto

```text
GameLibrary/
├── backend/                    # Servidor API (Node.js + Express)
│   ├── src/
│   │   ├── config/             # Variables de entorno y conexión BD [Requisito 4.2]
│   │   │   └── db.js
│   │   ├── controllers/        # Lógica de negocio y funciones [Requisito 4.2]
│   │   │   ├── authController.js
│   │   │   └── gameController.js
│   │   ├── models/             # Acceso a datos y consultas SQL [Requisito 4.2]
│   │   │   ├── User.js
│   │   │   └── Game.js
│   │   ├── routes/             # Definición de rutas de la API [Requisito 4.2]
│   │   │   ├── authRoutes.js
│   │   │   └── gameRoutes.js
│   │   └── app.js              # Configuración de Express
│   ├── .env                    # Variables sensibles (No subir a GitHub)
│   └── package.json
│
├── frontend/                   # Cliente Web (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Componentes reutilizables (Botones, Cards)
│   │   ├── context/            # Gestión de estado global (Auth) [Requisito 4.1]
│   │   ├── pages/              # Vistas principales (Rutas) [Requisito 4.1]
│   │   │   ├── Login.jsx
│   │   │   ├── Catalog.jsx
│   │   │   └── Library.jsx
│   │   ├── App.jsx             # Configuración de Rutas
│   │   └── main.jsx
│   ├── .env                    # Variables de entorno del cliente
│   └── vite.config.js
│
├── database.sql                # Script de creación de tablas [Requisito 1]
├── README.md                   # Documentación del proyecto [Requisito 8]
└── docker-compose.yml          # (Opcional) Orquestación de contenedores


## Prueba de usuario
