import { AuthService } from '../services/auth.service.js';
import config from "../config/config.js";

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
      }

      const result = await this.authService.login(email, password);

      // Configuración de cookie mejorada para producción
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost' // Sin domain en producción cross-origin
      };

      res.cookie('authToken', result.token, cookieOptions);

      res.json({
        success: true,
        message: 'Login exitoso',
        usuario: result.usuario,
        token: result.token // Enviar también en el body como fallback
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  };

  logout = async (req, res) => {
    try {
      // Limpiar cookie con las mismas opciones
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
      };

      res.clearCookie('authToken', cookieOptions);
      
      res.json({
        success: true,
        message: 'Logout exitoso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al cerrar sesión'
      });
    }
  };

  verify = async (req, res) => {
    try {
      let token = req.cookies.authToken;

      // Fallback: buscar token en headers si no está en cookies
      if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7);
        }
      }

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No hay token de autenticación'
        });
      }

      const usuario = await this.authService.verifyToken(token);

      res.json({
        success: true,
        usuario
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  };
}