import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// 1. OBTENER JUEGOS (GET)
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Validar que userId es un número válido
        if (!userId || isNaN(userId)) {
            console.error(`❌ Error GET: userId inválido - ${userId}`);
            return res.status(400).json({ error: 'userId debe ser un número válido' });
        }
        
        console.log(`📚 GET: Cargando juegos del usuario ${userId}`);
        const [rows] = await pool.query('SELECT * FROM user_library WHERE user_id = ?', [userId]);
        console.log(`✅ Se encontraron ${rows.length} juegos`);
        res.json(rows);
    } catch (error) {
        console.error("❌ Error GET /library:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// 2. AÑADIR JUEGO (POST)
// CAMBIO IMPORTANTE: Usamos '/' en vez de '/add-external'
router.post('/', async (req, res) => {
    
    console.log("📦 DATOS RECIBIDOS DEL FRONTEND:", req.body);

    const { userId, gameId } = req.body;

    // 🛡️ VALIDACIÓN DE DATOS REQUERIDOS
    if (!userId || !gameId) {
        console.error("❌ Error: Faltan userId o gameId", { userId, gameId });
        return res.status(400).json({ message: 'Error: Se requieren userId y gameId' });
    }

    if (isNaN(userId) || isNaN(gameId)) {
        console.error("❌ Error: userId o gameId no son números válidos");
        return res.status(400).json({ message: 'Error: userId y gameId deben ser números' });
    }

    // 🛡️ MAPEO INTELIGENTE
    const titulo = req.body.titulo || req.body.name || req.body.title || 'Sin Título';
    const imagen_url = req.body.imagen_url || req.body.background_image || req.body.image || '';
    const plataforma = req.body.plataforma || 'PC'; 

    // Verificación de seguridad
    if (!titulo || titulo === 'Sin Título') {
        console.error("❌ Error: No título.");
        return res.status(400).json({ message: 'Error: El juego no tiene título válido.' });
    }

    try {
        // Verificar si ya existe
        const [exists] = await pool.query(
            'SELECT * FROM user_library WHERE user_id = ? AND game_id = ?',
            [userId, gameId]
        );

        if (exists.length > 0) {
            // Devuelve 409 (Conflicto) en lugar de 400, es más correcto
            return res.status(409).json({ message: '¡Este juego ya está en tu biblioteca!' });
        }

        // Insertar en Base de Datos
        // Status correcto: 'pending' (en inglés y minúscula como está en la BD)
        await pool.query(
            'INSERT INTO user_library (user_id, game_id, titulo, imagen_url, plataforma, status, valoracion) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, gameId, titulo, imagen_url, plataforma, 'pending', 0]
        );

        console.log(`✅ Juego guardado: ${titulo}`);
        res.status(201).json({ message: 'Juego añadido correctamente' });

    } catch (error) {
        console.error("🔥 Error SQL:", error.message);
        res.status(500).json({ error: 'Error al guardar en la base de datos' });
    }
});
// 3. ACTUALIZAR ESTADO (PUT) - ¡ESTA ES LA QUE ARREGLA EL DROPDOWN!
// Fíjate que la ruta coincide con tu fetch: /update/:id
// --- RUTA PARA ACTUALIZAR ESTADO ---
// Frontend llamará a: /api/library/status/5 (donde 5 es el ID de la fila)
router.put('/status/:id', async (req, res) => {
    const { id } = req.params; // El ID único de la entrada en tu tabla user_library
    const { status } = req.body; // El nuevo estado (ej: 'jugando', 'terminado')

    console.log(`🔄 Intentando cambiar estado del ID ${id} a: ${status}`);

    try {
        // Ejecutamos la actualización en MySQL
        const [result] = await pool.query(
            'UPDATE user_library SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Juego no encontrado en tu biblioteca' });
        }

        res.json({ message: 'Estado actualizado correctamente' });

    } catch (error) {
        console.error("🔥 Error actualizando estado:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// 4. ELIMINAR JUEGO (DELETE)
router.delete('/:id', async (req, res) => {
    const { id } = req.params; // Recibimos el ID de la fila (ej: 5)
    
    try {
        const [result] = await pool.query('DELETE FROM user_library WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Juego no encontrado' });
        }
        
        res.json({ message: 'Juego eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

export default router;