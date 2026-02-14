import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';
import libraryRoutes from './src/routes/libraryRoutes.js';
import pool from './src/config/db.js';

const app = express();

// 1. CONFIGURACIÓN DE CORS (CRUCIAL PARA QUE NO FALLE)
app.use(cors({
    origin: 'http://localhost:5173', // La dirección de tu React
    credentials: true
}));

// 2. PERMITIR JSON
app.use(express.json());

// 3. ENDPOINT DE PRUEBA
app.get('/api/health', (req, res) => {
    res.json({ message: '✅ Backend activo' });
});

// 4. ENDPOINT DE CONEXIÓN A BD
app.get('/api/db-test', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT 1 as test');
        res.json({ message: '✅ BD conectada', data: result });
    } catch (error) {
        console.error('❌ Error BD:', error);
        res.status(500).json({ message: '❌ Error al conectar BD', error: error.message });
    }
});

// 5. RUTAS
// Todas las rutas de auth empiezan con /api/auth
app.use('/api/auth', authRoutes);
// Todas las rutas de biblioteca empiezan con /api/library
app.use('/api/library', libraryRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor Backend listo en http://localhost:${PORT}`);
    console.log(`📍 Prueba salud: http://localhost:${PORT}/api/health`);
    console.log(`📍 Prueba BD: http://localhost:${PORT}/api/db-test`);
});