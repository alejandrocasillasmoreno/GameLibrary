# Solución de Error 401 - Unauthorized

## 🚨 Problema Detectado
Error: `Failed to load resource: the server responded with a status of 401 (Unauthorized)`

## 🔍 Causas Comunes y Soluciones

### 1. **JWT_SECRET No Coincide** ⚠️ **Causa Más Común**

#### Verifica el JWT_SECRET en backend/.env:
```env
JWT_SECRET=tu_clave_secreta_muy_segura_para_jwt_y_autenticacion_2025
```

#### Verifica que el frontend use el mismo secret:
```javascript
// En authService.js, línea 10
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_muy_segura_para_jwt_y_autenticacion_2025';
```

#### Solución:
1. **Abre backend/.env** y verifica el JWT_SECRET
2. **Abre backend/src/services/authService.js** y verifica que use el mismo secret
3. **Reinicia el backend** después de cualquier cambio

### 2. **Backend No Está Corriendo**

#### Verifica que el backend esté activo:
```bash
# En una terminal nueva
cd backend
npm start
```

#### Verifica que responda:
```bash
# Prueba en tu navegador
http://localhost:3000/api/health
```

**Debe mostrar:** `{"message":"✅ Backend activo"}`

### 3. **Problema con Contraseñas Encriptadas**

#### Verifica las contraseñas en la base de datos:
```sql
-- En phpMyAdmin, ejecuta:
SELECT id, name, email, password, role_id FROM users;
```

#### Las contraseñas deben verse así:
- **admin@test.com**: `$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy`
- **user@test.com**: `$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy`

#### Si las contraseñas están mal, recrea los usuarios:
```bash
cd backend
node create-test-users.js
```

### 4. **Problema con CORS**

#### Verifica el CLIENT_URL en backend/.env:
```env
CLIENT_URL=http://localhost:5173
```

#### Si usas otro puerto, actualízalo:
```env
CLIENT_URL=http://localhost:5173,http://localhost:3000
```

### 5. **Problema con el Frontend**

#### Verifica que el frontend use la URL correcta:
```javascript
// En frontend/src/services/authService.js
const API_BASE_URL = 'http://localhost:3000/api';
```

#### Si el backend está en otro puerto, actualízalo.

## 🛠️ Pasos de Diagnóstico

### Paso 1: Verifica el Backend
```bash
# 1. Verifica que el backend esté corriendo
cd backend
npm start

# 2. Prueba la conexión
curl http://localhost:3000/api/health

# 3. Prueba el login directamente
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'
```

### Paso 2: Verifica el Frontend
```bash
# 1. Verifica que el frontend esté corriendo
cd frontend
npm run dev

# 2. Abre las Developer Tools (F12)
# 3. Ve a la pestaña "Network"
# 4. Intenta iniciar sesión
# 5. Revisa la solicitud de login y la respuesta
```

### Paso 3: Verifica la Base de Datos
```sql
-- Verifica usuarios
SELECT id, name, email, role_id FROM users;

-- Verifica roles
SELECT id, name FROM roles;

-- Verifica que el admin tenga rol 1
SELECT u.name, u.email, r.name as rol 
FROM users u 
JOIN roles r ON u.role_id = r.id 
WHERE u.email = 'admin@test.com';
```

## 🔧 Soluciones Rápidas

### Solución 1: Reinicia Todo
```bash
# 1. Detén todo (Ctrl+C en ambas terminales)

# 2. Reinicia backend
cd backend
npm start

# 3. En otra terminal, reinicia frontend
cd frontend
npm run dev
```

### Solución 2: Verifica JWT_SECRET
```bash
# En backend/.env
echo "JWT_SECRET actual:"
grep JWT_SECRET backend/.env

# En authService.js
echo "JWT_SECRET en código:"
grep -n "JWT_SECRET" backend/src/services/authService.js
```

### Solución 3: Recrea Usuarios
```bash
cd backend
node create-test-users.js
```

### Solución 4: Prueba Login Directo
```bash
# Prueba login desde terminal
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}' \
  -v
```

## 📋 Verificación Final

Después de aplicar las soluciones:

1. **Backend corriendo**: http://localhost:3000/api/health → ✅
2. **Frontend corriendo**: http://localhost:5173 → ✅
3. **Usuarios en BD**: admin@test.com y user@test.com → ✅
4. **JWT_SECRET coincide**: Entre .env y authService.js → ✅
5. **Login funciona**: Prueba con curl o en el frontend → ✅

## 🆘 Si Persiste el Error

### Comprueba estos puntos específicos:

1. **¿El backend muestra errores al iniciar?**
   - Busca errores en la consola del backend

2. **¿El frontend muestra errores de red?**
   - Abre Developer Tools → Network → Intenta login

3. **¿Las credenciales son correctas?**
   - Verifica email y contraseña en la base de datos

4. **¿Hay conflicto de puertos?**
   - Asegúrate que el puerto 3000 esté libre

5. **¿El .env está correcto?**
   - Verifica todas las variables de entorno

---

**💡 Consejo:** El error 401 generalmente indica que el JWT_SECRET no coincide o que el backend no puede validar el token. Comienza por verificar el JWT_SECRET en ambos lados.