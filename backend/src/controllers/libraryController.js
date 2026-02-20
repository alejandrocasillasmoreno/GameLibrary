import * as libraryService from '../services/libraryService.js';

export const getLibrary = async (req, res) => {
    try {
        const { userId } = req.params;
        const games = await libraryService.getUserLibrary(userId);
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getGameById = async (req, res) => {
    try {
        const { id } = req.params;
        const game = await libraryService.getLibraryGameById(id);
        if (!game) return res.status(404).json({ message: 'Juego no encontrado' });
        res.json(game);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addGame = async (req, res) => {
    try {
        const { userId, gameId, titulo, imagen_url, plataforma } = req.body;
        
        // Validar campos requeridos
        if (!userId || !gameId || !titulo) {
            return res.status(400).json({ 
                message: 'Faltan campos requeridos: userId, gameId, titulo' 
            });
        }

        console.log('🔍 Intentando añadir juego:', { userId, gameId, titulo, plataforma });
        
        await libraryService.addGameToLibrary(userId, gameId, titulo, imagen_url, plataforma);
        console.log('✅ Juego añadido exitosamente');
        
        res.status(201).json({ message: 'Juego añadido correctamente' });
    } catch (error) {
        console.error('❌ Error en addGame:', error);
        
        if (error.message === 'El juego ya está en tu lista') {
            return res.status(409).json({ message: error.message });
        }
        
        // Devolver más detalles del error para depuración
        res.status(500).json({ 
            error: error.message,
            details: error.stack 
        });
    }
};

export const updateGame = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, valoracion } = req.body;
        const updated = await libraryService.updateLibraryGame(id, status, valoracion);
        if (!updated) return res.status(404).json({ message: 'Juego no encontrado' });
        res.json({ message: 'Juego actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteGame = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await libraryService.deleteLibraryGame(id);
        if (!deleted) return res.status(404).json({ message: 'Juego no encontrado' });
        res.json({ message: 'Juego eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
