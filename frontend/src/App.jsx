// Importación de React Router para navegación SPA
import { Routes, Route, Navigate } from 'react-router-dom';
// Importación de sistema de notificaciones
import { Toaster } from 'react-hot-toast';

// Importación de componentes principales
import Navbar from './components/Navbar';
import Catalog from './components/Catalog';
import MyLibrary from './components/MyLibrary';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import GameDetail from './components/GameDetail';

// Importación del Contexto de Autenticación (Patrón Context API)
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    // Contexto de Autenticación: Provee estado global de autenticación
    <AuthProvider>
      <div className="app-container">
        {/* Navbar: Componente de navegación persistente */}
        <Navbar />
        
        {/* Contenido Principal: Área dinámica de la aplicación */}
        <main className="main-content">
          {/* Sistema de Rutas: Define mapeo URL → Componente */}
          <Routes>
            {/* Rutas de autenticación */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rutas principales de la aplicación */}
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/library" element={<MyLibrary />} />
            <Route path="/library/:id" element={<GameDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        
        {/* Sistema de Notificaciones: Toasts para feedback de usuario */}
        <Toaster position="bottom-right" />
      </div>
    </AuthProvider>
  );
}

export default App;

