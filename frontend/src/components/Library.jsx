import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './Library.css'; // Usamos el archivo Library.css

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Mapeo de estados al español (para mostrar)
const statusMap = {
    pending: { es: 'Pendiente', emoji: '⏳', color: '#f39c12' },
    playing: { es: 'Jugando', emoji: '🎮', color: '#3498db' },
    completed: { es: 'Terminado', emoji: '🏆', color: '#2ecc71' },
    dropped: { es: 'Abandonado', emoji: '❌', color: '#e74c3c' }
};

function MyLibrary() {
    const { user } = useAuth();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchGames();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchGames = async () => {
        try {
            const res = await fetch(`${API_URL}/api/library/${user.id}`);
            if (!res.ok) throw new Error('Error al cargar');
            const data = await res.json();
            setGames(data);
        } catch (error) {
            console.error(error);
            toast.error('Error al cargar la biblioteca');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        // Actualización optimista
        const previousGames = [...games];
        setGames(games.map(game => 
            game.id === id ? { ...game, status: newStatus } : game
        ));

        try {
            const res = await fetch(`${API_URL}/api/library/status/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) throw new Error('Error al actualizar');
            toast.success(`Estado actualizado a ${statusMap[newStatus]?.es}`);
        } catch (error) {
            console.error(error);
            toast.error('No se pudo actualizar el estado');
            setGames(previousGames); // Revertir cambio
        }
    };

    const confirmDelete = (id) => {
        toast((t) => (
            <div className="delete-confirm">
                <span>¿Eliminar este juego?</span>
                <div>
                    <button onClick={() => handleDelete(id, t.id)}>Sí</button>
                    <button onClick={() => toast.dismiss(t.id)}>No</button>
                </div>
            </div>
        ), { duration: 5000 });
    };

    const handleDelete = async (id, toastId) => {
        toast.dismiss(toastId);
        try {
            const res = await fetch(`${API_URL}/api/library/${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Error al eliminar');
            setGames(games.filter(game => game.id !== id));
            toast.success('Juego eliminado');
        } catch (error) {
            console.error(error);
            toast.error('No se pudo eliminar');
        }
    };

    if (loading) return <div className="library-loading">Cargando tu colección...</div>;
    if (!user) return (
        <div className="auth-message">
            <h2>Inicia sesión para ver tu biblioteca</h2>
            <Link to="/login">Ir al Login</Link>
        </div>
    );
    if (games.length === 0) return (
        <div className="empty-library">
            <h2>Tu biblioteca está vacía</h2>
            <p>¡Añade algunos juegos desde el catálogo!</p>
            <Link to="/catalog" className="library-btn">Ir al Catálogo</Link>
        </div>
    );

    return (
        <div className="library">
            <h2>Mi Biblioteca 📚 ({games.length})</h2>
            <div className="library-grid">
                {games.map(game => (
                    <div key={game.id} className="library-card">
                        <div className="library-image-wrapper">
                            <Link to={`/library/${game.id}`}>
                                <img 
                                    src={game.imagen_url || '/placeholder.jpg'} 
                                    alt={game.titulo}
                                    className="library-image"
                                    onError={(e) => e.target.src = '/placeholder.jpg'}
                                />
                            </Link>
                            <div className="game-overlay">
                                <span className="library-status-badge" style={{ background: statusMap[game.status]?.color }}>
                                    {statusMap[game.status]?.emoji} {statusMap[game.status]?.es}
                                </span>
                            </div>
                        </div>
                        <div className="library-info">
                            <h3 className="game-title">{game.titulo}</h3>
                            <div className="game-meta">
                                <span className="game-genre">{game.plataforma}</span>
                            </div>
                            <div className="game-actions">
                                <select
                                    value={game.status}
                                    onChange={(e) => handleStatusChange(game.id, e.target.value)}
                                    className="btn-secondary"
                                >
                                    {Object.entries(statusMap).map(([key, val]) => (
                                        <option key={key} value={key}>{val.emoji} {val.es}</option>
                                    ))}
                                </select>
                                <button className="library-remove-btn" onClick={() => confirmDelete(game.id)}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyLibrary;