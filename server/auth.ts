import { betterAuth } from 'better-auth';
import { pool } from './db/pool';
import dotenv from 'dotenv';

dotenv.config();

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || 'hupa-dev-secret-replace-in-production-min-32-chars-key',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5173',
  trustedOrigins: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:5173',
    process.env.APP_URL || '',
  ].filter(Boolean),
});
