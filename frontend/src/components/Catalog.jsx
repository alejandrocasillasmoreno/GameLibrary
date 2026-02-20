import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './Catalog.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Catalog() {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Función para convertir rating en estrellas visuales
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

  // Cargar juegos al entrar
  useEffect(() => {
    fetchGames();
  }, []);

  // Filtrar juegos localmente
  useEffect(() => {
    if (!games || games.length === 0) {
      setFilteredGames([]);
      return;
    }
    if (searchTerm.trim() === '') {
      setFilteredGames(games);
    } else {
      const filtered = games.filter(game =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredGames(filtered);
    }
  }, [games, searchTerm]);

  const fetchGames = async (query = '', pageNum = 1) => {
    setLoading(true);
    try {
      const url = query
        ? `${API_URL}/api/games?query=${query}&page=${pageNum}`
        : `${API_URL}/api/games?page=${pageNum}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setGames(data.results || []);
      if (data.count) {
        setTotalPages(Math.ceil(data.count / 20));
      } else {
        setTotalPages(1);
      }
      setCurrentPage(pageNum);
    } catch (error) {
      console.error('Error cargando juegos:', error);
      toast.error('Error conectando con el servidor de juegos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGames(searchTerm, 1);
  };

  const addToLibrary = async (game) => {
    if (!user || !user.id) {
      toast.error('Debes iniciar sesión para añadir juegos');
      return;
    }

    const gameData = {
      userId: user.id,
      gameId: game.id,
      titulo: game.name,
      imagen_url: game.background_image,
      plataforma: game.parent_platforms?.[0]?.platform?.name || 'PC',
      status: 'pending'
    };

    try {
      const response = await fetch(`${API_URL}/api/library`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`¡${game.name} añadido a tu biblioteca!`);
      } else {
        toast.error(data.message || 'No se pudo añadir el juego');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Error de conexión: ${error.message}`);
    }
  };

  // Estilos (podrían ir en CSS, pero se mantienen para coherencia)
  const gridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
    padding: '20px'
  };
  const cardStyle = {
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    padding: '15px',
    width: '220px',
    border: '1px solid #444',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
  };
  const inputStyle = {
    padding: '10px',
    width: '300px',
    borderRadius: '5px',
    border: 'none',
    marginRight: '10px',
    color: '#000'
  };
  const btnStyle = {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    background: '#646cff',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px', color: 'white' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Catálogo Mundial (RAWG API) 🌍
      </h2>

      <form onSubmit={handleSearch} style={{ textAlign: 'center', marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Busca cualquier juego (ej: Mario, Zelda)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={inputStyle}
        />
        <button
          type="submit"
          style={{
            ...btnStyle,
            background: 'linear-gradient(135deg, #646cff 0%, #533a99 100%)',
            boxShadow: '0 4px 12px rgba(100, 108, 255, 0.3)'
          }}
        >
          Buscar 🔍
        </button>
      </form>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Cargando juegos...</p>
      ) : (
        <>
          <div style={gridStyle}>
            {filteredGames.map((game) => (
              <div key={game.id} style={cardStyle}>
                <img
                  src={game.background_image || 'https://via.placeholder.com/220x150?text=No+Image'}
                  alt={game.name}
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/220x150?text=Error';
                  }}
                />
                <h3 style={{ fontSize: '1rem', margin: '10px 0', height: '40px', overflow: 'hidden' }}>
                  {game.name}
                </h3>
                <p style={{ marginBottom: '10px', fontSize: '1.1rem', letterSpacing: '2px', color: '#f1c40f' }}>
                  {renderStars(game.rating)} <span style={{ fontSize: '0.85rem', color: '#aaa' }}>({game.rating || 'N/A'})</span>
                </p>
                <button
                  onClick={() => addToLibrary(game)}
                  className="add-btn"
                  disabled={!user}
                  title={!user ? 'Inicia sesión para añadir' : 'Añadir a mi colección'}
                >
                  {user ? '+ Añadir a Biblioteca' : '🔒 Inicia sesión'}
                </button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
              <button
                onClick={() => fetchGames(searchTerm, currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  background: '#646cff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.5 : 1
                }}
              >
                Anterior
              </button>
              <span style={{ alignSelf: 'center', color: 'white' }}>
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => fetchGames(searchTerm, currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 16px',
                  background: '#646cff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages ? 0.5 : 1
                }}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Catalog;