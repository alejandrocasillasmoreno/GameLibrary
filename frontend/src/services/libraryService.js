const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getMyLibrary = async (userId) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/api/library/${userId}`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  if (!response.ok) throw new Error('Error al obtener la biblioteca');
  return response.json();
};

export const removeFromLibrary = async (entryId) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/api/library/${entryId}`, {
    method: 'DELETE',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  if (!response.ok) throw new Error('Error al eliminar de la biblioteca');
  return response.json();
};

export const updateGameStatus = async (entryId, status) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/api/library/${entryId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  if (!response.ok) throw new Error('Error al actualizar el estado');
  return response.json();
};
