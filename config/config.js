import dotenv from "dotenv";

dotenv.config();

const config = {
    PORT: process.env.PORT,
    DB_USER: process.env.DB_USER,
    DB_HOST: process.env.DB_HOST,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    FRONTEND_HOST: process.env.FRONTEND_HOST,
    NEXT_PUBLIC_BACK_HOST: process.env.NEXT_PUBLIC_BACK_HOST,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL
}

const corsOptions = {
  origin: [
    'https://mammapizza-frontend.onrender.com',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
};

export default config;
