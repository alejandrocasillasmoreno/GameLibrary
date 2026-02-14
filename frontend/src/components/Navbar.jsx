import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
// 1. CORRECCIÓN: Importamos desde el Contexto
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  // 2. CORRECCIÓN: Usamos 'user' en vez de 'isLogged'
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // El toast ya lo hace el context, pero no pasa nada por dejarlo aquí también
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">
          🎮 <span>Game</span>Library
        </Link>

        <div className="nav-links">
          {/* 3. CORRECCIÓN: Comprobamos si existe 'user' */}
          {user ? (
            <>
              <Link to="/" className="nav-link">Catálogo</Link>
              <Link to="/library" className="nav-link">Mi Biblioteca</Link>

              {/* 👇 AÑADE ESTA LÍNEA 👇 */}
              <Link to="/dashboard" className="nav-link">Estadísticas 📊</Link>

              <button onClick={handleLogout} className="btn btn-primary">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Iniciar Sesión</Link>
              <Link to="/register" className="btn btn-secondary">
                Regístrate
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;