import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth';
import { projectsRouter } from './routes/projects';
import { pool } from './db/pool';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';
const vercelProdUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '';

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, electron file:// or same-origin)
      if (!origin) return callback(null, true);
      const allowed = [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:5173',
        process.env.APP_URL,
        process.env.BETTER_AUTH_URL,
        vercelUrl,
        vercelProdUrl,
      ].filter(Boolean);

      if (allowed.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '15mb' }));

// 1. Better Auth Handler (Express 5 wildcard parameter)
app.all('/api/auth', toNodeHandler(auth));
app.all('/api/auth/*splat', toNodeHandler(auth));

// 2. Health & System Check
app.get('/api/health', async (_req, res) => {
  try {
    const dbRes = await pool.query('SELECT NOW() as now');
    res.json({
      status: 'healthy',
      service: 'hupa-api',
      timestamp: dbRes.rows[0].now,
      auth: 'better-auth',
      database: 'supabase-postgresql',
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'degraded',
      service: 'hupa-api',
      error: error.message || 'Database connection error',
    });
  }
});

// 3. Application API Routes
app.use('/api/projects', projectsRouter);

// 4. Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred.' : err.message,
  });
});

// Only bind listener when running as a standalone server, not inside Vercel serverless functions
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`HUPA Backend API Server running on port ${PORT}`);
    console.log(`- Better Auth mounted at: /api/auth/*`);
    console.log(`- Supabase PostgreSQL connected`);
  });
}

export default app;
