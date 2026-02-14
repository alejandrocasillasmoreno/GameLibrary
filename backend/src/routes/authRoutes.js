import express from 'express';
// 👇 CAMBIO AQUÍ: Solo un "../" para buscar en src/controllers
import { register, login } from '../controllers/authController.js'; 

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router;