import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

// Ruta de login
router.post('/login', authController.login);

// Eliminar rutas de verificación
// router.get('/verify', authController.verify);
// router.post('/verify', authController.verify);

export default router;