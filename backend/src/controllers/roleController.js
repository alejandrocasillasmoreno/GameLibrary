import * as roleService from '../services/roleService.js';

// Obtener todos los roles
export const getAllRoles = async (req, res) => {
    try {
        const roles = await roleService.getAllRoles();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un rol por ID
export const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await roleService.getRoleById(id);
        if (!role) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        res.json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo rol
export const createRole = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'El nombre del rol es requerido' });
        }
        const roleId = await roleService.createRole(name, description);
        res.status(201).json({ message: 'Rol creado exitosamente', roleId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un rol
export const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const updated = await roleService.updateRole(id, name, description);
        if (!updated) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        res.json({ message: 'Rol actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un rol
export const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await roleService.deleteRole(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        res.json({ message: 'Rol eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todos los permisos
export const getAllPermissions = async (req, res) => {
    try {
        const permissions = await roleService.getAllPermissions();
        res.json(permissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener permisos por rol
export const getPermissionsByRole = async (req, res) => {
    try {
        const { roleId } = req.params;
        const permissions = await roleService.getPermissionsByRole(roleId);
        res.json(permissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Asignar permisos a un rol
export const assignPermissionsToRole = async (req, res) => {
    try {
        const { roleId } = req.params;
        const { permissionIds } = req.body;
        if (!Array.isArray(permissionIds)) {
            return res.status(400).json({ message: 'permissionIds debe ser un array' });
        }
        await roleService.assignPermissionsToRole(roleId, permissionIds);
        res.json({ message: 'Permisos asignados exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener rol con sus permisos
export const getRoleWithPermissions = async (req, res) => {
    try {
        const { roleId } = req.params;
        const roleWithPermissions = await roleService.getRoleWithPermissions(roleId);
        if (!roleWithPermissions) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        res.json(roleWithPermissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Verificar si un usuario tiene un permiso específico
export const checkUserPermission = async (req, res) => {
    try {
        const { userId, permissionName } = req.params;
        const hasPermission = await roleService.userHasPermission(userId, permissionName);
        res.json({ hasPermission, userId, permissionName });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todos los permisos de un usuario
export const getUserPermissions = async (req, res) => {
    try {
        const { userId } = req.params;
        const permissions = await roleService.getUserPermissions(userId);
        res.json(permissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar rol de un usuario
export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { roleId } = req.body;
        const updated = await roleService.updateUserRole(userId, roleId);
        if (!updated) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Rol de usuario actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};