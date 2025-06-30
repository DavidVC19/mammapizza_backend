import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth.js';

const router = Router();
const authController = new AuthController();

// Rutas públicas
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Rutas de verificación
router.get('/verify', (req, res) => {
  // Por ahora, simplemente devuelve un estado de éxito
  res.status(200).json({
    success: true,
    message: 'Sesión verificada',
    usuario: {
      id: 1,
      email: 'admin@mammapizza.com',
      rol: 'admin'
    }
  });
});

// Rutas protegidas
router.get('/admin/check', authenticateToken, requireAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Usuario admin verificado',
    usuario: req.user
  });
});

export default router;