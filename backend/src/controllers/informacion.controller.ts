import type { Response, NextFunction } from 'express';

import { informacionService } from '../services/informacion.service.js';
import type { AuthRequest } from '../middlewares/auth.js';

export const informacionController = {
  async obtener(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const informacion = await informacionService.obtener();
      res.json({ data: informacion });
    } catch (error) {
      next(error);
    }
  },

  async actualizar(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await informacionService.actualizar(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async actualizarFotografia(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No se proporcionó una imagen' });
      }

      const result = await informacionService.actualizarFotografia(req.file);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async eliminarFotografia(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await informacionService.eliminarFotografia();
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
