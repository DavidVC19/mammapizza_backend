import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';

import categoriasRoutes from './routes/categorias.routes.js';
import tamaniosRoutes from './routes/tamanios.routes.js';
import saboresRoutes from './routes/sabores.routes.js';
import tamanioSaborRoutes from './routes/tamanioSabor.routes.js';
import productosRoutes from './routes/productos.routes.js'; 
import unicosRoutes from './routes/unicos.routes.js';
import combinacionesRoutes from './routes/combinaciones.routes.js';
import promocionesRoutes from './routes/promociones.routes.js';
import detallesPromocionRoutes from './routes/detallesPromocion.routes.js';
import estadisticasRoutes from './routes/estadisticas.routes.js';

import config from './config/config.js';

const app = express();

// Configuración CORS mejorada para producción
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://mammapizza-frontend.onrender.com',  // Quitar la barra diagonal final
      'http://localhost:3000',  // Añadir localhost para desarrollo
      /\.mammapizza\.com$/
    ];

    console.log('[CORS] Origen de la solicitud:', origin);

    if (!origin || allowedOrigins.some(allowed => 
      typeof allowed === 'string' 
        ? allowed === origin 
        : allowed.test(origin)
    )) {
      console.log('[CORS] Origen permitido');
      callback(null, true);
    } else {
      console.warn('[CORS] Origen no permitido:', origin);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Origin', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Middleware de logging para debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Cookies:', req.cookies);
  next();
});

app.use('/uploads', express.static(path.resolve('uploads')));

app.get('/', (req, res) => { 
  res.send('API corriendo correctamente');
});

// Todas tus rutas
app.use('/api/auth', authRoutes);

app.use('/api/categorias', categoriasRoutes);
app.use('/api/tamanios', tamaniosRoutes);
app.use('/api/sabores', saboresRoutes);
app.use('/api/tamaniosabor', tamanioSaborRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/unicos', unicosRoutes);
app.use('/api/combinaciones', combinacionesRoutes);
app.use('/api/promociones', promocionesRoutes);
app.use('/api/detallespromocion', detallesPromocionRoutes);
app.use('/api/estadisticas', estadisticasRoutes);

export default app;
