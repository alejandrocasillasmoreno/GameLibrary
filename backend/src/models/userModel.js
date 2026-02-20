import db from '../config/db.js';

const userModel = {
  findByEmail: async (email) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0] || null;
  },

  createUser: async (name, email, hashedPassword, role = 'user') => {
    const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    const [result] = await db.execute(query, [name, email, hashedPassword, role]);
    return result.insertId;
  },

  findUserById: async (id) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0] || null;
  },

  // Nuevas funciones para gestión de usuarios
  getAllUsers: async () => {
    const query = 'SELECT id, name, email, role, created_at FROM users ORDER BY id DESC';
    const [rows] = await db.execute(query);
    return rows;
  },

  getUserById: async (id) => {
    const query = 'SELECT id, name, email, role, created_at FROM users WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  },

  updateUserRole: async (id, role) => {
    const query = 'UPDATE users SET role = ? WHERE id = ?';
    await db.execute(query, [role, id]);
  },

  deleteUserById: async (id) => {
    const query = 'DELETE FROM users WHERE id = ?';
    await db.execute(query, [id]);
  }
};

export default userModel;
