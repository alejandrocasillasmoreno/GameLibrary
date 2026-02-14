import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
// 👇 AQUÍ ESTABA EL ERROR: Ahora apuntamos a 'context', no a 'hooks'
import { useAuth } from '../context/AuthContext';
import './Catalog.css'; 

function Catalog() {
  const { user } = useAuth(); 
  
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // ⚠️ TU API KEY
  const API_KEY = '2a6e65812152413db3df7636ba1b97ea';

  // 🌟 Función para convertir rating en estrellas visuales
  const renderStars = (rating) => {
    if (!rating) return '☆☆☆☆☆';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 > 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      '★'.repeat(fullStars) +
      (hasHalfStar ? '⯨' : '') +
      '☆'.repeat(emptyStars)
    );
  }; 

  // Cargar juegos populares al entrar
  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async (query = '') => {
    setLoading(true);
    try {
      // Si hay búsqueda usamos ?search=, si no, traemos los populares
      const url = query 
        ? `https://api.rawg.io/api/games?key=${API_KEY}&search=${query}&page_size=20`
        : `https://api.rawg.io/api/games?key=${API_KEY}&dates=2023-01-01,2024-12-31&ordering=-added&page_size=20`;

      const response = await fetch(url);
      const data = await response.json();
      setGames(data.results); 
    } catch (error) {
      console.error("Error cargando RAWG:", error);
      toast.error("Error conectando con la base de datos mundial");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGames(searchTerm);
  };

  // --- LÓGICA DE AÑADIR ---
  const addToLibrary = async (game) => {
    console.log("👤 Usuario actual en Catalog:", user);
    
    // AHORA ESTO YA FUNCIONARÁ PORQUE 'user' YA EXISTE
    if (!user || !user.id) {
      console.error("❌ No hay usuario o no tiene ID!", user);
      toast.error("Debes iniciar sesión para añadir juegos");
      return;
    }

    // Preparamos los datos
    const gameData = {
      userId: user.id,
      gameId: game.id,
      titulo: game.name,             
      imagen_url: game.background_image, 
      plataforma: game.parent_platforms?.[0]?.platform?.name || 'PC'
    };

    console.log("📦 Enviando datos al servidor:", gameData);

    try {
      // La ruta correcta: /api/library
      const response = await fetch('http://localhost:3000/api/library', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });

      console.log("📡 Respuesta del servidor - Status:", response.status);
      const data = await response.json();
      console.log("📡 Respuesta del servidor - Data:", data);

      if (response.ok) {
        toast.success(`¡${game.name} añadido a tu biblioteca!`);
      } else {
        // Si hay error (ej: juego duplicado) mostramos el mensaje del backend
        toast.error(data.message || "No se pudo añadir el juego");
      }
    } catch (error) {
      console.error('❌ Error detectado:', error);
      toast.error(`Error de conexión: ${error.message}`);
    }
  };

  // ESTILOS (Los mantenemos igual)
  const gridStyle = { display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', padding: '20px' };
  const cardStyle = { backgroundColor: '#2a2a2a', borderRadius: '8px', padding: '15px', width: '220px', border: '1px solid #444', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' };
  const inputStyle = { padding: '10px', width: '300px', borderRadius: '5px', border: 'none', marginRight: '10px', color: '#000' };
  const btnStyle = { padding: '10px 20px', borderRadius: '5px', border: 'none', background: '#646cff', color: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' };

  return (
    <div style={{ minHeight: '100vh', padding: '20px', color: 'white' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Catálogo Mundial (RAWG API) 🌍</h2>
      
      {/* BARRA DE BÚSQUEDA */}
      <form onSubmit={handleSearch} style={{ textAlign: 'center', marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="Busca cualquier juego (ej: Mario, Zelda)..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={{...btnStyle, background: 'linear-gradient(135deg, #646cff 0%, #533a99 100%)', boxShadow: '0 4px 12px rgba(100, 108, 255, 0.3)'}}>Buscar 🔍</button>
      </form>

      {loading ? <p style={{textAlign:'center'}}>Cargando juegos...</p> : (
        <div style={gridStyle}>
          {games.map((game) => (
            <div key={game.id} style={cardStyle}>
              {game.background_image ? (
                  <img src={game.background_image} alt={game.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
              ) : (
                  <div style={{width: '100%', height: '150px', background: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Sin Imagen</div>
              )}
              <h3 style={{ fontSize: '1rem', margin: '10px 0', height: '40px', overflow: 'hidden' }}>{game.name}</h3>
              <p style={{marginBottom: '10px', fontSize: '1.1rem', letterSpacing: '2px', color: '#f1c40f'}}>
                {renderStars(game.rating)} <span style={{fontSize: '0.85rem', color: '#aaa'}}>({game.rating || 'N/A'})</span>
              </p>
              
              <button 
                onClick={() => addToLibrary(game)}
                className="add-btn"
                disabled={!user}
                title={!user ? "Inicia sesión para añadir" : "Añadir a mi colección"}
              >
                {user ? "+ Añadir a Biblioteca" : "🔒 Inicia sesión"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalog;