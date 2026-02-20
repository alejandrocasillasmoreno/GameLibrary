import pool from '../config/db.js';

// Obtener todos los roles
export const getAllRoles = async () => {
    const [rows] = await pool.query('SELECT * FROM roles ORDER BY name');
    return rows;
};

// Obtener un rol por ID
export const getRoleById = async (roleId) => {
    const [rows] = await pool.query('SELECT * FROM roles WHERE id = ?', [roleId]);
    return rows[0];
};

// Crear un nuevo rol
export const createRole = async (name, description) => {
    const [result] = await pool.query(
        'INSERT INTO roles (name, description) VALUES (?, ?)',
        [name, description]
    );
    return result.insertId;
};

// Actualizar un rol
export const updateRole = async (roleId, name, description) => {
    const [result] = await pool.query(
        'UPDATE roles SET name = ?, description = ? WHERE id = ?',
        [name, description, roleId]
    );
    return result.affectedRows > 0;
};

// Eliminar un rol
export const deleteRole = async (roleId) => {
    const [result] = await pool.query('DELETE FROM roles WHERE id = ?', [roleId]);
    return result.affectedRows > 0;
};

// Obtener todos los permisos
export const getAllPermissions = async () => {
    const [rows] = await pool.query('SELECT * FROM permissions ORDER BY name');
    return rows;
};

// Obtener permisos por rol
export const getPermissionsByRole = async (roleId) => {
    const [rows] = await pool.query(`
        SELECT p.* 
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permission_id
        WHERE rp.role_id = ?
        ORDER BY p.name
    `, [roleId]);
    return rows;
};

// Asignar permisos a un rol
export const assignPermissionsToRole = async (roleId, permissionIds) => {
    // Primero eliminamos todos los permisos actuales del rol
    await pool.query('DELETE FROM role_permissions WHERE role_id = ?', [roleId]);
    
    // Luego insertamos los nuevos permisos
    if (permissionIds.length > 0) {
        const values = permissionIds.map(id => [roleId, id]);
        await pool.query(
            'INSERT INTO role_permissions (role_id, permission_id) VALUES ?',
            [values]
        );
    }
};

// Obtener rol con sus permisos
export const getRoleWithPermissions = async (roleId) => {
    const [role] = await pool.query('SELECT * FROM roles WHERE id = ?', [roleId]);
    if (role.length === 0) return null;
    
    const permissions = await getPermissionsByRole(roleId);
    return {
        ...role[0],
        permissions
    };
};

// Verificar si un usuario tiene un permiso específico
export const userHasPermission = async (userId, permissionName) => {
    const [result] = await pool.query(`
        SELECT COUNT(*) as hasPermission
        FROM users u
        JOIN roles r ON u.role_id = r.id
        JOIN role_permissions rp ON r.id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE u.id = ? AND p.name = ?
    `, [userId, permissionName]);
    
    return result[0].hasPermission > 0;
};

// Obtener todos los permisos de un usuario
export const getUserPermissions = async (userId) => {
    const [rows] = await pool.query(`
        SELECT p.name, p.description
        FROM users u
        JOIN roles r ON u.role_id = r.id
        JOIN role_permissions rp ON r.id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE u.id = ?
        ORDER BY p.name
    `, [userId]);
    return rows;
};

// Actualizar rol de un usuario
export const updateUserRole = async (userId, roleId) => {
    const [result] = await pool.query(
        'UPDATE users SET role_id = ? WHERE id = ?',
        [roleId, userId]
    );
    return result.affectedRows > 0;
};