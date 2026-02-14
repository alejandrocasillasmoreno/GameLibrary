require('dotenv').config(); // Si usas variables de entorno
const axios = require('axios');
const mysql = require('mysql2/promise');

// --- CONFIGURACIÓN ---
const RAWG_API_KEY = process.env.RAWG_API_KEY;
const PAGES_TO_FETCH = 5; // 5 páginas x 40 juegos = 200 juegos (Objetivo cumplido)
const PAGE_SIZE = 40;

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gamelibrary'
};

async function seedDatabase() {
    let connection;
    try {
        console.log('🔌 Conectando a la base de datos...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conexión exitosa.');

        console.log('📥 Iniciando descarga de juegos desde RAWG...');

        // Bucle para recorrer varias páginas de la API
        for (let page = 1; page <= PAGES_TO_FETCH; page++) {
            console.log(`   > Descargando página ${page} de ${PAGES_TO_FETCH}...`);
            
            // Petición a la API
            const response = await axios.get(`https://api.rawg.io/api/games`, {
                params: {
                    key: RAWG_API_KEY,
                    page_size: PAGE_SIZE,
                    page: page
                }
            });

            const games = response.data.results;

            // Procesar e insertar cada juego
            for (const game of games) {
                // 1. Convertir Arrays a Strings (Simplificación para tu TFG)
                const genres = game.genres.map(g => g.name).join(', ');
                const platforms = game.platforms 
                    ? game.platforms.map(p => p.platform.name).join(', ') 
                    : 'Unknown';

                // 2. Query de Inserción
                // Usamos INSERT IGNORE para que si ejecutas el script 2 veces no falle por IDs duplicados
                const query = `
                    INSERT IGNORE INTO games 
                    (id, title, description, genre, platform, image_url, released_date)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;

                // Nota: La API de lista de RAWG no trae descripción larga.
                // Ponemos un texto genérico o vacío para no complicar el script con 200 peticiones extra.
                const descriptionPlaceholder = `Descripción no disponible en vista rápida.`;

                await connection.execute(query, [
                    game.id,
                    game.name,
                    descriptionPlaceholder, 
                    genres,
                    platforms,
                    game.background_image,
                    game.released
                ]);
            }
        }

        console.log('🎉 ¡Proceso terminado! Base de datos poblada con éxito.');

    } catch (error) {
        console.error('❌ Error durante el proceso:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

seedDatabase();