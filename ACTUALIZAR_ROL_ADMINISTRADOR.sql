-- Sentencia SQL para actualizar el rol de un usuario a administrador en phpMyAdmin

-- 1. Verificar los roles disponibles en la tabla roles
SELECT * FROM roles;

-- 2. Verificar el usuario actual (reemplaza con tu ID o email)
SELECT id, name, email, role_id FROM users WHERE id = 2;
-- o por email:
-- SELECT id, name, email, role_id FROM users WHERE email = 'Prueba@gmail.com';

-- 3. Actualizar el role_id del usuario a 1 (admin)
-- Reemplaza el ID 2 con el ID de tu usuario
UPDATE users SET role_id = 1 WHERE id = 2;

-- 4. Verificar el cambio
SELECT u.id, u.name, u.email, r.name as role 
FROM users u 
LEFT JOIN roles r ON u.role_id = r.id 
WHERE u.id = 2;

-- Notas:
-- - role_id = 1 corresponde a 'admin'
-- - role_id = 2 corresponde a 'user'
-- - Si no tienes la tabla roles, primero crea los roles:
--   INSERT INTO roles (name) VALUES ('admin'), ('user');