import * as reviewService from '../services/reviewService.js';

export const createReview = async (req, res) => {
    try {
        const { userId, gameId, rating, comment } = req.body;
        
        // Validar campos obligatorios
        if (!userId || !gameId || !rating) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        await reviewService.createReview(userId, gameId, rating, comment);
        res.status(201).json({ message: 'Reseña creada correctamente' });
    } catch (error) {
        console.error('Error en createReview:', error);
        
        if (error.message.includes('rating debe ser entre 1 y 5')) {
            return res.status(400).json({ message: error.message });
        }
        if (error.message.includes('no está en tu biblioteca')) {
            return res.status(403).json({ message: error.message });
        }
        if (error.message.includes('Ya has reseñado este juego')) {
            return res.status(409).json({ message: error.message });
        }
        
        res.status(500).json({ error: error.message });
    }
};

export const getReviewsByGame = async (req, res) => {
    try {
        const { gameId } = req.params;
        
        // Validar parámetro
        if (!gameId) {
            return res.status(400).json({ message: 'ID de juego requerido' });
        }

        const reviews = await reviewService.getReviewsByGame(gameId);
        res.json(reviews);
    } catch (error) {
        console.error('Error en getReviewsByGame:', error);
        res.status(500).json({ error: error.message });
    }
};

export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, rating, comment } = req.body;
        
        // Validar campos
        if (!id || !userId || !rating) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        await reviewService.updateReview(id, userId, rating, comment);
        res.json({ message: 'Reseña actualizada correctamente' });
    } catch (error) {
        console.error('Error en updateReview:', error);
        
        if (error.message === 'Reseña no encontrada') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'No autorizado') {
            return res.status(403).json({ message: error.message });
        }
        if (error.message.includes('rating debe ser entre 1 y 5')) {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ error: error.message });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        
        // Validar campos
        if (!id || !userId) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        await reviewService.deleteReview(id, userId);
        res.json({ message: 'Reseña eliminada correctamente' });
    } catch (error) {
        console.error('Error en deleteReview:', error);
        
        if (error.message === 'Reseña no encontrada') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'No autorizado') {
            return res.status(403).json({ message: error.message });
        }
        
        res.status(500).json({ error: error.message });
    }
};

// Nueva función: Obtener reseñas de un usuario
export const getUserReviews = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ message: 'ID de usuario requerido' });
        }

        const reviews = await reviewService.getUserReviews(userId);
        res.json(reviews);
    } catch (error) {
        console.error('Error en getUserReviews:', error);
        res.status(500).json({ error: error.message });
    }
};

// Nueva función: Verificar si el usuario ya reseñó un juego
export const checkUserReview = async (req, res) => {
    try {
        const { userId, gameId } = req.params;
        
        if (!userId || !gameId) {
            return res.status(400).json({ message: 'ID de usuario y juego requeridos' });
        }

        const hasReviewed = await reviewService.hasUserReviewedGame(userId, gameId);
        res.json({ hasReviewed });
    } catch (error) {
        console.error('Error en checkUserReview:', error);
        res.status(500).json({ error: error.message });
    }
};
