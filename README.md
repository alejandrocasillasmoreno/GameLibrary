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
GameLibrary/
├── README.md                <-- OBLIGATORIO: Debe incluir los puntos del apartado 8 [cite: 129]
├── .gitignore               <-- Para ignorar node_modules y .env
├── docker-compose.yml       <-- (Opcional) Si decides usar Docker para subir nota [cite: 161]
│
├── backend/                 <-- Cumple requisito de separación [cite: 124]
│   ├── src/
│   │   ├── config/          <-- Conexión a BD y variables de entorno 
│   │   │   └── db.js
│   │   ├── controllers/     <-- Lógica de las peticiones (Requisito 4.2) [cite: 75]
│   │   │   ├── authController.js
│   │   │   ├── gameController.js
│   │   │   └── userLibraryController.js
│   │   ├── middleware/      <-- Para autenticación y gestión de errores [cite: 88, 113]
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── models/          <-- Acceso a datos (MySQL/Mongo) [cite: 78]
│   │   │   ├── User.js
│   │   │   ├── Game.js
│   │   │   └── UserLibrary.js
│   │   ├── routes/          <-- Definición de endpoints (Requisito 4.2) [cite: 73]
│   │   │   ├── authRoutes.js
│   │   │   └── libraryRoutes.js
│   │   └── app.js           <-- Configuración de Express [cite: 71]
│   ├── .env                 <-- Variables de entorno (OBLIGATORIO) 
│   ├── package.json
│   └── Dockerfile           <-- (Opcional) [cite: 161]
│
└── frontend/                <-- Cumple requisito de separación [cite: 123]
    ├── public/
    ├── src/
    │   ├── api/             <-- Configuración de Axios/Fetch 
    │   │   └── axiosConfig.js
    │   ├── components/      <-- Componentes reutilizables
    │   │   ├── Navbar.jsx
    │   │   ├── GameCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/         <-- Gestión de estado (Context API) 
    │   │   └── AuthContext.jsx
    │   ├── pages/           <-- Vistas para React Router 
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Catalog.jsx
    │   │   └── MyLibrary.jsx
    │   ├── hooks/           <-- Lógica personalizada (recomendado)
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── App.css
    ├── .env                 <-- Variables de entorno del front
    ├── package.json
    ├── vite.config.js
    └── Dockerfile           <-- (Opcional) [cite: 161]
## Usuario de prueba
