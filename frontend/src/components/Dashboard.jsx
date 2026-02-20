import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Dashboard() {
  const { user } = useAuth();
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estadísticas personales calculadas
  const totalGames = library.length;
  const completed = library.filter(g => g.status === 'completed').length;
  const playing = library.filter(g => g.status === 'playing').length;
  const pending = library.filter(g => g.status === 'pending').length;
  const dropped = library.filter(g => g.status === 'dropped').length;
  const completionRate = totalGames > 0 ? Math.round((completed / totalGames) * 100) : 0;

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/library/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar biblioteca');
        const data = await res.json();
        console.log('📊 Datos de biblioteca en Dashboard:', data);
        setLibrary(data);
      } catch (error) {
        console.error(error);
        toast.error('No se pudo cargar tu biblioteca');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchLibrary();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="dashboard-container">
        <h2>Panel de Usuario</h2>
        <p>Debes iniciar sesión para ver tus estadísticas.</p>
        <Link to="/login" className="btn-primary">Ir a Login</Link>
      </div>
    );
  }

  if (loading) {
    return <div className="dashboard-container"><div className="loading">Cargando tus datos...</div></div>;
  }

  return (
    <div className="dashboard-container">
      <h2>📊 Panel de {user.name}</h2>

      {/* Estadísticas personales */}
      <div className="stats-section">
        <h3>Tu colección</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{totalGames}</span>
            <span className="stat-label">Juegos totales</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{completed}</span>
            <span className="stat-label">Completados 🏆</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{playing}</span>
            <span className="stat-label">Jugando 🎮</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{pending}</span>
            <span className="stat-label">Pendientes ⏳</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{dropped}</span>
            <span className="stat-label">Abandonados ❌</span>
          </div>
          <div className="stat-card highlight">
            <span className="stat-value">{completionRate}%</span>
            <span className="stat-label">Tasa de éxito</span>
          </div>
        </div>
      </div>

      {/* Enlaces rápidos */}
      <div className="quick-links">
        <Link to="/library" className="btn-secondary">Ir a mi biblioteca</Link>
        <Link to="/catalog" className="btn-primary">Explorar catálogo</Link>
      </div>
    </div>
  );
}

export default Dashboard;
