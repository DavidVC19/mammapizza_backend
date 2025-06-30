import { AuthService } from '../services/auth.service.js';
import config from "../config/config.js";

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      console.log('[AuthController] Intento de login para:', email);
      
      if (!email || !password) {
        console.warn('[AuthController] Faltan credenciales');
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
      }

      const result = await this.authService.login(email, password);
      console.log('[AuthController] Login exitoso para:', email);

      // Configuración mejorada de cookies para producción
      const isProduction = process.env.NODE_ENV === 'production';
      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        domain: isProduction ? '.onrender.com' : undefined // Dominio compartido para subdominios
      };

      res.cookie('authToken', result.token, cookieOptions);
      console.log('[AuthController] Cookie establecida con opciones:', cookieOptions);

      res.json({
        success: true,
        message: 'Login exitoso',
        usuario: result.usuario,
        token: result.token // Fallback para localStorage
      });

    } catch (error) {
      console.error('[AuthController] Error en login:', error.message);
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  };

  logout = async (req, res) => {
    try {
      console.log('[AuthController] Logout solicitado');
      
      const isProduction = config.NODE_ENV === 'production';
      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        domain: isProduction ? '.onrender.com' : undefined
      };

      res.clearCookie('authToken', cookieOptions);
      console.log('[AuthController] Cookie eliminada');

      res.json({
        success: true,
        message: 'Logout exitoso'
      });
    } catch (error) {
      console.error('[AuthController] Error en logout:', error);
      res.status(500).json({
        success: false,
        message: 'Error al cerrar sesión'
      });
    }
  };

  verify = async (req, res) => {
    try {
      console.log('[AuthController] Verificación de token iniciada');
      console.log('Cookies recibidas:', req.cookies);
      console.log('Headers recibidos:', req.headers);

      let token = req.cookies.authToken;

      // Fallback para token en headers
      if (!token && req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.substring(7);
        console.log('[AuthController] Token obtenido de headers');
      }

      if (!token) {
        console.warn('[AuthController] No se encontró token');
        return res.status(401).json({
          success: false,
          message: 'No hay token de autenticación'
        });
      }

      const usuario = await this.authService.verifyToken(token);
      console.log('[AuthController] Token verificado para usuario:', usuario.email);

      res.json({
        success: true,
        usuario
      });

    } catch (error) {
      console.error('[AuthController] Error en verificación:', error.message);
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  };
}