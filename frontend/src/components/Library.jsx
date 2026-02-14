import { useState, useEffect } from 'react';
import toast from 'react-hot-toast'; // Importamos toast para las notificaciones

function Library() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. CARGAR JUEGOS AL INICIAR
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (user) {
            fetch(`http://localhost:3000/api/library/${user.id}`) // Asegúrate de tener esta ruta GET en tu backend
                .then(res => res.json())
                .then(data => {
                    setGames(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error cargando biblioteca:", err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    // 2. FUNCIÓN PARA CAMBIAR ESTADO (CORREGIDA ✅)
    const handleStatusChange = async (id, newStatus) => {
        // Actualización optimista: Cambiamos la pantalla YA para que se sienta rápido
        setGames(games.map(game => 
            game.id === id ? { ...game, status: newStatus } : game
        ));

        try {
            // 👇 AQUÍ ESTABA EL ERROR: Cambiado '/update/' por '/status/'
            const response = await fetch(`http://localhost:3000/api/library/status/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }) 
            });

            if (!response.ok) {
                throw new Error('Error al guardar en base de datos');
            }
            toast.success("Estado actualizado correctamente");
            console.log("✅ Estado guardado en BD");

        } catch (error) {
            console.error("Error de conexión:", error);
            toast.error("No se pudo guardar el cambio");
            // Si falla, revertimos el cambio visual (opcional)
        }
    };

    // 3. FUNCIÓN PARA ELIMINAR JUEGO
    const handleDelete = async (id) => {
        if (!confirm("¿Seguro que quieres eliminar este juego?")) return;

        // Quitamos de la vista inmediatamente
        setGames(games.filter(g => g.id !== id));

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            // Asegúrate de tener una ruta DELETE en tu backend para esto
            await fetch(`http://localhost:3000/api/library/${id}`, { 
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });
            toast.success("Juego eliminado");
        } catch (error) {
            console.error("Error al eliminar:", error);
            toast.error("Error al eliminar");
        }
    };

    // 4. RENDERIZADO
    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white">
            <h2 className="text-3xl font-bold mb-6 text-center text-green-400">Mi Colección de Juegos</h2>

            {loading ? (
                <p className="text-center text-gray-200">Cargando juegos...</p>
            ) : games.length === 0 ? (
                <div className="text-center mt-10">
                    <p className="text-xl text-gray-200">Tu biblioteca está vacía.</p>
                    <p className="text-sm text-gray-300 mt-2">Ve al buscador y añade tu primer juego.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {games.map((game) => (
                        <div key={game.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:border-green-500 transition duration-300">
                            
                            {/* Imagen del Juego */}
                            <div className="h-48 overflow-hidden relative">
                                <img 
                                    src={game.imagen_url || 'https://via.placeholder.com/300x200?text=No+Image'} 
                                    alt={game.titulo} 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-0 right-0 bg-black bg-opacity-70 text-white text-xs px-2 py-1 m-2 rounded">
                                    {game.plataforma || 'Juego'}
                                </div>
                            </div>

                            {/* Contenido de la Tarjeta */}
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1 truncate" title={game.titulo}>
                                    {game.titulo}
                                </h3>

                                {/* SELECTOR DE ESTADO */}
                                <div className="mt-4">
                                    <label htmlFor={`status-select-${game.id}`} className="text-xs text-gray-200 block mb-1 uppercase font-bold">Estado:</label>
                                    <select 
                                        id={`status-select-${game.id}`}
                                        value={game.status || 'pendiente'} 
                                        onChange={(e) => handleStatusChange(game.id, e.target.value)}
                                        className={`w-full p-2 rounded text-sm font-semibold outline-none cursor-pointer text-white transition-colors
                                            ${game.status === 'pendiente' ? 'bg-yellow-700 hover:bg-yellow-600' : ''}
                                            ${game.status === 'jugando' ? 'bg-blue-700 hover:bg-blue-600' : ''}
                                            ${game.status === 'completado' ? 'bg-green-700 hover:bg-green-600' : ''}
                                            ${game.status === 'abandonado' ? 'bg-red-700 hover:bg-red-600' : ''}
                                            ${!game.status ? 'bg-gray-700' : ''} 
                                        `}
                                    >
                                        <option value="pendiente" className="bg-gray-800">⏳ Pendiente</option>
                                        <option value="jugando" className="bg-gray-800">🎮 Jugando</option>
                                        <option value="completado" className="bg-gray-800">✅ Completado</option>
                                        <option value="abandonado" className="bg-gray-800">❌ Abandonado</option>
                                    </select>
                                </div>

                                {/* Botón Eliminar */}
                                <button 
                                    onClick={() => handleDelete(game.id)}
                                    className="mt-4 w-full bg-red-700 hover:bg-red-600 text-white py-1 px-3 rounded text-sm transition border border-red-600"
                                >
                                    Eliminar de la lista
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Library;