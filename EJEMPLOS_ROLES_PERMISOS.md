# Ejemplos de Uso del Sistema de Roles y Permisos

## 🎯 Introducción

Este documento proporciona ejemplos prácticos de cómo implementar y usar el sistema de roles y permisos en diferentes partes de la aplicación GameLibrary.

## 📁 Estructura de Ejemplos

### 1. Componentes Frontend

#### Ejemplo 1: Componente de Dashboard con Contenido Condicional

```jsx
// Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminPanel from './AdminPanel';
import UserLibrary from './UserLibrary';
import GameCatalog from './GameCatalog';

const Dashboard = () => {
    const { user, hasPermission, isAdmin } = useAuth();

    return (
        <div className="dashboard">
            <h1>Panel de Control</h1>
            
            {/* Contenido basado en rol */}
            {isAdmin() && (
                <div className="admin-section">
                    <h2>Sección de Administración</h2>
                    <AdminPanel />
                </div>
            )}
            
            {/* Contenido basado en permisos */}
            {hasPermission('view_all_reviews') && (
                <div className="reviews-section">
                    <h2>Reseñas Comunitarias</h2>
                    <CommunityReviews />
                </div>
            )}
            
            {/* Contenido para todos los usuarios */}
            <div className="user-content">
                <UserLibrary />
                <GameCatalog />
            </div>
        </div>
    );
};

export default Dashboard;
```

#### Ejemplo 2: Componente de Gestión de Juegos

```jsx
// GameManagement.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const GameManagement = () => {
    const { hasPermission } = useAuth();
    const [games, setGames] = useState([]);

    const handleCreateGame = () => {
        // Lógica para crear juego
    };

    const handleEditGame = (gameId) => {
        // Lógica para editar juego
    };

    const handleDeleteGame = (gameId) => {
        // Lógica para eliminar juego
    };

    return (
        <div className="game-management">
            <h2>Gestión de Juegos</h2>
            
            {/* Botón de creación solo para usuarios con permiso */}
            {hasPermission('create_game') && (
                <button onClick={handleCreateGame} className="btn-create">
                    Crear Nuevo Juego
                </button>
            )}
            
            <div className="games-list">
                {games.map(game => (
                    <div key={game.id} className="game-item">
                        <h3>{game.title}</h3>
                        
                        {/* Acciones condicionales basadas en permisos */}
                        <div className="game-actions">
                            {hasPermission('edit_game') && (
                                <button 
                                    onClick={() => handleEditGame(game.id)}
                                    className="btn-edit"
                                >
                                    Editar
                                </button>
                            )}
                            
                            {hasPermission('delete_game') && (
                                <button 
                                    onClick={() => handleDeleteGame(game.id)}
                                    className="btn-delete"
                                >
                                    Eliminar
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameManagement;
```

#### Ejemplo 3: Componente de Gestión de Usuarios

```jsx
// UserManagement.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

const UserManagement = () => {
    const { hasPermission, isAdmin } = useAuth();

    if (!hasPermission('manage_users') && !isAdmin()) {
        return (
            <div className="access-denied">
                <h3>Acceso Denegado</h3>
                <p>No tienes permisos para gestionar usuarios.</p>
            </div>
        );
    }

    return (
        <div className="user-management">
            <h2>Gestión de Usuarios</h2>
            
            {/* Funcionalidades avanzadas solo para admin */}
            {isAdmin() && (
                <div className="admin-actions">
                    <button className="btn-danger">Suspender Usuario</button>
                    <button className="btn-warning">Cambiar Rol</button>
                </div>
            )}
            
            {/* Funcionalidades básicas para usuarios con permiso de gestión */}
            {hasPermission('manage_users') && (
                <div className="user-list">
                    {/* Lista de usuarios */}
                </div>
            )}
        </div>
    );
};

export default UserManagement;
```

#### Ejemplo 4: Componente de Reseñas con Control de Acceso

```jsx
// ReviewManagement.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

const ReviewManagement = () => {
    const { hasPermission, isAdmin } = useAuth();

    return (
        <div className="review-management">
            <h2>Gestión de Reseñas</h2>
            
            {/* Contenido basado en diferentes niveles de permisos */}
            <div className="review-actions">
                {/* Crear reseña - permiso básico */}
                {hasPermission('create_review') && (
                    <button className="btn-primary">Escribir Reseña</button>
                )}
                
                {/* Editar/Borrar reseñas propias - permiso estándar */}
                {hasPermission('edit_review') && hasPermission('delete_review') && (
                    <div className="own-reviews-actions">
                        <button className="btn-secondary">Editar Mis Reseñas</button>
                        <button className="btn-danger">Eliminar Mis Reseñas</button>
                    </div>
                )}
                
                {/* Gestionar todas las reseñas - permiso de admin */}
                {hasPermission('manage_reviews') && (
                    <div className="all-reviews-actions">
                        <button className="btn-warning">Moderar Reseñas</button>
                        <button className="btn-danger">Eliminar Reseñas</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewManagement;
```

### 2. Rutas Protegidas

#### Ejemplo 5: Router con Protección de Rutas

```jsx
// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import UserManagement from './components/UserManagement';
import GameManagement from './components/GameManagement';
import Login from './components/Login';

// Componente de ruta protegida
const ProtectedRoute = ({ children, requiredPermission, requiredRole }) => {
    const { hasPermission, hasRole, user } = useAuth();
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to="/unauthorized" />;
    }
    
    if (requiredPermission && !hasPermission(requiredPermission)) {
        return <Navigate to="/unauthorized" />;
    }
    
    return children;
};

// Componente de acceso denegado
const Unauthorized = () => (
    <div className="unauthorized">
        <h2>Acceso Denegado</h2>
        <p>No tienes los permisos necesarios para acceder a esta sección.</p>
        <button onClick={() => window.history.back()}>Volver</button>
    </div>
);

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Rutas protegidas por permisos */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                
                <Route path="/admin" element={
                    <ProtectedRoute requiredRole="admin">
                        <AdminPanel />
                    </ProtectedRoute>
                } />
                
                <Route path="/users" element={
                    <ProtectedRoute requiredPermission="manage_users">
                        <UserManagement />
                    </ProtectedRoute>
                } />
                
                <Route path="/games/manage" element={
                    <ProtectedRoute requiredPermission="create_game">
                        <GameManagement />
                    </ProtectedRoute>
                } />
                
                {/* Ruta por defecto */}
                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Router>
    );
};

export default App;
```

### 3. Hooks Personalizados

#### Ejemplo 6: Hook para Verificación de Permisos

```jsx
// hooks/usePermissions.js
import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
    const { hasPermission, hasRole, isAdmin } = useAuth();

    // Hook para verificar múltiples permisos
    const hasAllPermissions = (permissions) => {
        return permissions.every(permission => hasPermission(permission));
    };

    // Hook para verificar al menos un permiso
    const hasAnyPermission = (permissions) => {
        return permissions.some(permission => hasPermission(permission));
    };

    // Hook para verificar permisos de administración
    const canManage = (resource) => {
        return isAdmin() || hasPermission(`manage_${resource}`);
    };

    // Hook para verificar permisos CRUD
    const canCRUD = (resource) => {
        return {
            create: hasPermission(`create_${resource}`),
            read: hasPermission(`view_${resource}`),
            update: hasPermission(`edit_${resource}`),
            delete: hasPermission(`delete_${resource}`)
        };
    };

    return {
        hasAllPermissions,
        hasAnyPermission,
        canManage,
        canCRUD,
        isAdmin
    };
};

// Uso del hook
const MyComponent = () => {
    const { hasAllPermissions, hasAnyPermission, canManage, canCRUD } = usePermissions();

    const gamePermissions = canCRUD('game');
    const canManageUsers = canManage('users');
    const hasAdminTools = hasAnyPermission(['manage_users', 'view_reports', 'manage_reviews']);

    return (
        <div>
            {gamePermissions.create && <button>Crear Juego</button>}
            {canManageUsers && <UserManagement />}
            {hasAdminTools && <AdminTools />}
        </div>
    );
};
```

### 4. Backend - Controladores con Autorización

#### Ejemplo 7: Controlador de Juegos con Permisos

```javascript
// controllers/gameController.js
import * as gameService from '../services/gameService.js';
import { requirePermission } from '../middleware/auth.js';

// Crear juego - requiere permiso create_game
export const createGame = [
    requirePermission('create_game'),
    async (req, res) => {
        try {
            const gameData = req.body;
            const gameId = await gameService.createGame(gameData);
            res.status(201).json({ message: 'Juego creado exitosamente', gameId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
];

// Editar juego - requiere permiso edit_game
export const updateGame = [
    requirePermission('edit_game'),
    async (req, res) => {
        try {
            const { id } = req.params;
            const gameData = req.body;
            const updated = await gameService.updateGame(id, gameData);
            if (!updated) {
                return res.status(404).json({ message: 'Juego no encontrado' });
            }
            res.json({ message: 'Juego actualizado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
];

// Eliminar juego - requiere permiso delete_game
export const deleteGame = [
    requirePermission('delete_game'),
    async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await gameService.deleteGame(id);
            if (!deleted) {
                return res.status(404).json({ message: 'Juego no encontrado' });
            }
            res.json({ message: 'Juego eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
];

// Obtener juegos - acceso público
export const getGames = async (req, res) => {
    try {
        const games = await gameService.getGames();
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
```

#### Ejemplo 8: Controlador de Usuarios con Roles

```javascript
// controllers/userController.js
import * as userService from '../services/userService.js';
import { requireRole, requirePermission } from '../middleware/auth.js';

// Obtener todos los usuarios - solo admin
export const getAllUsers = [
    requireRole('admin'),
    async (req, res) => {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
];

// Actualizar rol de usuario - solo admin
export const updateUserRole = [
    requireRole('admin'),
    async (req, res) => {
        try {
            const { userId } = req.params;
            const { roleId } = req.body;
            const updated = await userService.updateUserRole(userId, roleId);
            if (!updated) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.json({ message: 'Rol de usuario actualizado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
];

// Obtener perfil de usuario - acceso propio o admin
export const getUserProfile = [
    requirePermission('view_reports'), // Permisos básicos para ver perfiles
    async (req, res) => {
        try {
            const { userId } = req.params;
            const { user } = req; // Usuario autenticado
            
            // Solo el usuario mismo o un admin pueden ver el perfil
            if (user.id !== parseInt(userId) && !user.role.name === 'admin') {
                return res.status(403).json({ message: 'Acceso denegado' });
            }
            
            const profile = await userService.getUserProfile(userId);
            res.json(profile);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
];
```

### 5. Estilos CSS para Contenido Condicional

#### Ejemplo 9: CSS para Componentes con Acceso Condicional

```css
/* styles/permissions.css */

/* Contenido oculto por defecto */
.hidden-content {
    display: none;
}

/* Contenido visible según permisos */
.has-create-game .create-game-btn {
    display: inline-block;
}

.has-edit-game .edit-game-btn {
    display: inline-block;
}

.has-delete-game .delete-game-btn {
    display: inline-block;
}

.has-manage-users .user-management {
    display: block;
}

.has-admin-access .admin-panel {
    display: block;
}

/* Estilos para acceso denegado */
.access-denied {
    background: linear-gradient(145deg, #2a1e1e, #3a2a2a);
    border: 2px solid #e74c3c;
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    color: #fff;
    box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
}

.access-denied h3 {
    color: #e74c3c;
    margin-bottom: 1rem;
}

.access-denied p {
    color: #ccc;
    margin-bottom: 1.5rem;
}

/* Botones con diferentes estilos según permisos */
.permission-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
}

.permission-btn:not(.has-permission) {
    background: #ccc;
    color: #666;
    cursor: not-allowed;
    opacity: 0.5;
}

.permission-btn.has-permission {
    background: #27ae60;
    color: white;
}

.permission-btn.has-permission:hover {
    background: #2ecc71;
    transform: translateY(-2px);
}

/* Panel de administración */
.admin-panel {
    border: 2px solid #f39c12;
    border-radius: 12px;
    padding: 1rem;
    background: rgba(243, 156, 18, 0.1);
}

.admin-panel h2 {
    color: #f39c12;
    margin-top: 0;
}

/* Animaciones para transiciones suaves */
.fade-in {
    animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
```

### 6. Pruebas y Validación

#### Ejemplo 10: Pruebas de Permisos

```javascript
// tests/permissions.test.js
import { describe, it, expect } from '@jest/globals';
import { hasPermission, hasRole, isAdmin } from '../src/context/AuthContext';

describe('Sistema de Permisos', () => {
    const mockUser = {
        id: 1,
        name: 'Test User',
        role: { name: 'admin' },
        permissions: [
            { name: 'create_game' },
            { name: 'edit_game' },
            { name: 'delete_game' },
            { name: 'manage_users' }
        ]
    };

    describe('hasPermission', () => {
        it('debería retornar true para permisos existentes', () => {
            expect(hasPermission('create_game')).toBe(true);
            expect(hasPermission('manage_users')).toBe(true);
        });

        it('debería retornar false para permisos inexistentes', () => {
            expect(hasPermission('nonexistent_permission')).toBe(false);
        });
    });

    describe('hasRole', () => {
        it('debería retornar true para rol existente', () => {
            expect(hasRole('admin')).toBe(true);
        });

        it('debería retornar false para rol inexistente', () => {
            expect(hasRole('nonexistent_role')).toBe(false);
        });
    });

    describe('isAdmin', () => {
        it('debería retornar true para usuarios admin', () => {
            expect(isAdmin()).toBe(true);
        });
    });
});
```

## 🎯 Mejores Prácticas

### 1. Seguridad en el Frontend
- **Nunca confiar en el frontend**: Siempre validar permisos en el backend
- **Ocultar contenido sensible**: No mostrar opciones que el usuario no puede usar
- **Mensajes claros**: Informar al usuario cuando no tiene permisos

### 2. Seguridad en el Backend
- **Validar en cada endpoint**: Verificar permisos antes de ejecutar acciones
- **Principio de mínimo privilegio**: Otorgar solo los permisos necesarios
- **Logging de seguridad**: Registrar intentos de acceso no autorizado

### 3. Mantenimiento
- **Documentar permisos**: Mantener actualizada la documentación de permisos
- **Pruebas unitarias**: Probar todas las combinaciones de roles y permisos
- **Auditoría regular**: Revisar permisos asignados y roles existentes

### 4. Performance
- **Caché de permisos**: Considerar caché para permisos frecuentemente accedidos
- **Consultas optimizadas**: Minimizar consultas a la base de datos
- **Carga diferida**: Cargar componentes solo cuando el usuario tenga permisos

## 🚀 Implementación Paso a Paso

1. **Definir roles y permisos** según las necesidades del sistema
2. **Crear la estructura de base de datos** (roles, permisos, relaciones)
3. **Implementar middleware de autenticación** y autorización
4. **Crear servicios y controladores** con validación de permisos
5. **Extender AuthContext** con funciones de autorización
6. **Crear componentes con acceso condicional**
7. **Proteger rutas** según roles y permisos
8. **Realizar pruebas** de seguridad y funcionalidad
9. **Documentar** el sistema y sus componentes
10. **Monitorear** el uso y detectar posibles problemas

---

Este sistema de roles y permisos proporciona una base sólida para controlar el acceso en GameLibrary, permitiendo una gestión segura y flexible de los diferentes tipos de usuarios y sus capacidades.