import express from 'express';
import fetch from 'node-fetch';
import pool from '../config/db.js';

const router = express.Router();
const API_KEY = '2a6e65812152413db3df7636ba1b97ea'; // Tu API key de RAWG
const PAGE_SIZE = 20;

router.get('/', async (req, res) => {
  const { query, page = 1 } = req.query;
  
  try {
    let url;
    if (query) {
      url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${query}&page=${page}&page_size=${PAGE_SIZE}`;
    } else {
      url = `https://api.rawg.io/api/games?key=${API_KEY}&page=${page}&page_size=${PAGE_SIZE}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error al obtener juegos de RAWG:', error);
    // Fallback a base de datos local (opcional)
    try {
      const [rows] = await pool.query('SELECT * FROM games LIMIT ? OFFSET ?', [PAGE_SIZE, (page - 1) * PAGE_SIZE]);
      const [countResult] = await pool.query('SELECT COUNT(*) as total FROM games');
      res.json({
        results: rows,
        count: countResult[0].total,
        next: null,
        previous: null
      });
    } catch (dbError) {
      console.error('Error en fallback:', dbError);
      res.status(500).json({ error: 'Error al obtener juegos' });
    }
  }
});

export default router;