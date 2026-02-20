import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './UserManagement.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Error al cargar usuarios');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error('No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Error al eliminar usuario');
      toast.success('Usuario eliminado exitosamente');
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error('No se pudo eliminar el usuario');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || user.role !== 'admin') {
    return (
      <div className="user-management-container">
        <h2>Gestión de Usuarios</h2>
        <p>Acceso restringido a administradores.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="user-management-container">
        <h2>Gestión de Usuarios</h2>
        <div className="loading">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className="user-management-container">
      <h2>👥 Gestión de Usuarios</h2>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar usuarios por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="users-list">
        {filteredUsers.length === 0 ? (
          <p>No hay usuarios registrados.</p>
        ) : (
          filteredUsers.map(userItem => (
            <div key={userItem.id} className="user-card">
              <div className="user-info">
                <h3>{userItem.name}</h3>
                <p>{userItem.email}</p>
                <span className={`role-badge ${userItem.role}`}>
                  {userItem.role === 'admin' ? 'Administrador' : 'Usuario'}
                </span>
              </div>
              <div className="user-actions">
                <button 
                  onClick={() => handleDeleteUser(userItem.id)}
                  className="btn-delete"
                  disabled={userItem.role === 'admin'}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserManagement;