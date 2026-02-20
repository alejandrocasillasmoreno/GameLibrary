import express from 'express';
import * as libraryController from '../controllers/libraryController.js';

const router = express.Router();

router.get('/:userId', libraryController.getLibrary);
router.get('/game/:id', libraryController.getGameById);
router.post('/', libraryController.addGame);
router.put('/:id', libraryController.updateGame);
router.delete('/:id', libraryController.deleteGame);

export default router;
