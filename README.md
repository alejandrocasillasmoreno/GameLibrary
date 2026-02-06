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
## Usuario de prueba
