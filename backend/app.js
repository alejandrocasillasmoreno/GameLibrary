// Configuración de variables de entorno
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Definido' : '❌ No definido');
console.log('DB_HOST:', process.env.DB_HOST);

// Importación de dependencias del backend
import express from 'express';
import cors from 'cors';
import pool from './src/config/db.js';

// Importación de rutas API REST
import authRoutes from './src/routes/authRoutes.js';
import gameRoutes from './src/routes/gameRoutes.js';
import libraryRoutes from './src/routes/libraryRoutes.js';
import reviewRoutes from './src/routes/reviewRoutes.js';
import roleRoutes from './src/routes/roleRoutes.js';

// Configuración del servidor Express
const app = express();

// 1. CONFIGURACIÓN DE CORS (Control de Acceso entre Orígenes)
// Permite solicitudes desde el frontend React
const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : ['http://localhost:5173'];
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// 2. MIDDLEWARE: Permite recibir JSON en el body de las solicitudes
app.use(express.json());

// 3. ENDPOINT DE PRUEBA: Verifica que el backend está activo
app.get('/api/health', (req, res) => {
    res.json({ message: '✅ Backend activo' });
});

// 4. ENDPOINT DE PRUEBA: Verifica conexión a base de datos
app.get('/api/db-test', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 as test');
        res.json({ message: '✅ BD conectada', data: rows });
    } catch (error) {
        console.error('Error en db-test:', error);
        res.status(500).json({ message: '❌ Error al conectar BD', error: error.message });
    }
});

// 5. CONFIGURACIÓN DE RUTAS API REST
// Arquitectura RESTful con prefijos de ruta para organización
// Todas las rutas de autenticación empiezan con /api/auth
app.use('/api/auth', authRoutes);
// Todas las rutas de juegos empiezan con /api/games
app.use('/api/games', gameRoutes);
// Todas las rutas de biblioteca empiezan con /api/library
app.use('/api/library', libraryRoutes);
// Todas las rutas de reseñas empiezan con /api/reviews
app.use('/api/reviews', reviewRoutes);
// Todas las rutas de roles y permisos empiezan con /api/roles
app.use('/api/roles', roleRoutes);


// Configuración del puerto del servidor
const PORT = 3000;

// Exportar app para tests unitarios (patrón MVC)
export default app;

// Inicio del servidor (solo en entorno de desarrollo)
// Evita conflictos con pruebas unitarias
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`✅ Servidor Backend listo en http://localhost:${PORT}`);
        console.log(`📍 Prueba salud: http://localhost:${PORT}/api/health`);
        console.log(`📍 Prueba BD: http://localhost:${PORT}/api/db-test`);
    });
}
