const db = require('../config/db');

const libraryModel = {
  getUserLibrary: async (userId) => {
    const query = `
      SELECT g.*, ul.added_at, ul.status, ul.playtime_hours
      FROM user_library ul
      JOIN games g ON ul.game_id = g.id
      WHERE ul.user_id = ?
      ORDER BY ul.added_at DESC
    `;
    const [rows] = await db.execute(query, [userId]);
    return rows;
  },

  addGameToLibrary: async (userId, gameId, status = 'pending') => {
    const query = `
      INSERT INTO user_library (user_id, game_id, status, added_at)
      VALUES (?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE status = VALUES(status)
    `;
    await db.execute(query, [userId, gameId, status]);
  },

  removeGameFromLibrary: async (userId, gameId) => {
    const query = 'DELETE FROM user_library WHERE user_id = ? AND game_id = ?';
    await db.execute(query, [userId, gameId]);
  },

  updateGameStatus: async (userId, gameId, status) => {
    const query = 'UPDATE user_library SET status = ? WHERE user_id = ? AND game_id = ?';
    await db.execute(query, [status, userId, gameId]);
  },

  updatePlaytime: async (userId, gameId, playtimeHours) => {
    const query = 'UPDATE user_library SET playtime_hours = ? WHERE user_id = ? AND game_id = ?';
    await db.execute(query, [playtimeHours, userId, gameId]);
  }
};

module.exports = libraryModel;