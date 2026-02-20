import pool from '../config/db.js';

export const createReview = async (userId, gameId, rating, comment) => {
    // Validar rating (1-5 estrellas)
    if (rating < 1 || rating > 5) {
        throw new Error('El rating debe ser entre 1 y 5 estrellas');
    }

    // Verificar que el juego pertenece al usuario (usando user_library.id)
    const [libraryEntry] = await pool.query(
        'SELECT id FROM user_library WHERE id = ? AND user_id = ?',
        [gameId, userId]
    );
    if (libraryEntry.length === 0) {
        throw new Error('El juego no está en tu biblioteca');
    }

    // Verificar que el usuario no haya reseñado ya este juego
    const [existingReview] = await pool.query(
        'SELECT id FROM reviews WHERE user_id = ? AND game_id = ?',
        [userId, gameId]
    );
    if (existingReview.length > 0) {
        throw new Error('Ya has reseñado este juego');
    }

    const [result] = await pool.query(
        'INSERT INTO reviews (user_id, game_id, rating, comment, created_at) VALUES (?, ?, ?, ?, NOW())',
        [userId, gameId, rating, comment || null]
    );
    
    return result.insertId;
};

export const getReviewsByGame = async (gameId) => {
    try {
        const [rows] = await pool.query(
            `SELECT r.*, u.name as user_name 
             FROM reviews r
             JOIN users u ON r.user_id = u.id
             WHERE r.game_id = ?
             ORDER BY r.created_at DESC`,
            [gameId]
        );
        return rows;
    } catch (error) {
        // Si el error es que la tabla no existe, devolvemos array vacío
        if (error.code === 'ER_NO_SUCH_TABLE') {
            console.warn('La tabla reviews no existe, devolviendo array vacío');
            return [];
        }
        throw error;
    }
};

export const updateReview = async (reviewId, userId, rating, comment) => {
    // Validar rating
    if (rating < 1 || rating > 5) {
        throw new Error('El rating debe ser entre 1 y 5 estrellas');
    }

    // Verificar propiedad y existencia
    const [review] = await pool.query('SELECT * FROM reviews WHERE id = ?', [reviewId]);
    if (review.length === 0) throw new Error('Reseña no encontrada');
    if (review[0].user_id !== userId) throw new Error('No autorizado');

    await pool.query(
        'UPDATE reviews SET rating = ?, comment = ?, updated_at = NOW() WHERE id = ?',
        [rating, comment || null, reviewId]
    );
};

export const deleteReview = async (reviewId, userId) => {
    const [review] = await pool.query('SELECT * FROM reviews WHERE id = ?', [reviewId]);
    if (review.length === 0) throw new Error('Reseña no encontrada');
    if (review[0].user_id !== userId) throw new Error('No autorizado');
    
    await pool.query('DELETE FROM reviews WHERE id = ?', [reviewId]);
};

// Nueva función: Obtener reseñas de un usuario
export const getUserReviews = async (userId) => {
    try {
        const [rows] = await pool.query(
            `SELECT r.*, u.name as user_name, g.title as game_title
             FROM reviews r
             JOIN users u ON r.user_id = u.id
             JOIN user_library ul ON r.game_id = ul.id
             JOIN games g ON ul.game_id = g.id
             WHERE r.user_id = ?
             ORDER BY r.created_at DESC`,
            [userId]
        );
        return rows;
    } catch (error) {
        throw error;
    }
};

// Nueva función: Verificar si el usuario ya reseñó un juego
export const hasUserReviewedGame = async (userId, gameId) => {
    try {
        const [rows] = await pool.query(
            'SELECT id FROM reviews WHERE user_id = ? AND game_id = ?',
            [userId, gameId]
        );
        return rows.length > 0;
    } catch (error) {
        throw error;
    }
};
