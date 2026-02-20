import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Añadimos Link
import { useAuth } from '../context/AuthContext'; // ✅ CORREGIDO: Importamos desde el Contexto
import './Auth.css'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Extraemos la función 'login' que ya creamos en el AuthContext
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    
    // ✅ ARQUITECTURA LIMPIA:
    // No hacemos fetch aquí. Llamamos a la función del contexto.
    // Esto separa la "Vista" (Login.jsx) de la "Lógica" (AuthContext).
    const success = await login(email, password);

    if (success) {
      // Si el login fue bien, redirigimos al catálogo
      navigate('/catalog'); 
    }
    // Nota: No hace falta mostrar Toast de error aquí, 
    // porque el AuthContext ya se encarga de eso.
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Iniciar Sesión</h2>
        
        <form onSubmit={handleLogin}>
          
          {/* GRUPO 1: EMAIL */}
          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email"  
              placeholder="tu@email.com" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          {/* GRUPO 2: CONTRASEÑA */}
          <div className="form-group">
            <label>Contraseña:</label>
            <input  
              type="password"  
              placeholder="••••••••" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="button login-btn">Entrar 🚀</button>
        </form>

        <br />
        
        {/* Enlace de Registro CORRECTO (sin recargar página) */}
        <div className="register-link">
            <p>¿No tienes cuenta?</p>
            <Link to="/register" className="button secondary-btn">
               Crear cuenta gratis
            </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;