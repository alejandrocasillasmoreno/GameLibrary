const db = require('../config/db');

const reviewModel = {
  getUserReviews: async (userId) => {
    const query = `
      SELECT r.*, g.title as game_title
      FROM reviews r
      JOIN games g ON r.game_id = g.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `;
    const [rows] = await db.execute(query, [userId]);
    return rows;
  },

  getGameReviews: async (gameId) => {
    const query = `
      SELECT r.*, u.username
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.game_id = ?
      ORDER BY r.created_at DESC
    `;
    const [rows] = await db.execute(query, [gameId]);
    return rows;
  },

  createReview: async (userId, gameId, rating, comment) => {
    const query = `
      INSERT INTO reviews (user_id, game_id, rating, comment, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `;
    const [result] = await db.execute(query, [userId, gameId, rating, comment]);
    return result.insertId;
  },

  updateReview: async (reviewId, userId, rating, comment) => {
    const query = `
      UPDATE reviews 
      SET rating = ?, comment = ?, updated_at = NOW()
      WHERE id = ? AND user_id = ?
    `;
    await db.execute(query, [rating, comment, reviewId, userId]);
  },

  deleteReview: async (reviewId, userId) => {
    const query = 'DELETE FROM reviews WHERE id = ? AND user_id = ?';
    await db.execute(query, [reviewId, userId]);
  }
};

module.exports = reviewModel;