import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getRedisClient } from '../config/redis';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string; jti: string };
    const isRevoked = await getRedisClient().get(`session_revoked:${decoded.jti}`) !== null;

    if (isRevoked) {
      return res.status(401).json({ error: 'Unauthorized: Token revoked' });
    }

    req.userId = decoded.sub;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string; jti: string };
    const isRevoked = await getRedisClient().get(`session_revoked:${decoded.jti}`) !== null;

    if (!isRevoked) {
      req.userId = decoded.sub;
    }
  } catch (err) {
    // Ignore error for optional auth
  }

  next();
};
