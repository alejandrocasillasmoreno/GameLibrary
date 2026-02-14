import { useState } from 'react';
import toast from 'react-hot-toast';

function Home() {
  const [query, setQuery] = useState('');
  const [games, setGames] = useState([]);
  
  // ⚠️ PON TU API KEY DE RAWG AQUÍ
  const API_KEY = 'TU_API_KEY'; 

  const searchGames = async (e) => {
    e.preventDefault();
    const res = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&search=${query}`);
    const data = await res.json();
    setGames(data.results);
  };

  const addGame = async (game) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return toast.error("Loguéate primero");

    const res = await fetch('http://localhost:3000/api/library/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: user.id,
            gameId: game.id,
            titulo: game.name,              // Enviamos CLARAMENTE el título
            imagen_url: game.background_image // Enviamos CLARAMENTE la imagen
        })
    });

    if (res.ok) toast.success("Añadido");
    else toast.error("Error o ya existe");
  };

  return (
    <div style={{ padding: '20px', color: 'white' }}>
        <form onSubmit={searchGames} style={{ marginBottom: '20px' }}>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar..." style={{padding:'10px'}}/>
            <button type="submit" style={{padding:'10px', background: 'linear-gradient(135deg, #646cff 0%, #533a99 100%)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '600', marginLeft: '5px'}}>Buscar</button>
        </form>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {games.map(g => (
                <div key={g.id} style={{ border: '1px solid #333', padding: '10px', width: '200px' }}>
                    <img src={g.background_image} style={{ width: '100%', height: '100px', objectFit:'cover'}} />
                    <h4>{g.name}</h4>
                    <button onClick={() => addGame(g)} style={{width:'100%', background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '600', padding: '8px'}}>+ Añadir</button>
                </div>
            ))}
        </div>
    </div>
  );
}
export default Home;