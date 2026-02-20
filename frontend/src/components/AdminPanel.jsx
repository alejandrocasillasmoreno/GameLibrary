import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AdminPanel.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function AdminPanel() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminStats();
    }
  }, [user]);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Error al cargar estadísticas');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error(error);
      toast.error('No se pudieron cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-panel-container">
        <h2>Panel de Administración</h2>
        <p>Acceso restringido a administradores.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-panel-container">
        <h2>Panel de Administración</h2>
        <div className="loading">Cargando estadísticas...</div>
      </div>
    );
  }

  return (
    <div className="admin-panel-container">
      <h2>⚙️ Panel de Administración</h2>
      
      <div className="admin-stats">
        <div className="stat-card">
          <h3>Usuarios Registrados</h3>
          <div className="stat-value">{stats?.totalUsers || 0}</div>
        </div>
        
        <div className="stat-card">
          <h3>Juegos en Catálogo</h3>
          <div className="stat-value">{stats?.totalGames || 0}</div>
        </div>
        
        <div className="stat-card">
          <h3>Reseñas Totales</h3>
          <div className="stat-value">{stats?.totalReviews || 0}</div>
        </div>
        
        <div className="stat-card">
          <h3>Media de Valoraciones</h3>
          <div className="stat-value">
            {stats?.averageRating ? stats.averageRating.toFixed(2) : '0.00'}
          </div>
        </div>
      </div>

      <div className="admin-actions">
        <h3>Acciones Rápidas</h3>
        <div className="action-buttons">
          <button 
            onClick={fetchAdminStats}
            className="btn-primary"
          >
            Actualizar Estadísticas
          </button>
          <button 
            onClick={() => window.location.href = '/admin/usuarios'}
            className="btn-secondary"
          >
            Gestión de Usuarios
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;