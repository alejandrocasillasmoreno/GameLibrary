import gameService from '../services/gameService.js';

const gameController = {
  getAllGames: async (req, res) => {
    try {
      const games = await gameService.getAllGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getGameById: async (req, res) => {
    try {
      const { id } = req.params;
      const game = await gameService.getGameById(id);
      if (!game) {
        return res.status(404).json({ error: 'Juego no encontrado' });
      }
      res.json(game);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default gameController;
