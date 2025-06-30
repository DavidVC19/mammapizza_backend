import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRepository } from '../repositories/auth.repository.js';
import config from "../config/config.js";

export class AuthService {
  constructor() {
    this.authRepository = new AuthRepository();
  }

  async login(email, password) {
    try {
      // Credenciales de administrador fijas
      const ADMIN_EMAIL = 'admin@mammapizza.com';
      const ADMIN_PASSWORD = 'adminjhon';

      // Validación de credenciales de administrador
      if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        throw new Error('Credenciales incorrectas');
      }

      // Generar respuesta de éxito para admin
      return {
        success: true,
        message: 'Inicio de sesión exitoso',
        usuario: {
          id: 1,
          email: ADMIN_EMAIL,
          rol: 'admin'
        }
        // Comentar temporalmente la generación de token
        // token: jwt.sign(
        //   { 
        //     id: 1, 
        //     email: ADMIN_EMAIL, 
        //     rol: 'admin' 
        //   }, 
        //   config.JWT_SECRET, 
        //   { expiresIn: '1h' }
        // )
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      
      if (decoded.email !== 'admin@mammapizza.com' || decoded.rol !== 'admin') {
        throw new Error('Token de administrador inválido');
      }

      return {
        id: 1,
        nombre: 'Administrador',
        email: 'admin@mammapizza.com',
        rol: 'admin'
      };
    } catch (error) {
      throw new Error('Token inválido: ' + error.message);
    }
  }
}