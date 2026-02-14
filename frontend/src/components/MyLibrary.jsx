import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext'; // ✅ CORREGIDO: Importamos del Contexto
import './Library.css';
import './MyLibrary.css';

// 🌍 MAPEO DE ESTADOS AL ESPAÑOL
const statusMap = {
  'pending': { es: 'Pendiente', emoji: '⏳', color: '#f39c12' },
  'playing': { es: 'Jugando', emoji: '🎮', color: '#3498db' },
  'completed': { es: 'Terminado', emoji: '🏆', color: '#2ecc71' },
  'dropped': { es: 'Abandonado', emoji: '❌', color: '#e74c3c' }
};

// 🌟 Función para convertir rating en estrellas visuales
const renderStars = (rating) => {
  if (!rating || rating === 0) return '☆☆☆☆☆';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 > 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    '★'.repeat(fullStars) +
    (hasHalfStar ? '⯨' : '') +
    '☆'.repeat(emptyStars)
  );
};

function MyLibrary() {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.id) {
      fetchGames(user.id);
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchGames = async (userId) => {
    try {
      console.log("📚 Cargando biblioteca para usuario:", userId);
      const response = await fetch(`http://localhost:3000/api/library/${userId}`);
      console.log("📥 Status de respuesta:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("📥 Juegos cargados:", data);
        // Ordenamos para que los últimos añadidos salgan primero
        setGames(data.reverse()); 
      } else {
        console.error("❌ Error al cargar: Status", response.status);
        toast.error('Error al cargar la biblioteca');
      }
    } catch (error) {
      console.error('❌ Error cargando biblioteca:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    console.log(`🔄 Intentando cambiar estado del juego ID ${id} a: ${newStatus}`);
    
    // 1. Copia de seguridad por si falla
    const previousGames = [...games];
    
    // 2. Optimistic UI: Lo cambiamos visualmente YA, sin esperar al servidor
    setGames(games.map(game => 
        game.id === id ? { ...game, status: newStatus } : game
    ));

    try {
        const response = await fetch(`http://localhost:3000/api/library/status/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        
        console.log(`📡 Respuesta del servidor - Status: ${response.status}`);
        
        if (response.ok) {
            const responseData = await response.json();
            console.log(`✅ Estado actualizado:`, responseData);
            toast.success(`Estado actualizado a: ${newStatus.toUpperCase()}`);
        } else {
            throw new Error(`Fallo al guardar - Status: ${response.status}`);
        }
    } catch (error) {
        console.error("❌ Error al actualizar:", error);
        toast.error("No se pudo guardar el cambio");
        setGames(previousGames); // Deshacemos el cambio si falló
    }
  };

  // 🌟 FUNCIÓN PARA ACTUALIZAR VALORACIÓN
  const handleRatingChange = async (id, newRating) => {
    console.log(`⭐ Intentando cambiar valoración del juego ID ${id} a: ${newRating}`);
    
    const previousGames = [...games];
    
    // Optimistic UI
    setGames(games.map(game => 
        game.id === id ? { ...game, valoracion: newRating } : game
    ));

    try {
        const response = await fetch(`http://localhost:3000/api/library/status/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ valoracion: newRating })
        });
        
        if (response.ok) {
            toast.success(`⭐ Puntuación actualizada a ${newRating}`);
        } else {
            throw new Error(`Fallo al guardar`);
        }
    } catch (error) {
        console.error("❌ Error al actualizar valoración:", error);
        toast.error("No se pudo guardar la puntuación");
        setGames(previousGames);
    }
  };

  // --- LÓGICA DE ELIMINAR ---
  
  // 1. Función que ejecuta el borrado real
  const executeDelete = async (rowId, toastId) => {
    toast.dismiss(toastId); // Quitamos la notificación de confirmación

    try {
      const response = await fetch(`http://localhost:3000/api/library/${rowId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        // Filtramos usando rowId
        setGames((prev) => prev.filter(g => g.id !== rowId));
        toast.success('Juego eliminado correctamente');
      } else {
        toast.error('Error al eliminar');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión');
    }
  };

  // 2. Función que muestra la confirmación bonita
  const confirmDelete = (rowId) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold' }}>¿Eliminar este juego? 🗑️</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => executeDelete(rowId, t.id)}
            style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
          >
            Sí, borrar
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)}
            style={{ background: '#6c757d', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
          >
            Cancelar
          </button>
        </div>
      </div>
    ), {
        duration: 5000,
        position: 'top-center',
        style: { background: '#222', color: '#fff', border: '1px solid #444' }
    });
  };

  // --- RENDERIZADO ---

  if (loading) return <div style={{textAlign:'center', marginTop:'50px', color:'white'}}>Cargando tu colección...</div>;

  if (!user) {
      return (
        <div style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>
            <h2>Inicia sesión para ver tu biblioteca 🔒</h2>
            <Link to="/login" className="btn" style={{background: '#646cff', color: 'white', padding: '10px 20px', textDecoration:'none', borderRadius:'5px'}}>Ir al Login</Link>
        </div>
      )
  }

  if (games.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>
        <h2>Tu biblioteca está vacía 😢</h2>
        <p>¡Añade algunos juegos desde el catálogo!</p>
        <br />
        <Link to="/" style={{ color: '#646cff', fontSize: '1.2rem' }}>Ir al Catálogo de Juegos</Link>
      </div>
    );
  }

  return (
    <div className="library-container" style={{ padding: '20px', minHeight: '100vh', color: 'white' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
        Mi Colección 📚 ({games.length})
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {games.map((game) => (
          <div key={game.id} style={{ border: '1px solid #444', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#1E1E1E', position: 'relative', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
            
            {/* IMAGEN Y ESTRELLAS */}
            <div style={{ height: '150px', position: 'relative' }}>
                <img 
                    src={game.imagen_url || 'https://via.placeholder.com/300?text=No+Image'} 
                    alt={game.titulo} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Error+Img'; }}
                />
                
                {/* Badge de Rating Interactivo */}
                <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'rgba(0,0,0,0.9)', padding: '8px 12px', borderTopLeftRadius: '10px', cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div style={{ color: '#f1c40f', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '1px' }}>
                            {renderStars(game.valoracion)}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#ddd' }}>
                            {game.valoracion > 0 ? Number(game.valoracion).toFixed(1) : 'Sin nota'}
                        </div>
                    </div>
                    
                    {/* Estrellas interactivas para calificar */}
                    <div style={{ display: 'flex', gap: '2px', marginTop: '6px', justifyContent: 'center' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                onClick={() => handleRatingChange(game.id, star)}
                                style={{
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    opacity: star <= Math.round(game.valoracion) ? 1 : 0.4,
                                    transition: 'all 0.2s',
                                    transform: 'scale(1)'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                title={`Puntuación: ${star}/5`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>

                {/* Badge de Estado */}
                <div style={{ position: 'absolute', top: 0, left: 0, background: statusMap[game.status]?.color || '#555', padding: '5px 10px', borderBottomRightRadius: '10px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {statusMap[game.status]?.emoji} {statusMap[game.status]?.es || game.status}
                </div>
            </div>
            
            <div style={{ padding: '15px' }}>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={game.titulo}>
                {game.titulo}
              </h3>
              <p style={{ color: '#ccc', fontSize: '0.85rem', marginBottom: '10px' }}>
                {game.plataforma}
              </p>
              
              {/* SELECTOR DE ESTADO */}
              <label htmlFor={`status-select-${game.id}`} style={{fontSize: '0.8rem', color: '#ccc', fontWeight: '600', display: 'block', marginBottom: '5px'}}>Estado:</label>
              <select 
                  id={`status-select-${game.id}`}
                  value={game.status || 'pending'} 
                  onChange={(e) => handleStatusChange(game.id, e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '5px', background: '#444', color: '#fff', border: '1px solid #666', cursor: 'pointer', fontWeight: '500' }}
              >
                  {Object.entries(statusMap).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.emoji} {value.es}
                    </option>
                  ))}
              </select>

              {/* BOTÓN ELIMINAR */}
              <button 
                onClick={() => confirmDelete(game.id)} 
                style={{ width: '100%', marginTop: '15px', padding: '8px', background: '#e74c3c', border: 'none', color: 'white', borderRadius: '5px', cursor: 'pointer', transition: 'all 0.3s', fontWeight: '600' }}
                onMouseOver={(e) => e.target.style.background = '#c0392b'}
                onMouseOut={(e) => e.target.style.background = '#e74c3c'}
              >
                Eliminar de la lista
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyLibrary;