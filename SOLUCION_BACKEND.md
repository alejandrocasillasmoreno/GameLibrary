# Solución al Error del Backend

## Problema Identificado
El error "❌ ERROR CRÍTICO: JWT_SECRET no está definido en las variables de entorno" se producía porque había una validación que se ejecutaba al cargar el módulo `authService.js`, antes de que dotenv hubiera cargado completamente las variables de entorno.

## Solución Aplicada

### 1. ✅ Archivo `.env` Creado
He creado el archivo `backend/.env` con la configuración correcta:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=gamelibrary
DB_PORT=3306

# Server Configuration
PORT=3000

# CORS Configuration
CLIENT_URL=http://localhost:5173

# JWT Secret (para autenticación)
JWT_SECRET=tu_clave_secreta_muy_segura_para_jwt_y_autenticacion_2025
```

### 2. ✅ Código del Backend Corregido
He movido la validación de `JWT_SECRET` desde el nivel del módulo a dentro de las funciones donde se usa, para que se ejecute después de que dotenv haya cargado las variables.

## Pasos para que funcione tu backend

### Paso 1: Verificar Base de Datos
Asegúrate de que tienes:
- ✅ XAMPP instalado y funcionando
- ✅ MySQL iniciado en XAMPP
- ✅ Base de datos `gamelibrary` creada
- ✅ Tablas creadas (ejecuta `database.sql`)

### Paso 2: Verificar Archivo .env
El archivo `backend/.env` ya está creado con la configuración correcta. Si necesitas cambiar algo:

1. **JWT_SECRET**: Puedes generar una clave más segura usando:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **DB_PASSWORD**: Si tu MySQL tiene contraseña, cámbiala en el `.env`

### Paso 3: Iniciar Backend
```bash
cd backend
npm install  # Si no lo has hecho antes
node app.js
```

### Paso 4: Verificar que funciona
Deberías ver:
```
JWT_SECRET: ✅ Definido
DB_HOST: localhost
✅ Servidor Backend listo en http://localhost:3000
📍 Prueba salud: http://localhost:3000/api/health
📍 Prueba BD: http://localhost:3000/api/db-test
```

## Pruebas de Funcionamiento

### 1. Prueba de Salud
Abre tu navegador y visita: `http://localhost:3000/api/health`
Deberías ver: `{"message":"✅ Backend activo"}`

### 2. Prueba de Base de Datos
Visita: `http://localhost:3000/api/db-test`
Deberías ver: `{"message":"✅ BD conectada","data":[{"test":1}]}`

### 3. Prueba de Registro/Login
Puedes usar Postman o curl para probar:
```bash
# Registro
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

## Errores Comunes y Soluciones

### Error: "Cannot connect to MySQL"
- **Causa**: MySQL no está iniciado en XAMPP
- **Solución**: Inicia MySQL en XAMPP Control Panel

### Error: "gamelibrary database doesn't exist"
- **Causa**: No has creado la base de datos
- **Solución**: Ejecuta el script `database.sql` en phpMyAdmin

### Error: "JWT_SECRET still not defined"
- **Causa**: El archivo `.env` no se está cargando
- **Solución**: Verifica que el archivo `backend/.env` existe y tiene el formato correcto

## Configuración en phpMyAdmin (si es necesario)

1. Abre phpMyAdmin: `http://localhost/phpmyadmin`
2. Ve a "Bases de datos"
3. Crea una nueva base de datos llamada `gamelibrary`
4. Selecciona la base de datos y haz clic en "Importar"
5. Sube el archivo `database.sql` desde tu proyecto
6. Haz clic en "Ejecutar"

## ✅ Listo!
Tu backend debería funcionar correctamente ahora. El error de JWT_SECRET ha sido resuelto y el servidor debería iniciar sin problemas.