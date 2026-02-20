import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

// Middleware para verificar autenticación JWT
export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.userId]);
        
        if (users.length === 0) {
            return res.status(401).json({ message: 'Token inválido. Usuario no encontrado.' });
        }

        req.user = users[0];
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido o expirado.' });
    }
};

// Middleware para verificar roles específicos
export const requireRole = (roleName) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Acceso denegado. Usuario no autenticado.' });
        }

        const [roles] = await pool.query('SELECT * FROM roles WHERE id = ?', [req.user.role_id]);
        
        if (roles.length === 0) {
            return res.status(403).json({ message: 'Acceso denegado. Rol no encontrado.' });
        }

        const userRole = roles[0];
        if (userRole.name !== roleName) {
            return res.status(403).json({ message: `Acceso denegado. Se requiere rol: ${roleName}` });
        }

        next();
    };
};

// Middleware para verificar permisos específicos
export const requirePermission = (permissionName) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Acceso denegado. Usuario no autenticado.' });
        }

        // Obtener el rol del usuario
        const [roles] = await pool.query('SELECT * FROM roles WHERE id = ?', [req.user.role_id]);
        
        if (roles.length === 0) {
            return res.status(403).json({ message: 'Acceso denegado. Rol no encontrado.' });
        }

        const userRole = roles[0];

        // Verificar si el rol tiene el permiso necesario
        const [permissions] = await pool.query(`
            SELECT p.name 
            FROM permissions p
            JOIN role_permissions rp ON p.id = rp.permission_id
            WHERE rp.role_id = ? AND p.name = ?
        `, [userRole.id, permissionName]);

        if (permissions.length === 0) {
            return res.status(403).json({ 
                message: `Acceso denegado. Se requiere el permiso: ${permissionName}`,
                requiredPermission: permissionName
            });
        }

        next();
    };
};

// Middleware para verificar si el usuario es admin
export const requireAdmin = requireRole('admin');

// Middleware para verificar si el usuario es admin o el propietario del recurso
export const requireAdminOrOwner = (resourceUserIdField = 'user_id') => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Acceso denegado. Usuario no autenticado.' });
        }

        // Si es admin, permitir acceso
        const [roles] = await pool.query('SELECT * FROM roles WHERE id = ?', [req.user.role_id]);
        if (roles.length > 0 && roles[0].name === 'admin') {
            return next();
        }

        // Si no es admin, verificar si es el propietario del recurso
        const resourceId = req.params.id || req.params.userId || req.body.userId;
        const resourceUserId = req.body[resourceUserIdField] || req.user.id;

        if (req.user.id !== resourceUserId) {
            return res.status(403).json({ message: 'Acceso denegado. No tienes permisos para esta acción.' });
        }

        next();
    };
};

// Middleware para verificar permisos con lógica OR (al menos uno de los permisos)
export const requireAnyPermission = (permissionNames) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Acceso denegado. Usuario no autenticado.' });
        }

        // Obtener el rol del usuario
        const [roles] = await pool.query('SELECT * FROM roles WHERE id = ?', [req.user.role_id]);
        
        if (roles.length === 0) {
            return res.status(403).json({ message: 'Acceso denegado. Rol no encontrado.' });
        }

        const userRole = roles[0];

        // Verificar si el rol tiene al menos uno de los permisos necesarios
        const placeholders = permissionNames.map(() => '?').join(',');
        const [permissions] = await pool.query(`
            SELECT p.name 
            FROM permissions p
            JOIN role_permissions rp ON p.id = rp.permission_id
            WHERE rp.role_id = ? AND p.name IN (${placeholders})
        `, [userRole.id, ...permissionNames]);

        if (permissions.length === 0) {
            return res.status(403).json({ 
                message: `Acceso denegado. Se requiere al menos uno de estos permisos: ${permissionNames.join(', ')}`,
                requiredPermissions: permissionNames
            });
        }

        next();
    };
};

// Middleware para registrar actividad del usuario (para auditoría)
export const logActivity = (action) => {
    return async (req, res, next) => {
        if (req.user) {
            console.log(`[${new Date().toISOString()}] ${req.user.name} (${req.user.email}) - Acción: ${action} - IP: ${req.ip}`);
        }
        next();
    };
};