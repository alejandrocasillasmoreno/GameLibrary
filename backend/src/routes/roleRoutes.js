import express from 'express';
import * as roleController from '../controllers/roleController.js';
import { authenticateToken, requireAdmin, requirePermission } from '../middleware/auth.js';

const router = express.Router();

// Rutas para roles (solo admin)
router.get('/', authenticateToken, requireAdmin, roleController.getAllRoles);
router.get('/:id', authenticateToken, requireAdmin, roleController.getRoleById);
router.post('/', authenticateToken, requireAdmin, roleController.createRole);
router.put('/:id', authenticateToken, requireAdmin, roleController.updateRole);
router.delete('/:id', authenticateToken, requireAdmin, roleController.deleteRole);

// Rutas para permisos (acceso para admin)
router.get('/permissions', authenticateToken, requireAdmin, roleController.getAllPermissions);
router.get('/:roleId/permissions', authenticateToken, requireAdmin, roleController.getPermissionsByRole);
router.post('/:roleId/permissions', authenticateToken, requireAdmin, roleController.assignPermissionsToRole);
router.get('/:roleId/with-permissions', authenticateToken, requireAdmin, roleController.getRoleWithPermissions);

// Rutas para verificar permisos (acceso para usuarios autenticados)
router.get('/user/:userId/permissions', authenticateToken, roleController.getUserPermissions);
router.get('/user/:userId/permission/:permissionName', authenticateToken, roleController.checkUserPermission);

// Ruta para actualizar rol de usuario (solo admin)
router.put('/user/:userId/role', authenticateToken, requireAdmin, roleController.updateUserRole);

export default router;