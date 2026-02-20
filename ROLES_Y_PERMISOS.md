# Sistema de Roles y Permisos - GameLibrary

## 🎯 Visión General

Este documento describe el sistema de roles y permisos implementado en GameLibrary, que permite controlar el acceso a diferentes funcionalidades según el tipo de usuario.

## 🏗️ Arquitectura del Sistema

### Conceptos Clave

- **Rol**: Es un título que se le asigna a un usuario (ej: 'admin', 'user')
- **Permiso**: Es una capacidad específica (ej: 'create_game', 'edit_game', 'delete_game')
- **Relación**: Un rol puede tener múltiples permisos (relación muchos a muchos)

### Estructura de Base de Datos

```sql
-- Tabla de Roles
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Permisos
CREATE TABLE permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Relación Rol-Permiso (Muchos a Muchos)
CREATE TABLE role_permissions (
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Tabla de Usuarios (con campo de rol)
ALTER TABLE users ADD COLUMN role_id INT DEFAULT 2;
ALTER TABLE users ADD FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL;
```

## 📋 Roles y Permisos Definidos

### Roles Disponibles

1. **admin** - Administrador del sistema con todos los permisos
2. **user** - Usuario estándar con permisos básicos

### Permisos del Sistema

#### Gestión de Juegos
- `create_game` - Crear nuevos juegos en el catálogo
- `edit_game` - Editar juegos existentes
- `delete_game` - Eliminar juegos del catálogo
- `manage_catalog` - Gestionar el catálogo de juegos

#### Gestión de Usuarios
- `manage_users` - Gestionar usuarios del sistema
- `view_reports` - Ver reportes y estadísticas

#### Gestión de Reseñas
- `manage_reviews` - Gestionar reseñas de usuarios
- `create_review` - Crear reseñas de juegos
- `edit_review` - Editar reseñas propias
- `delete_review` - Eliminar reseñas propias
- `view_all_reviews` - Ver todas las reseñas

#### Gestión de Biblioteca Personal
- `add_to_library` - Añadir juegos a la biblioteca personal
- `edit_library` - Editar juegos en la biblioteca personal
- `delete_library` - Eliminar juegos de la biblioteca personal

### Asignación de Permisos por Rol

#### Admin (Todos los permisos)
- ✅ create_game, edit_game, delete_game, manage_catalog
- ✅ manage_users, view_reports
- ✅ manage_reviews, create_review, edit_review, delete_review, view_all_reviews
- ✅ add_to_library, edit_library, delete_library

#### User (Permisos básicos)
- ❌ create_game, edit_game, delete_game, manage_catalog
- ❌ manage_users, view_reports
- ❌ manage_reviews
- ✅ create_review, edit_review, delete_review, view_all_reviews
- ✅ add_to_library, edit_library, delete_library

## 🔧 Implementación Backend

### Middleware de Autenticación

#### authenticateToken
Verifica la autenticación JWT y carga los datos del usuario.

```javascript
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
```

#### requireRole
Verifica si el usuario tiene un rol específico.

```javascript
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
```

#### requirePermission
Verifica si el usuario tiene un permiso específico.

```javascript
export const requirePermission = (permissionName) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Acceso denegado. Usuario no autenticado.' });
        }
        
        const [roles] = await pool.query('SELECT * FROM roles WHERE id = ?', [req.user.role_id]);
        
        if (roles.length === 0) {
            return res.status(403).json({ message: 'Acceso denegado. Rol no encontrado.' });
        }
        
        const userRole = roles[0];
        
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
```

### Servicios

#### roleService.js
Contiene todas las funciones para gestionar roles y permisos.

```javascript
// Obtener todos los roles
export const getAllRoles = async () => {
    const [rows] = await pool.query('SELECT * FROM roles ORDER BY name');
    return rows;
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
```

### Rutas API

#### Rutas de Roles y Permisos

```javascript
// Rutas para roles (solo admin)
router.get('/', authenticateToken, requireAdmin, roleController.getAllRoles);
router.post('/', authenticateToken, requireAdmin, roleController.createRole);
router.put('/:id', authenticateToken, requireAdmin, roleController.updateRole);
router.delete('/:id', authenticateToken, requireAdmin, roleController.deleteRole);

// Rutas para permisos (acceso para admin)
router.get('/permissions', authenticateToken, requireAdmin, roleController.getAllPermissions);
router.get('/:roleId/permissions', authenticateToken, requireAdmin, roleController.getPermissionsByRole);

// Rutas para verificar permisos (acceso para usuarios autenticados)
router.get('/user/:userId/permissions', authenticateToken, roleController.getUserPermissions);
router.get('/user/:userId/permission/:permissionName', authenticateToken, roleController.checkUserPermission);
```

## 🎨 Implementación Frontend

### AuthContext

El AuthContext se ha extendido para incluir funciones de autorización:

```javascript
// Funciones para verificar roles y permisos
const hasRole = (roleName) => {
    return user && user.role && user.role.name === roleName;
};

const hasPermission = (permissionName) => {
    return user && user.permissions && user.permissions.some(p => p.name === permissionName);
};

const hasAnyPermission = (permissionNames) => {
    return user && user.permissions && 
           user.permissions.some(p => permissionNames.includes(p.name));
};

const isAdmin = () => {
    return hasRole('admin');
};
```

### Uso en Componentes

#### Verificación de Rol

```javascript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
    const { hasRole, isAdmin } = useAuth();
    
    if (hasRole('admin')) {
        // Mostrar contenido para administradores
    }
    
    if (isAdmin()) {
        // Mostrar contenido para administradores
    }
    
    return (
        <div>
            {hasRole('admin') && <AdminPanel />}
            {hasRole('user') && <UserPanel />}
        </div>
    );
};
```

#### Verificación de Permisos

```javascript
const MyComponent = () => {
    const { hasPermission, hasAnyPermission } = useAuth();
    
    return (
        <div>
            {hasPermission('create_game') && (
                <button>Crear Juego</button>
            )}
            
            {hasAnyPermission(['edit_game', 'delete_game']) && (
                <div>
                    <button>Editar</button>
                    <button>Eliminar</button>
                </div>
            )}
        </div>
    );
};
```

## 🚀 Ejemplos de Uso

### Componente de Panel de Administración

```javascript
const AdminPanel = () => {
    const { user, hasPermission, isAdmin } = useAuth();
    
    // Verificar acceso al panel
    if (!isAdmin() && !hasPermission('view_reports')) {
        return <AccessDenied />;
    }
    
    return (
        <div>
            <h2>Panel de Administración</h2>
            {hasPermission('create_game') && <CreateGameForm />}
            {hasPermission('manage_users') && <UserManagement />}
        </div>
    );
};
```

### Protección de Rutas

```javascript
// En App.jsx o en el router
const ProtectedRoute = ({ children, requiredPermission }) => {
    const { hasPermission } = useAuth();
    
    if (!hasPermission(requiredPermission)) {
        return <Navigate to="/unauthorized" />;
    }
    
    return children;
};

// Uso
<ProtectedRoute requiredPermission="manage_users">
    <UserManagement />
</ProtectedRoute>
```

### Botones Condicionales

```javascript
const GameActions = ({ gameId }) => {
    const { hasPermission } = useAuth();
    
    return (
        <div>
            {hasPermission('edit_game') && (
                <button onClick={() => editGame(gameId)}>
                    Editar Juego
                </button>
            )}
            
            {hasPermission('delete_game') && (
                <button onClick={() => deleteGame(gameId)}>
                    Eliminar Juego
                </button>
            )}
        </div>
    );
};
```

## 🔍 API Endpoints

### Endpoints de Roles

- `GET /api/roles` - Obtener todos los roles (admin)
- `GET /api/roles/:id` - Obtener un rol por ID (admin)
- `POST /api/roles` - Crear un nuevo rol (admin)
- `PUT /api/roles/:id` - Actualizar un rol (admin)
- `DELETE /api/roles/:id` - Eliminar un rol (admin)

### Endpoints de Permisos

- `GET /api/roles/permissions` - Obtener todos los permisos (admin)
- `GET /api/roles/:roleId/permissions` - Obtener permisos por rol (admin)
- `POST /api/roles/:roleId/permissions` - Asignar permisos a un rol (admin)

### Endpoints de Verificación

- `GET /api/roles/user/:userId/permissions` - Obtener permisos de un usuario
- `GET /api/roles/user/:userId/permission/:permissionName` - Verificar permiso específico

## 🛡️ Seguridad

### Validaciones

1. **Autenticación**: Todas las rutas están protegidas por `authenticateToken`
2. **Autorización**: Se verifica el rol o permiso necesario antes de ejecutar acciones
3. **Validación de Datos**: Se validan todos los parámetros de entrada
4. **Errores Controlados**: Se manejan los errores de manera segura

### Mejores Prácticas

1. **Principio de Mínimo Privilegio**: Los usuarios solo tienen los permisos necesarios
2. **Validación en Backend**: Nunca confiar en el frontend para validaciones de seguridad
3. **Logging**: Se registra la actividad de los usuarios para auditoría
4. **JWT Seguro**: Uso de tokens JWT con expiración y secret seguro

## 🔄 Extensibilidad

### Añadir Nuevos Roles

1. Insertar el nuevo rol en la tabla `roles`
2. Asignar los permisos necesarios en la tabla `role_permissions`

### Añadir Nuevos Permisos

1. Insertar el nuevo permiso en la tabla `permissions`
2. Asignar el permiso a los roles que lo necesiten en `role_permissions`

### Crear Nuevas Funciones de Autorización

```javascript
// En AuthContext
const hasDepartmentAccess = (department) => {
    return hasPermission(`access_${department}`) || isAdmin();
};

// Uso en componentes
{hasDepartmentAccess('inventory') && <InventoryPanel />}
```

## 📊 Monitorización

### Métricas de Seguridad

- Intentos de acceso no autorizado
- Permisos más utilizados
- Roles con más actividad
- Errores de autenticación

### Auditoría

- Registro de todas las acciones protegidas
- Historial de cambios en roles y permisos
- Acceso a recursos sensibles

## 🎯 Beneficios del Sistema

1. **Seguridad**: Control de acceso granular
2. **Flexibilidad**: Fácil de extender y modificar
3. **Mantenibilidad**: Código limpio y organizado
4. **Auditoría**: Seguimiento de actividades
5. **Escalabilidad**: Sistema preparado para crecer

## 🚨 Consideraciones

1. **Rendimiento**: Las consultas de permisos pueden afectar el rendimiento
2. **Caché**: Considerar implementar caché para permisos
3. **Consistencia**: Mantener sincronizados roles y permisos entre entornos
4. **Documentación**: Mantener actualizada la documentación de permisos

---

**Nota**: Este sistema proporciona una base sólida para la gestión de roles y permisos en GameLibrary, permitiendo un control de acceso robusto y flexible.