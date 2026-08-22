import type { Request, Response, NextFunction } from 'express';
import { auth } from '../auth';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    image?: string;
  };
  session?: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    if (!session || !session.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required. Please sign in.',
      });
      return;
    }

    req.user = session.user as any;
    req.session = session.session as any;
    next();
  } catch (error) {
    console.error('Session verification error:', error);
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid session.',
    });
    return;
  }
}

export async function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    if (session && session.user) {
      req.user = session.user as any;
      req.session = session.session as any;
    }
  } catch {
    // Ignore error for optional auth
  }
  next();
}
