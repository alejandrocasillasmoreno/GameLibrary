import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './MyLibrary.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Mapeo de estados para mostrar en español
const statusMap = {
  pending: { label: 'Pendiente', emoji: '⏳', color: '#f39c12' },
  playing: { label: 'Jugando', emoji: '🎮', color: '#3498db' },
  completed: { label: 'Completado', emoji: '🏆', color: '#2ecc71' },
  dropped: { label: 'Abandonado', emoji: '❌', color: '#e74c3c' }
};

function MyLibrary() {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterMinRating, setFilterMinRating] = useState(0);
  const [deletingId, setDeletingId] = useState(null);

  // Cargar juegos de la biblioteca
  useEffect(() => {
    const fetchGames = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/library/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar la biblioteca');
        const data = await res.json();
        setGames(data);
        setFilteredGames(data); // inicialmente mostramos todos
      } catch (error) {
        console.error(error);
        toast.error('No se pudo cargar tu biblioteca');
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [user]);

  // Aplicar filtros cada vez que cambien los juegos, el estado o la puntuación mínima
  useEffect(() => {
    let result = [...games];

    // Filtrar por estado
    if (filterStatus !== 'todos') {
      result = result.filter(game => game.status === filterStatus);
    }

    // Filtrar por puntuación mínima
    if (filterMinRating > 0) {
      result = result.filter(game => (game.valoracion || 0) >= filterMinRating);
    }

    setFilteredGames(result);
  }, [games, filterStatus, filterMinRating]);

  const handleStatusChange = async (entryId, newStatus) => {
    const previousGames = [...games];
    // Optimistic update
    setGames(games.map(game => 
      game.id === entryId ? { ...game, status: newStatus } : game
    ));

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/library/status/${entryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Error al actualizar');
      toast.success(`Estado cambiado a ${statusMap[newStatus]?.label}`);
    } catch (error) {
      console.error(error);
      toast.error('No se pudo actualizar el estado');
      setGames(previousGames); // revertir cambio
    }
  };

  const handleRatingChange = async (entryId, newRating) => {
    // Guardamos copia por si falla
    const previousGames = [...games];
    
    // Actualización optimista
    setGames(games.map(game => 
      game.id === entryId ? { ...game, valoracion: newRating } : game
    ));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/library/${entryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ valoracion: newRating })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar');
      }

      toast.success(`Puntuación: ${'★'.repeat(newRating)}`);
    } catch (error) {
      console.error('Error en rating:', error);
      toast.error('No se pudo guardar la puntuación');
      // Revertir cambio
      setGames(previousGames);
    }
  };

  const confirmDelete = (entryId) => {
    toast((t) => (
      <div className="delete-confirm">
        <p>¿Eliminar este juego de tu biblioteca?</p>
        <div className="delete-confirm-actions">
          <button className="btn-confirm-yes" onClick={() => handleDelete(entryId, t.id)}>Sí</button>
          <button className="btn-confirm-no" onClick={() => toast.dismiss(t.id)}>No</button>
        </div>
      </div>
    ), { duration: 8000 });
  };

  const handleDelete = async (entryId, toastId) => {
    toast.dismiss(toastId);
    setDeletingId(entryId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/library/${entryId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al eliminar');
      setGames(games.filter(game => game.id !== entryId));
      toast.success('Juego eliminado');
    } catch (error) {
      console.error(error);
      toast.error('No se pudo eliminar');
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) {
    return (
      <div className="my-library">
        <h2>Mi Biblioteca</h2>
        <p>Inicia sesión para ver tu colección.</p>
        <Link to="/login" className="btn-primary">Ir a Login</Link>
      </div>
    );
  }

  if (loading) return <div className="loading">Cargando tu biblioteca...</div>;

  return (
    <div className="my-library">
      <h2>Mi Biblioteca 📚 ({games.length})</h2>

      {/* Barra de filtros */}
      <div className="filters-bar">
        <div className="filter-group">
          <label htmlFor="status-filter">Estado:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="todos">Todos</option>
            {Object.entries(statusMap).map(([key, val]) => (
              <option key={key} value={key}>
                {val.emoji} {val.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="rating-filter">Puntuación mínima:</label>
          <select
            id="rating-filter"
            value={filterMinRating}
            onChange={(e) => setFilterMinRating(Number(e.target.value))}
          >
            <option value="0">Cualquiera</option>
            <option value="1">⭐ 1+</option>
            <option value="2">⭐⭐ 2+</option>
            <option value="3">⭐⭐⭐ 3+</option>
            <option value="4">⭐⭐⭐⭐ 4+</option>
            <option value="5">⭐⭐⭐⭐⭐ 5</option>
          </select>
        </div>

        <span className="filter-count">
          Mostrando {filteredGames.length} de {games.length} juegos
        </span>
      </div>

      {filteredGames.length === 0 ? (
        <div className="empty-library">
          <p>No hay juegos que coincidan con los filtros.</p>
          <button className="btn-secondary" onClick={() => { setFilterStatus('todos'); setFilterMinRating(0); }}>
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="games-grid">
          {filteredGames.map(game => (
            <div key={game.id} className="game-card">
              <div className="card-image">
                <Link to={`/library/${game.id}`}>
                  <img
                    src={game.imagen_url || '/placeholder.jpg'}
                    alt={game.titulo}
                    onError={(e) => e.target.src = '/placeholder.jpg'}
                  />
                </Link>
                <div className="status-badge" style={{ background: statusMap[game.status]?.color }}>
                  {statusMap[game.status]?.emoji} {statusMap[game.status]?.label}
                </div>
              </div>
              <div className="card-content">
                <h3 title={game.titulo}>{game.titulo}</h3>
                <p className="game-platform">{game.plataforma}</p>
                <div className="rating-selector">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      className={`star ${star <= (game.valoracion || 0) ? 'active' : ''}`}
                      onClick={() => handleRatingChange(game.id, star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <select
                  value={game.status}
                  onChange={(e) => handleStatusChange(game.id, e.target.value)}
                  className="status-select"
                >
                  {Object.entries(statusMap).map(([key, val]) => (
                    <option key={key} value={key}>{val.emoji} {val.label}</option>
                  ))}
                </select>
                <button
                  className="delete-btn"
                  onClick={() => confirmDelete(game.id)}
                  disabled={deletingId === game.id}
                >
                  {deletingId === game.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyLibrary;