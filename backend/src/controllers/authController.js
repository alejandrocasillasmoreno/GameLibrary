import bcryptjs from 'bcryptjs';
import pool from '../config/db.js';
// REGISTRO
export const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // 1. Validar datos
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Faltan datos" });
        }

        // 2. Encriptar contraseña
        const hashedPassword = await bcryptjs.hash(password, 10);

        // 3. Guardar en MySQL
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: 'Usuario creado', id: result.insertId });

    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'El usuario o email ya existe' });
        }
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscar usuario por email
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const user = users[0];

        // 2. Comparar contraseña
        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // 3. Login exitoso
        res.json({
            user: {
                id: user.id,
                username: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};