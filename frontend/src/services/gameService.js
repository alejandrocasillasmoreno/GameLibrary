const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getGameDetails = async (gameId) => {
  const response = await fetch(`${API_URL}/api/games/${gameId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Error al obtener los detalles del juego');
  }
  
  return response.json();
};