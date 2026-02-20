import db from '../config/db.js';

const gameModel = {
  getAllGames: async () => {
    const query = 'SELECT * FROM games ORDER BY title';
    const [rows] = await db.execute(query);
    return rows;
  },

  getGameById: async (id) => {
    const query = 'SELECT * FROM games WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0] || null;
  }
};

export default gameModel;
