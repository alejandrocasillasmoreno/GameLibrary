import fetch from 'node-fetch';

console.log('🔍 Diagnosticando problema de login...\n');

// Configuración
const API_BASE = 'http://localhost:3000/api';
const ADMIN_CREDENTIALS = {
    email: 'admin@test.com',
    password: 'admin123'
};

async function diagnosticar() {
    try {
        console.log('1. 🌐 Verificando conexión al backend...');
        const healthResponse = await fetch(`${API_BASE}/health`);
        const healthData = await healthResponse.json();
        console.log(`   ✅ Backend responde: ${healthData.message}`);
        
        console.log('\n2. 🔐 Probando login directo...');
        const loginResponse = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ADMIN_CREDENTIALS)
        });
        
        console.log(`   📊 Status: ${loginResponse.status} ${loginResponse.statusText}`);
        
        if (loginResponse.status === 200) {
            const loginData = await loginResponse.json();
            console.log('   ✅ Login exitoso!');
            console.log(`   🎯 Token generado: ${loginData.token ? 'Sí' : 'No'}`);
            console.log(`   👤 Usuario: ${loginData.user?.name}`);
            console.log(`   🏷️  Rol: ${loginData.user?.role}`);
            return;
        } else {
            const errorData = await loginResponse.json();
            console.log(`   ❌ Error: ${errorData.message || 'Error desconocido'}`);
        }
        
        console.log('\n3. 🗄️  Verificando base de datos...');
        try {
            const dbResponse = await fetch(`${API_BASE}/auth/test-db`);
            const dbData = await dbResponse.json();
            console.log(`   📊 Status: ${dbResponse.status}`);
            console.log(`   📋 Usuarios: ${dbData.users || 'No verificado'}`);
            console.log(`   🏷️  Roles: ${dbData.roles || 'No verificado'}`);
        } catch (dbError) {
            console.log(`   ⚠️  No se pudo verificar base de datos: ${dbError.message}`);
        }
        
        console.log('\n4. 🔧 Soluciones recomendadas:');
        console.log('   a) Verifica que el backend esté corriendo en http://localhost:3000');
        console.log('   b) Revisa el JWT_SECRET en backend/.env');
        console.log('   c) Verifica las contraseñas en la base de datos');
        console.log('   d) Reinicia el backend después de cualquier cambio');
        console.log('   e) Prueba con otro navegador o modo incógnito');
        
    } catch (error) {
        console.log(`❌ Error de conexión: ${error.message}`);
        console.log('\n💡 Posibles causas:');
        console.log('   - Backend no está corriendo');
        console.log('   - Puerto 3000 ocupado por otro proceso');
        console.log('   - Firewall bloqueando la conexión');
        console.log('   - Problema de red');
    }
}

diagnosticar();