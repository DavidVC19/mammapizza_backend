import { AuthService } from '../services/auth.service.js';

const authService = new AuthService();

export const authenticateToken = async (req, res, next) => {
  try {
    // Buscar token en múltiples lugares
    let token = 
      req.cookies.authToken || 
      req.headers.authorization?.replace('Bearer ', '') ||
      req.body.token;

    console.log('[Middleware] Token encontrado:', !!token);
    console.log('[Middleware] Cookies:', req.cookies);
    console.log('[Middleware] Headers:', req.headers);

    if (!token) {
      console.warn('[Middleware] Token no encontrado');
      return res.status(401).json({
        success: false,
        message: 'No se encontró token de autenticación'
      });
    }

    const usuario = await authService.verifyToken(token);
    req.user = usuario;
    next();
  } catch (error) {
    console.error('[Middleware] Error de autenticación:', error);
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de administrador'
    });
  }
  next();
};