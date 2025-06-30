import { AuthService } from '../services/auth.service.js';
import config from "../config/config.js";

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }
  //

  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Llamar al servicio de login
      const loginResult = await this.authService.login(email, password);

      // Enviar respuesta de éxito
      res.status(200).json(loginResult);
    } catch (error) {
      // Manejar errores de autenticación
      console.error('Error de inicio de sesión:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Error de autenticación'
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
      console.log('Método de solicitud:', req.method);
      console.log('Cookies recibidas:', req.cookies);
      console.log('Headers recibidos:', req.headers);
      console.log('Cuerpo de la solicitud:', req.body);

      // Buscar token en múltiples lugares
      let token = 
        req.cookies.authToken || 
        req.headers.authorization?.replace('Bearer ', '') ||
        req.body.token;

      console.log('[AuthController] Token encontrado:', !!token);

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
        message: error.message || 'Error de autenticación'
      });
    }
  };
}