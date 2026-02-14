import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Catalog from './components/Catalog';
import MyLibrary from './components/MyLibrary';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard'; // <--- IMPORTAMOS EL DASHBOARD
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/library" element={<MyLibrary />} />
            
            {/* 👇 NUEVA RUTA PARA EL DASHBOARD 👇 */}
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Toaster position="bottom-right" />
      </div>
    </AuthProvider>
  );
}

export default App;