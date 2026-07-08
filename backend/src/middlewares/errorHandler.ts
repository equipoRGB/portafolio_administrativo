import type { Request, Response, NextFunction } from 'express';

interface ErrorCampo {
  campo: string;
  mensaje: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errores?: ErrorCampo[];

  constructor(message: string, statusCode: number, errores?: ErrorCampo[]) {
    super(message);
    this.statusCode = statusCode;
    this.errores = errores;
    this.name = 'AppError';
  }
}

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      ...(error.errores && error.errores.length > 0 ? { errores: error.errores } : {}),
    });
  }

  console.error('Error inesperado:', error);

  return res.status(500).json({
    message: 'Error interno del servidor',
  });
};

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({
    message: 'Recurso no encontrado',
  });
};
