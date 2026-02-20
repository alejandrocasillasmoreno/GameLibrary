# Guía de Acceso - Usuarios y Administradores

## 🎯 Credenciales de Prueba

### 📋 Usuarios Disponibles

#### 🔑 Administrador
- **Email**: `admin@test.com`
- **Contraseña**: `admin123` (o la que hayas configurado)
- **Rol**: `admin`
- **Permisos**: Todos los permisos del sistema

#### 👤 Usuario Estándar
- **Email**: `user@test.com`
- **Contraseña**: `user123` (o la que hayas configurado)
- **Rol**: `user`
- **Permisos**: Permisos básicos (reseñas, biblioteca personal)

## 🚀 Cómo Acceder

### Paso 1: Iniciar Sesión

1. **Abre tu frontend** en http://localhost:5173
2. **Haz clic en "Iniciar Sesión"**
3. **Ingresa las credenciales** según el tipo de usuario que quieras probar:

#### Como Administrador
```
Email: admin@test.com
Contraseña: admin123
```

#### Como Usuario Estándar
```
Email: user@test.com  
Contraseña: user123
```

### Paso 2: Verificar Acceso

#### Como Administrador
Después de iniciar sesión como admin, deberías ver:
- ✅ Acceso al **Panel de Administración**
- ✅ Botones para **Crear Juegos**
- ✅ Opciones para **Gestionar Usuarios**
- ✅ Acceso a **Reportes y Estadísticas**
- ✅ Control total del sistema

#### Como Usuario Estándar
Después de iniciar sesión como usuario, deberías ver:
- ✅ Acceso al **Catálogo de Juegos**
- ✅ **Biblioteca Personal**
- ✅ **Reseñas Comunitarias**
- ❌ **Sin acceso** al Panel de Administración
- ❌ **Sin acceso** a gestión de usuarios
- ❌ **Sin acceso** a creación de juegos

## 🎨 Diferencias Visuales

### Interfaz de Administrador
```jsx
// En el Dashboard, el admin verá:
{isAdmin() && (
    <div className="admin-section">
        <h2>Panel de Administración</h2>
        <AdminPanel />
    </div>
)}

{hasPermission('create_game') && (
    <button>Crear Nuevo Juego</button>
)}
```

### Interfaz de Usuario Estándar
```jsx
// El usuario verá contenido básico:
<div className="user-content">
    <UserLibrary />
    <GameCatalog />
    <CommunityReviews />
</div>

// Pero NO verá:
// - Panel de Administración
// - Botones de creación de juegos
// - Gestión de usuarios
```

## 🔍 Pruebas de Funcionalidad

### Como Administrador - Pruebas Recomendadas

1. **Accede al Panel de Administración**
   - URL: `/admin` (si tienes rutas protegidas)
   - Verifica que se cargue el contenido de administración

2. **Prueba la creación de roles**
   - Intenta crear un nuevo rol
   - Verifica que el sistema permita la creación

3. **Gestión de usuarios**
   - Accede a la gestión de usuarios
   - Verifica que puedas ver todos los usuarios

4. **Permisos completos**
   - Prueba todas las funcionalidades del sistema
   - Verifica que no haya restricciones

### Como Usuario Estándar - Pruebas Recomendadas

1. **Acceso básico**
   - Verifica que puedas acceder al catálogo
   - Verifica que puedas ver tu biblioteca

2. **Reseñas**
   - Intenta crear una reseña
   - Verifica que puedas editar/borrar tus reseñas

3. **Acceso denegado**
   - Intenta acceder al Panel de Administración
   - Debe mostrarse un mensaje de "Acceso Denegado"

4. **Biblioteca personal**
   - Añade juegos a tu biblioteca
   - Edita el estado de los juegos

## 🛡️ Pruebas de Seguridad

### Verificación de Permisos

#### Como Usuario Estándar - Intenta Acceder a:
```jsx
// Estas rutas deben denegar el acceso:
/admin                    // Panel de Administración
/users                    // Gestión de Usuarios  
/games/manage            // Gestión de Juegos

// Estos botones no deben mostrarse:
"Crear Juego"           // create_game
"Eliminar Usuario"      // manage_users
"Moderar Reseñas"       // manage_reviews
```

#### Como Administrador - Verifica:
```jsx
// Acceso total a todas las funcionalidades
// Sin restricciones en ninguna área del sistema
```

## 🔧 Si No Puedes Acceder

### Problemas Comunes

#### 1. Usuario No Existe
Si los usuarios no existen en la base de datos:

**Solución**: Regístralos manualmente o usa el endpoint de registro:
```bash
# Registro de Admin
POST /api/auth/register
{
    "username": "Admin User",
    "email": "admin@test.com", 
    "password": "admin123"
}

# Registro de Usuario
POST /api/auth/register
{
    "username": "User Test",
    "email": "user@test.com",
    "password": "user123"
}
```

#### 2. Base de Datos Reiniciada
Si reiniciaste la base de datos y perdiste los usuarios:

**Solución**: Vuelve a ejecutar el script de inicialización:
```bash
cd backend
node init-db.js
```

#### 3. Token JWT Inválido
Si el token está corrupto o expirado:

**Solución**: 
1. Cierra sesión
2. Vuelve a iniciar sesión con las credenciales correctas
3. Verifica que el backend esté corriendo

### Verificación de Base de Datos

Para verificar que los usuarios existan:

```sql
-- Consulta para ver usuarios
SELECT id, name, email, role_id FROM users;

-- Consulta para ver roles
SELECT id, name, description FROM roles;

-- Consulta para ver permisos de un usuario
SELECT u.name, r.name as rol, p.name as permiso
FROM users u
JOIN roles r ON u.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE u.email = 'admin@test.com';
```

## 📊 Permisos por Rol

### Administrador (admin@test.com)
- ✅ **Todos los permisos**
- ✅ Panel de Administración
- ✅ Crear/Editar/Eliminar Juegos
- ✅ Gestionar Usuarios
- ✅ Moderar Reseñas
- ✅ Ver Reportes
- ✅ Gestionar Roles y Permisos

### Usuario Estándar (user@test.com)
- ✅ Crear Reseñas
- ✅ Editar/Borrar sus Reseñas
- ✅ Ver Reseñas Comunitarias
- ✅ Biblioteca Personal
- ✅ Catálogo de Juegos
- ❌ Panel de Administración
- ❌ Gestionar Usuarios
- ❌ Crear Juegos
- ❌ Moderar Contenido

## 🎯 Consejos Finales

1. **Prueba ambos roles** para verificar que el sistema funciona correctamente
2. **Verifica las restricciones** de acceso para el usuario estándar
3. **Confirma que el admin tenga acceso total** sin restricciones
4. **Prueba la seguridad** intentando acceder a áreas restringidas
5. **Documenta cualquier problema** que encuentres para solucionarlo

---

**¡Listo! Ahora puedes probar tu sistema de roles y permisos con ambos tipos de usuarios!**