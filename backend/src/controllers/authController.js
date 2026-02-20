import authService from '../services/authService.js';

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const result = await authService.registerUser(username, email, password);
      console.log('Resultado registro:', result);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error registro:', error);
      res.status(400).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await authService.loginUser(email, password);
      console.log('Resultado login:', result);
      res.json(result);
    } catch (error) {
      console.error('Error login:', error);
      res.status(401).json({ error: error.message });
    }
  }
};

export default authController;


