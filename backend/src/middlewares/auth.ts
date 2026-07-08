import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { AppError } from './errorHandler.js';

export interface AuthRequest extends Request {
  usuarioId?: number;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError('JWT_SECRET no configurado', 500);
  }
  return secret;
}

export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token de autenticación requerido', 401);
    }

    const token = authHeader.split(' ')[1];
    const secret = getJwtSecret();

    // @ts-ignore - jsonwebtoken types issue with TS6
    const decoded = jwt.verify(token, secret) as unknown as { usuarioId: number };

    req.usuarioId = decoded.usuarioId;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Token inválido o expirado', 401));
    }
  }
};
