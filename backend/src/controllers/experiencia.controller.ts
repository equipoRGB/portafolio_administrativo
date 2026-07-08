import type { Response, NextFunction } from 'express';

import { experienciaService } from '../services/experiencia.service.js';
import type { AuthRequest } from '../middlewares/auth.js';

export const experienciaController = {
  async obtenerTodas(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const experiencias = await experienciaService.obtenerTodas();
      res.json({ data: experiencias });
    } catch (error) {
      next(error);
    }
  },

  async obtenerPorId(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const experiencia = await experienciaService.obtenerPorId(Number(id));
      res.json({ data: experiencia });
    } catch (error) {
      next(error);
    }
  },

  async crear(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const experiencia = await experienciaService.crear(req.body);
      res.status(201).json({
        data: experiencia,
        message: 'Experiencia creada correctamente',
      });
    } catch (error) {
      next(error);
    }
  },

  async actualizar(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await experienciaService.actualizar(Number(id), req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async eliminar(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await experienciaService.eliminar(Number(id));
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
