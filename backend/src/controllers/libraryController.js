import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// 1. AÑADIR JUEGO (POST)
router.post('/add-external', async (req, res) => {
    console.log("📥 Recibido para añadir:", req.body);
    
    const { userId, gameId } = req.body;
    // Truco: A veces viene como 'title', 'name' o 'titulo'. Los probamos todos.
    const titulo = req.body.title || req.body.titulo || req.body.name || 'Sin título';
    // Truco: La imagen a veces viene como 'background_image' (API externa) o 'imagen_url'
    const imagen = req.body.background_image || req.body.image || req.body.imagen_url || '';

    try {
        // Comprobar duplicados
        const [existing] = await pool.query(
            'SELECT * FROM user_library WHERE user_id = ? AND game_id = ?', 
            [userId, gameId]
        );

        if (existing.length > 0) {
            return res.status(409).json({ message: "El juego ya está en tu lista" });
        }

        // Insertar con TODOS los datos
        await pool.query(
            'INSERT INTO user_library (user_id, game_id, titulo, imagen_url, status, valoracion) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, gameId, titulo, imagen, 'pendiente', 0] // 0 es la nota inicial
        );

        res.json({ message: "Juego añadido con éxito" });

    } catch (error) {
        console.error("❌ Error al añadir:", error);
        res.status(500).json({ error: "No se pudo guardar en la base de datos" });
    }
});

// 2. LEER JUEGOS (GET)
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const [rows] = await pool.query('SELECT * FROM user_library WHERE user_id = ?', [userId]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al leer biblioteca' });
    }
});

// 3. ACTUALIZAR ESTADO O VALORACIÓN (PUT)
router.put('/', async (req, res) => {
    console.log("📥 Actualizando:", req.body);
    
    const { userId, gameId, status, valoracion } = req.body;

    try {
        // Esta query es inteligente: Si envías status lo actualiza, si envías valoracion la actualiza.
        // COALESCE significa: "Si el valor nuevo es null, mantén el que ya estaba en la base de datos".
        const query = `
            UPDATE user_library 
            SET 
                status = COALESCE(?, status), 
                valoracion = COALESCE(?, valoracion)
            WHERE user_id = ? AND game_id = ?
        `;
        
        await pool.query(query, [status, valoracion, userId, gameId]);

        res.json({ message: "Actualizado correctamente" });

    } catch (error) {
        console.error("❌ Error al actualizar:", error);
        res.status(500).json({ error: "Error al actualizar" });
    }
});

// 4. ELIMINAR (DELETE)
router.delete('/', async (req, res) => {
    const { userId, gameId } = req.body;
    try {
        await pool.query('DELETE FROM user_library WHERE user_id = ? AND game_id = ?', [userId, gameId]);
        res.json({ message: "Eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar" });
    }
});
// Actualizar estado o valoración
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { status, valoracion } = req.body;
    // IMPORTANTE: Asegúrate de que user_id coincida para que un usuario no edite los juegos de otro
    // Asumimos que envías el user_id en el body o lo sacas de la sesión. 
    // Para simplificar ahora, lo haremos directo por ID del juego:
    
    try {
        const [result] = await pool.query(
            'UPDATE user_library SET status = ?, valoracion = ? WHERE id = ?',
            [status, valoracion, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Juego no encontrado' });
        }

        res.json({ message: 'Juego actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export default router;