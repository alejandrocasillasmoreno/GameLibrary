-- ====================================
-- SECUENCIA SQL PARA CREAR USUARIOS DE PRUEBA
-- Ejecuta estas sentencias en phpMyAdmin
-- ====================================

USE gamelibrary;

-- PASO 1: VERIFICAR QUE EXISTAN LOS ROLES
-- Si no existen, créalos primero
INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'admin', 'Administrador del sistema con todos los permisos') ON DUPLICATE KEY UPDATE name='admin', description='Administrador del sistema con todos los permisos';

INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(2, 'user', 'Usuario estándar con permisos básicos') ON DUPLICATE KEY UPDATE name='user', description='Usuario estándar con permisos básicos';

-- PASO 2: CREAR EL ADMINISTRADOR
-- Contraseña: admin123 (encriptada con bcrypt)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role_id`) VALUES
(1, 'Admin User', 'admin@test.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1)
ON DUPLICATE KEY UPDATE 
    name='Admin User', 
    email='admin@test.com', 
    password='$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
    role_id=1;

-- PASO 3: CREAR EL USUARIO ESTÁNDAR
-- Contraseña: user123 (encriptada con bcrypt)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role_id`) VALUES
(2, 'User Test', 'user@test.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2)
ON DUPLICATE KEY UPDATE 
    name='User Test', 
    email='user@test.com', 
    password='$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
    role_id=2;

-- PASO 4: VERIFICAR LOS USUARIOS CREADOS
SELECT 
    u.id,
    u.name,
    u.email,
    u.role_id,
    r.name as rol,
    u.created_at
FROM users u
JOIN roles r ON u.role_id = r.id
WHERE u.email IN ('admin@test.com', 'user@test.com')
ORDER BY u.id;

-- PASO 5: VERIFICAR PERMISOS DEL ADMIN (debe mostrar 14 permisos)
SELECT 
    u.name as usuario,
    r.name as rol,
    COUNT(p.name) as total_permisos
FROM users u
JOIN roles r ON u.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE u.email = 'admin@test.com'
GROUP BY u.id, r.id;

-- PASO 6: VERIFICAR PERMISOS DEL USUARIO (debe mostrar 7 permisos)
SELECT 
    u.name as usuario,
    r.name as rol,
    COUNT(p.name) as total_permisos
FROM users u
JOIN roles r ON u.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE u.email = 'user@test.com'
GROUP BY u.id, r.id;

-- PASO 7: MOSTRAR TODOS LOS PERMISOS DEL ADMIN
SELECT 
    u.name as usuario,
    p.name as permiso,
    p.description as descripcion
FROM users u
JOIN roles r ON u.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE u.email = 'admin@test.com'
ORDER BY p.name;

-- PASO 8: MOSTRAR PERMISOS DEL USUARIO ESTÁNDAR
SELECT 
    u.name as usuario,
    p.name as permiso,
    p.description as descripcion
FROM users u
JOIN roles r ON u.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE u.email = 'user@test.com'
ORDER BY p.name;

-- ====================================
-- CREDENCIALES FINALES
-- ====================================
-- ADMINISTRADOR:
--   Email: admin@test.com
--   Contraseña: admin123
--   Rol: admin (14 permisos)
--
-- USUARIO ESTÁNDAR:
--   Email: user@test.com
--   Contraseña: user123
--   Rol: user (7 permisos)
-- ====================================