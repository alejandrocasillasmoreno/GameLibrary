import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',      // En XAMPP suele ser 'root'
  password: '',      // En XAMPP suele estar VACÍA
  database: 'gamelibrary', // Nombre de BD
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Exportar como promesa (IMPORTANTE para async/await)
export default pool.promise();