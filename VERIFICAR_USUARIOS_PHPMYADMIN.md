# Verificación de Usuarios en phpMyAdmin

## 🎯 ¿Dónde están los usuarios?

Los usuarios que creamos están en tu base de datos `gamelibrary` en la tabla `users`. Vamos a verificarlo:

## 🔍 Paso 1: Verificar en phpMyAdmin

### 1. Abre phpMyAdmin
- Ve a http://localhost/phpmyadmin (o la URL que uses)
- Selecciona la base de datos `gamelibrary`

### 2. Verifica la tabla `users`
- Haz clic en la tabla `users` en el panel izquierdo
- Ve a la pestaña "Examinar" (Browse)

### 3. Deberías ver estos registros:

| id | name | email | role_id | created_at |
|----|------|-------|---------|------------|
| 1 | Admin User | admin@test.com | 1 | [fecha] |
| 2 | User Test | user@test.com | 2 | [fecha] |

## 🔐 Contraseñas Encriptadas

Las contraseñas están encriptadas con bcrypt, así que verás algo como:
- **admin@test.com**: `$2b$10$...` (contraseña: `admin123`)
- **user@test.com**: `$2b$10$...` (contraseña: `user123`)

## 📋 Paso 2: Verificar Roles

### Tabla `roles`
- **id 1**: `admin` - Administrador
- **id 2**: `user` - Usuario estándar

### Tabla `permissions`
- **14 permisos** para admin
- **7 permisos** para user

## 🚨 Si No Ves los Usuarios

### Opción 1: Crearlos Manualmente en phpMyAdmin

#### 1. Ve a la tabla `users`
- Haz clic en "Insertar" (Insert)

#### 2. Inserta el Administrador
```sql
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role_id`) VALUES
(1, 'Admin User', 'admin@test.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1);
```

#### 3. Inserta el Usuario Estándar
```sql
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role_id`) VALUES
(2, 'User Test', 'user@test.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2);
```

**Nota**: La contraseña encriptada `$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy` corresponde a `admin123`/`user123`

### Opción 2: Usar el Script (Recomendado)

Si prefieres usar el script que ya creamos:

```bash
cd backend
node create-test-users.js
```

## 🔍 Paso 3: Verificar la Conexión

### 1. Verifica que tu .env tenga los datos correctos
```env
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=gamelibrary
JWT_SECRET=tu_clave_secreta_muy_segura_para_jwt_y_autenticacion_2025
CLIENT_URL=http://localhost:5173
```

### 2. Prueba la conexión
```bash
cd backend
node -e "import('./src/config/db.js').then(db => console.log('✅ Conexión exitosa')).catch(err => console.log('❌ Error:', err))"
```

## 🎯 Credenciales Finales

### Administrador
- **Email**: `admin@test.com`
- **Contraseña**: `admin123`
- **Rol**: `admin`

### Usuario Estándar
- **Email**: `user@test.com`
- **Contraseña**: `user123`
- **Rol**: `user`

## 🛠️ Solución de Problemas

### Problema: "Usuario no encontrado"
**Causa**: Los usuarios no están en la base de datos
**Solución**: Ejecuta el script o créalos manualmente

### Problema: "Contraseña incorrecta"
**Causa**: La contraseña no está encriptada correctamente
**Solución**: Usa el script que encripta automáticamente las contraseñas

### Problema: "Rol no encontrado"
**Causa**: La tabla `roles` no tiene los roles necesarios
**Solución**: Asegúrate de que existan los roles `admin` (id: 1) y `user` (id: 2)

## 📊 Verificación Completa

Para verificar todo el sistema:

```sql
-- Verificar usuarios
SELECT id, name, email, role_id FROM users;

-- Verificar roles
SELECT id, name, description FROM roles;

-- Verificar permisos del admin
SELECT u.name, r.name as rol, COUNT(p.name) as permisos
FROM users u
JOIN roles r ON u.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE u.email = 'admin@test.com'
GROUP BY u.id, r.id;

-- Verificar permisos del usuario
SELECT u.name, r.name as rol, COUNT(p.name) as permisos
FROM users u
JOIN roles r ON u.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE u.email = 'user@test.com'
GROUP BY u.id, r.id;
```

---

**✅ Con estos pasos, los usuarios estarán en tu base de datos y podrás iniciar sesión correctamente!**