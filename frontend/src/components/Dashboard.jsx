import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext'; // ✅ IMPORTANTE
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Crearemos este CSS ahora

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const { user } = useAuth(); // ✅ Usamos el contexto
  const [loading, setLoading] = useState(true);
  
  // Estados para las métricas
  const [stats, setStats] = useState({
    totalGames: 0,
    completedGames: 0,
    playingGames: 0,
    droppedGames: 0,
    pendingGames: 0,
    completionRate: 0
  });

  useEffect(() => {
    if (user) {
      calculateStats();
    }
  }, [user]);

  const calculateStats = async () => {
    try {
      console.log("📊 Calculando estadísticas para usuario:", user?.id);
      
      // ♻️ TRUCO: Reutilizamos el endpoint que YA FUNCIONA
      const res = await fetch(`http://localhost:3000/api/library/${user.id}`);
      console.log("📥 Respuesta del servidor - Status:", res.status);
      
      if (!res.ok) throw new Error(`Error al cargar datos: ${res.status}`);
      
      const games = await res.json();
      console.log("📥 Juegos recibidos:", games);

      // 🧮 CALCULADORA DE ESTADÍSTICAS EN FRONTEND
      const total = games.length;
      const completed = games.filter(g => g.status === 'completed').length;
      const playing = games.filter(g => g.status === 'playing').length;
      const dropped = games.filter(g => g.status === 'dropped').length;
      const pending = games.filter(g => g.status === 'pending').length;

      console.log("📊 Estadísticas calculadas:", { total, completed, playing, dropped, pending });

      setStats({
        totalGames: total,
        completedGames: completed,
        playingGames: playing,
        droppedGames: dropped,
        pendingGames: pending,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
      });

    } catch (error) {
      console.error("❌ Error en calculateStats:", error);
      toast.error('No se pudieron cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-container">Cargando métricas... 📊</div>;

  if (!user) return <div className="loading-container">Inicia sesión para ver tus estadísticas</div>;

  // Configuración del Gráfico
  const chartData = {
    labels: ['Pendientes', 'Jugando', 'Completados', 'Abandonados'],
    datasets: [
      {
        data: [stats.pendingGames, stats.playingGames, stats.completedGames, stats.droppedGames],
        backgroundColor: ['#f1c40f', '#3498db', '#2ecc71', '#e74c3c'],
        borderWidth: 1,
        borderColor: '#222'
      }
    ]
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">
         Resumen de {user.username} 🎮
      </h2>

      {/* GRID DE TARJETAS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalGames}</div>
          <div className="stat-label">Juegos Totales</div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-number">{stats.completedGames}</div>
          <div className="stat-label">Completados 🏆</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{stats.playingGames}</div>
          <div className="stat-label">Jugando Ahora</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{stats.completionRate}%</div>
          <div className="stat-label">Tasa de Éxito</div>
        </div>
      </div>

      {/* GRÁFICO O MENSAJE VACÍO */}
      <div className="chart-section">
        {stats.totalGames === 0 ? (
          <div className="empty-state">
            <p>Todavía no tienes juegos en tu biblioteca.</p>
            <Link to="/" className="btn-action">Ir al Catálogo</Link>
          </div>
        ) : (
          <div className="pie-chart-wrapper">
             <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;