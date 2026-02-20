import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './GameDetail.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function GameDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');

  // Debug: Verifica si el componente se monta y el ID de la URL
  console.log('GameDetail montado, id:', id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Obtener datos del juego desde la biblioteca (user_library)
        console.log('🔍 Solicitando juego con ID:', id);
        const gameRes = await fetch(`${API_URL}/api/library/game/${id}`);
        if (!gameRes.ok) throw new Error('Error al cargar juego');
        const gameData = await gameRes.json();
        console.log('✅ Juego recibido:', gameData);
        setGame(gameData);
        
        // 2. Obtener reseñas del juego usando gameData.id (ID de user_library)
        // Este es el ID correcto que se usa en la tabla reviews
        const reviewsRes = await fetch(`${API_URL}/api/reviews/game/${gameData.id}`);
        if (!reviewsRes.ok) throw new Error('Error al cargar reseñas');
        const reviewsData = await reviewsRes.json();
        console.log('✅ Reseñas recibidas:', reviewsData);
        
        // Si la respuesta es un array, lo usamos; si no, array vacío
        if (Array.isArray(reviewsData)) {
          setReviews(reviewsData);
        } else {
          console.warn('La respuesta de reseñas no es un array:', reviewsData);
          setReviews([]); // Evita el error
        }
      } catch (err) {
        console.error('❌ Error en fetchData:', err);
        setError(err.message);
        toast.error('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, API_URL]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Debes iniciar sesión');
      return;
    }
    
    // Validar rating
    if (newRating < 1 || newRating > 5) {
      toast.error('El rating debe ser entre 1 y 5 estrellas');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          gameId: game.id, // <-- usar game.id (ID de user_library)
          rating: newRating,
          comment: newComment
        })
      });
      
      if (response.ok) {
        toast.success('Reseña publicada');
        // Recargar reseñas
        const reviewsRes = await fetch(`${API_URL}/api/reviews/game/${game.id}`);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
        setNewComment('');
        setNewRating(5);
      } else {
        const err = await response.json();
        toast.error(err.message || 'Error al publicar');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error de conexión');
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment || '');
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    if (!editingReview) return;
    
    // Validar rating
    if (editRating < 1 || editRating > 5) {
      toast.error('El rating debe ser entre 1 y 5 estrellas');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/reviews/${editingReview.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          rating: editRating,
          comment: editComment
        })
      });
      if (response.ok) {
        toast.success('Reseña actualizada');
        setEditingReview(null);
        // Recargar reseñas usando game.id
        const reviewsRes = await fetch(`${API_URL}/api/reviews/game/${game.id}`);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
      } else {
        const err = await response.json();
        toast.error(err.message || 'Error al actualizar');
      }
    } catch {
      toast.error('Error de conexión');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('¿Eliminar esta reseña?')) return;
    try {
      const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      if (response.ok) {
        toast.success('Reseña eliminada');
        // Recargar reseñas usando game.id
        const reviewsRes = await fetch(`${API_URL}/api/reviews/game/${game.id}`);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
      } else {
        const err = await response.json();
        toast.error(err.message || 'Error al eliminar');
      }
    } catch {
      toast.error('Error de conexión');
    }
  };

  if (loading) return <div className="game-detail-container" style={{ textAlign: 'center', padding: '2rem' }}>Cargando...</div>;
  if (error) return (
    <div className="game-detail-container" style={{ textAlign: 'center', padding: '2rem', color: '#ff8888' }}>
      <h2>Error: {error}</h2>
      <Link to="/library">Volver a la biblioteca</Link>
    </div>
  );
  if (!game) return (
    <div className="game-detail-container" style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>Juego no encontrado</h2>
      <Link to="/library">Volver a la biblioteca</Link>
    </div>
  );

  return (
    <div className="game-detail-container">
      <Link to="/library" className="back-link">← Volver a mi biblioteca</Link>

      <div className="game-header">
        <img
          src={game.imagen_url || '/placeholder.jpg'}
          alt={game.titulo}
          className="game-cover"
          onError={(e) => { e.target.src = '/placeholder.jpg'; }}
        />
        <div className="game-info">
          <h1 className="game-title">{game.titulo}</h1>
          <div className="game-meta">
            <span className="meta-item"><strong>Plataforma:</strong> {game.plataforma}</span>
            <span className={`status-badge ${game.status}`}>
              {game.status === 'playing' && '🎮 Jugando'}
              {game.status === 'completed' && '🏆 Terminado'}
              {game.status === 'pending' && '⏳ Pendiente'}
              {game.status === 'dropped' && '❌ Abandonado'}
            </span>
          </div>
          {game.valoracion > 0 && (
            <div className="my-rating">
              <strong>Mi puntuación:</strong> {'★'.repeat(game.valoracion)}
            </div>
          )}
        </div>
      </div>

      <h2 className="section-title">Reseñas de la comunidad</h2>

      {/* Formulario de nueva reseña (solo si el usuario es el dueño) */}
      {user && game.user_id && user.id === game.user_id && (
        <form onSubmit={handleSubmitReview} className="review-form">
          <h3>Escribe tu reseña</h3>
          <div className="rating-selector">
            {[1, 2, 3, 4, 5].map(star => (
              <span
                key={star}
                className={`rating-star ${star <= newRating ? 'active' : ''}`}
                onClick={() => setNewRating(star)}
                title={`${star} estrella${star > 1 ? 's' : ''}`}
              >
                ★
              </span>
            ))}
            <span className="rating-value">{newRating}/5 estrellas</span>
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe un comentario (opcional)"
            rows="4"
            className="review-textarea"
            maxLength="500"
          />
          <div className="review-actions">
            <button type="submit" className="submit-review">Publicar reseña</button>
            <span className="char-count">{newComment.length}/500 caracteres</span>
          </div>
        </form>
      )}

      {/* Formulario de edición (si se está editando) */}
      {editingReview && (
        <form onSubmit={handleUpdateReview} className="review-form edit-form">
          <h3>Editar reseña</h3>
          <div className="rating-selector">
            {[1, 2, 3, 4, 5].map(star => (
              <span
                key={star}
                className={`rating-star ${star <= editRating ? 'active' : ''}`}
                onClick={() => setEditRating(star)}
                title={`${star} estrella${star > 1 ? 's' : ''}`}
              >
                ★
              </span>
            ))}
            <span className="rating-value">{editRating}/5 estrellas</span>
          </div>
          <textarea
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            placeholder="Comentario (opcional)"
            rows="3"
            className="review-textarea"
            maxLength="500"
          />
          <div className="edit-actions">
            <button type="submit" className="submit-review">Guardar</button>
            <button type="button" onClick={() => setEditingReview(null)} className="btn-cancel">Cancelar</button>
            <span className="char-count">{editComment.length}/500 caracteres</span>
          </div>
        </form>
      )}

      {/* Lista de reseñas */}
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="empty-reviews">
            <p>No hay reseñas aún. ¡Sé el primero en comentar!</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <span className="review-author">{review.user_name}</span>
                <span className="review-rating">{'★'.repeat(review.rating)}</span>
              </div>
              {review.comment && <p className="review-comment">{review.comment}</p>}
              <div className="review-footer">
                <div className="review-date">
                  Publicado el {new Date(review.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                {/* Botones de editar/eliminar si el usuario es el autor */}
                {user && review.user_id === user.id && (
                  <div className="review-actions">
                    <button onClick={() => handleEditReview(review)} className="btn-edit">✏️ Editar</button>
                    <button onClick={() => handleDeleteReview(review.id)} className="btn-delete">🗑️ Eliminar</button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GameDetail;