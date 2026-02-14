import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importamos Link
import { useAuth } from '../context/AuthContext'; // Importamos el contexto
import './Auth.css'; 

function Register() {
  // CAMBIO 1: Usamos 'username' para coincidir con el backend
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  
  // CAMBIO 2: Sacamos la función 'register' del contexto (Centralización)
  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // CAMBIO 3: Usamos la función del contexto en vez de hacer fetch aquí
    // Esto mantiene el código limpio y ordenado.
    const success = await register(username, email, password);

    if (success) {
      navigate('/login'); // Si todo fue bien, al login
    }
    // No hace falta 'else' con toast error, el Contexto ya lo hace.
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Crear Cuenta Nueva</h2>
        
        <form onSubmit={handleRegister}>
          
          {/* CAMPO USUARIO */}
          <div className="form-group">
            <label>Usuario:</label>
            <input 
              type="text" 
              placeholder="Nombre de usuario" 
              className="form-input"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>

          {/* CAMPO EMAIL */}
          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email" 
              placeholder="correo@ejemplo.com" 
              className="form-input"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          {/* CAMPO PASSWORD */}
          <div className="form-group">
            <label>Password:</label>
            <input 
              type="password" 
              placeholder="Elige una contraseña segura" 
              className="form-input"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button type="submit" className="button">
            Registrarse 📝
          </button>
        </form>
        
        <div className="register-link">
          <p>¿Ya tienes cuenta?</p>
          {/* CAMBIO 4: Link para no recargar la página */}
          <Link to="/login" className="button secondary-btn">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;