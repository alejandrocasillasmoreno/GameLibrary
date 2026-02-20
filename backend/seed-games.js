import pool from './src/config/db.js';

// Datos de ejemplo en caso de que RAWG no esté disponible
const games = [
  { id: 1, title: 'The Witcher 3: Wild Hunt', genre: 'RPG', platform: 'PC, PlayStation, Xbox', image: 'https://media.rawg.io/media/games/511/5118aff5091cb3efec399c3c63938317.jpg', rating: 9.3 },
  { id: 3, title: "Baldur's Gate 3", genre: 'RPG', platform: 'PC, PlayStation', image: 'https://media.rawg.io/media/games/d8c/d8c6b1f0c55f91ae91e91bc2c63e5b23.jpg', rating: 9.4 },
  { id: 5, title: 'Elden Ring', genre: 'Action RPG', platform: 'PC, PlayStation, Xbox', image: 'https://media.rawg.io/media/games/b7d/b7d8786585f37d228ddfe4322b71fba9.jpg', rating: 9.3 },
  { id: 16, title: 'Cyberpunk 2077', genre: 'Action RPG', platform: 'PC, PlayStation, Xbox', image: 'https://media.rawg.io/media/games/451/451be8f4effffb2eac4be144e053a411.jpg', rating: 8.3 },
  { id: 644, title: 'FINAL FANTASY VII', genre: 'RPG', platform: 'PC, PlayStation', image: 'https://media.rawg.io/media/games/28d/28d491e922406fcf9d4538fb1e47cdbb.jpg', rating: 8.9 },
  { id: 877, title: 'Dead Souls III', genre: 'Action RPG', platform: 'PC, PlayStation, Xbox', image: 'https://media.rawg.io/media/games/198/1988a337305e008b41d7f623744be7a9.jpg', rating: 8.9 },
  { id: 10778, title: 'Starfield', genre: 'Action RPG', platform: 'PC, Xbox', image: 'https://media.rawg.io/media/games/d61/d61ee4c28b6e61b1f60bc1b53c02f09f.jpg', rating: 7.8 },
  { id: 766, title: 'Monster Hunter: World', genre: 'Action', platform: 'PC, PlayStation, Xbox', image: 'https://media.rawg.io/media/games/d82/d82fbbb833dac6e04a98bec50b42ceb9.jpg', rating: 8.8 },
  { id: 28015, title: "Hogwarts Legacy", genre: 'Action RPG', platform: 'PC, PlayStation, Xbox', image: 'https://media.rawg.io/media/games/010/0105bbf626e92caf917ffd3428f1c8d7.jpg', rating: 7.5 },
  { id: 100629, title: 'Palworld', genre: 'Adventure', platform: 'PC, Xbox', image: 'https://media.rawg.io/media/games/5f4/5f4db32152bbb8060b1b58a4101d64b9.jpg', rating: 7.5 },
  { id: 16701, title: 'Tekken 8', genre: 'Fighting', platform: 'PC, PlayStation, Xbox', image: 'https://media.rawg.io/media/games/713/713269608e2baf2853bcf08b89995a84.jpg', rating: 8.7 },
  { id: 683972, title: 'Helldivers 2', genre: 'Shooter', platform: 'PC, PlayStation', image: 'https://media.rawg.io/media/games/b45/b45575f34285f2c4690d6952cbe10daa.jpg', rating: 8.3 }
];

async function seedGames() {
  try {
    console.log('🌱 Cargando juegos a la base de datos...');
    
    for (const game of games) {
      try {
        await pool.query(
          'INSERT INTO games (id, title, genre, platform, image_url, rating) VALUES (?, ?, ?, ?, ?, ?)',
          [game.id, game.title, game.genre, game.platform, game.image, game.rating]
        );
        console.log(`✅ ${game.title}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️ ${game.title} ya existe`);
        } else {
          console.error(`❌ Error en ${game.title}:`, error.message);
        }
      }
    }
    
    console.log('\n✅ Base de datos populada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fatal:', error.message);
    process.exit(1);
  }
}

seedGames();
