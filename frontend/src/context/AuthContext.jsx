import { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

// 1. Creamos el Contexto (la "nube" de datos global)
const AuthContext = createContext();

// 2. Hook personalizado para usar el contexto más fácil
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

// 3. El Proveedor que envolverá a toda la App
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // A. EFECTO DE INICIO: Comprobar si ya hay un usuario guardado
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch (error) {
          console.error("Error al leer usuario del storage", error);
          localStorage.removeItem('user'); // Si está corrupto, lo borramos
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // B. FUNCIÓN DE REGISTRO (Sign Up)
  const register = async (username, email, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('¡Registro exitoso! Ahora inicia sesión.');
        // ✅ GUARDAR EL TOKEN JWT también en registro (para auto-login)
        if (data.token) {
          localStorage.setItem('token', data.token);
          console.log('Token guardado en registro:', data.token.substring(0, 20) + '...');
        }
        return true; // Éxito
      } else {
        toast.error(data.message || 'Error en el registro');
        return false; // Fallo
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión con el servidor');
      return false;
    }
  };

  // C. FUNCIÓN DE LOGIN (Iniciar Sesión)
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Extraemos los datos del usuario de la respuesta
        const userData = data.user || data;
        console.log('Usuario logueado:', userData);
        // Guardamos el usuario en el Estado y en LocalStorage
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // ✅ GUARDAR EL TOKEN JWT (esto estaba faltando)
        if (data.token) {
          localStorage.setItem('token', data.token);
          console.log('Token guardado en localStorage:', data.token.substring(0, 20) + '...');
        }
        
        toast.success(`¡Bienvenido, ${userData.name}!`);
        return true;
      } else {
        toast.error(data.message || 'Credenciales incorrectas');
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión. Revisa que el backend esté encendido.');
      return false;
    }
  };

  // D. FUNCIÓN DE LOGOUT (Cerrar Sesión)
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast('¡Hasta pronto! 👋', { icon: '🚪' });
  };

  // Funciones para verificar roles y permisos
  const hasRole = (roleName) => {
    return user && user.role === roleName;
  };

  const hasPermission = (permissionName) => {
    return user && user.permissions && user.permissions.some(p => p.name === permissionName);
  };

  const hasAnyPermission = (permissionNames) => {
    return user && user.permissions && 
           user.permissions.some(p => permissionNames.includes(p.name));
  };

  const isAdmin = () => {
    return hasRole('admin');
  };

  // 4. Exponemos los datos y funciones a toda la app
  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout,
      // Funciones de autorización
      hasRole,
      hasPermission,
      hasAnyPermission,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;


