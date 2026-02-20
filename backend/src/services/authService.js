import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const authService = {
  registerUser: async (name, email, password) => {
    // Validar datos
    if (!name || !email || !password) {
      throw new Error('Todos los campos son requeridos');
    }

    // Verificar si el usuario ya existe
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      throw new Error('El correo electrónico ya está registrado');
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    const userId = await userModel.createUser(name, email, hashedPassword);
    
    // Obtener el usuario creado para incluir el rol
    const newUser = await userModel.findUserById(userId);
    
    // Generar token JWT
    console.log('Valor de JWT_SECRET en register:', process.env.JWT_SECRET);
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no está definido en las variables de entorno');
    }
    
    // Debug: Verificar datos del usuario antes de generar token
    console.log('🔍 Datos para JWT register:', {
      id: userId,
      email,
      role: newUser.role,
      roleType: typeof newUser.role
    });
    
    const token = jwt.sign(
      { id: userId, email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Debug: Verificar token generado
    console.log('✅ Token JWT generado en register');

    console.log('Resultado registro authService:', {
      message: 'Usuario registrado exitosamente',
      token,
      user: { 
        id: userId, 
        name, 
        email,
        role: newUser.role 
      }
    });

    return {
      message: 'Usuario registrado exitosamente',
      token,
      user: { 
        id: userId, 
        name, 
        email,
        role: newUser.role 
      }
    };
  },

  loginUser: async (email, password) => {
    // Validar datos
    if (!email || !password) {
      throw new Error('Correo y contraseña son requeridos');
    }

    // Buscar usuario
    const user = await userModel.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // Generar token JWT
    console.log('Valor de JWT_SECRET en login:', process.env.JWT_SECRET);
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no está definido en las variables de entorno');
    }
    const token = jwt.sign(
      { id: user.id, email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Resultado login authService:', {
      message: 'Inicio de sesión exitoso',
      token,
      user: { 
        id: user.id, 
        name: user.name, 
        email,
        role: user.role 
      }
    });

    return {
      message: 'Inicio de sesión exitoso',
      token,
      user: { 
        id: user.id, 
        name: user.name, 
        email,
        role: user.role 
      }
    };
  }
};

export default authService;
