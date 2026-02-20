// Script de prueba para diagnosticar el problema de actualización de biblioteca
// Este script simula la actualización de estado de un juego

const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000';
const TEST_TOKEN = 'TU_TOKEN_AQUI'; // Reemplaza con un token válido
const TEST_ENTRY_ID = 1; // Reemplaza con un ID real de tu tabla user_library

async function testLibraryUpdate() {
  console.log('🧪 Iniciando prueba de actualización de biblioteca...\n');
  
  // Paso 1: Obtener el estado actual
  console.log('1️⃣ Obteniendo estado actual del juego...');
  try {
    const getResponse = await fetch(`${API_URL}/api/library/game/${TEST_ENTRY_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    
    const currentGame = await getResponse.json();
    console.log('Estado actual:', currentGame);
    
    // Paso 2: Cambiar el estado
    const newStatus = currentGame.status === 'pending' ? 'playing' : 'pending';
    console.log(`\n2️⃣ Cambiando estado de "${currentGame.status}" a "${newStatus}"...`);
    
    const updateResponse = await fetch(`${API_URL}/api/library/${TEST_ENTRY_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_TOKEN}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    
    const updateResult = await updateResponse.json();
    console.log('Resultado de actualización:', updateResult);
    
    // Paso 3: Verificar el cambio
    console.log('\n3️⃣ Verificando el cambio...');
    const verifyResponse = await fetch(`${API_URL}/api/library/game/${TEST_ENTRY_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    
    const updatedGame = await verifyResponse.json();
    console.log('Estado después de actualización:', updatedGame);
    
    // Paso 4: Conclusión
    console.log('\n📊 Resultado de la prueba:');
    if (updatedGame.status === newStatus) {
      console.log('✅ ¡Éxito! El estado se actualizó correctamente');
    } else {
      console.log('❌ Fallo: El estado no se actualizó');
      console.log(`   Esperado: ${newStatus}, Obtenido: ${updatedGame.status}`);
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
}

// Para usar este script:
// 1. Instala node-fetch: npm install node-fetch@2
// 2. Reemplaza TEST_TOKEN y TEST_ENTRY_ID con valores reales
// 3. Ejecuta: node test-library-update.js

console.log('Para usar este script:');
console.log('1. Instala node-fetch: npm install node-fetch@2');
console.log('2. Reemplaza TEST_TOKEN y TEST_ENTRY_ID con valores reales');
console.log('3. Ejecuta: node test-library-update.js');