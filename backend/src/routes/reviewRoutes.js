import express from 'express';
import * as reviewController from '../controllers/reviewController.js';

const router = express.Router();

// ===== CREAR RESEÑA =====
router.post('/', reviewController.createReview);

// ===== OBTENER RESEÑAS DE UN JUEGO =====
router.get('/game/:gameId', reviewController.getReviewsByGame);

// ===== EDITAR RESEÑA =====
router.put('/:id', reviewController.updateReview);

// ===== ELIMINAR RESEÑA =====
router.delete('/:id', reviewController.deleteReview);

// ===== OBTENER RESEÑAS DE UN USUARIO =====
router.get('/user/:userId', reviewController.getUserReviews);

// ===== VERIFICAR SI EL USUARIO YA RESEÑÓ UN JUEGO =====
router.get('/check/:userId/:gameId', reviewController.checkUserReview);

export default router;
