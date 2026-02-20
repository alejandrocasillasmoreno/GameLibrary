import gameModel from '../models/gameModel.js';

const gameService = {
  getAllGames: async () => {
    try {
      const games = await gameModel.getAllGames();
      return games;
    } catch (error) {
      throw new Error('Error al obtener juegos del catálogo');
    }
  },

  getGameById: async (id) => {
    try {
      const game = await gameModel.getGameById(id);
      return game;
    } catch (error) {
      throw new Error('Error al obtener el juego');
    }
  }
};

export default gameService;
