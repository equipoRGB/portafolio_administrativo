import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { ZodError } from 'zod';

import { AppError } from './errorHandler.js';

export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errores = error.issues.map((issue) => ({
          campo: issue.path.join('.'),
          mensaje: issue.message,
        }));
        next(new AppError('Error de validación', 400, errores));
      } else if (error instanceof Error) {
        next(new AppError(error.message, 400));
      } else {
        next(new AppError('Error de validación', 400));
      }
    }
  };
};
