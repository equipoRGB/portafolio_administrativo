import type { Response, NextFunction } from 'express';

import { proyectoService } from '../services/proyecto.service.js';
import type { AuthRequest } from '../middlewares/auth.js';

export const proyectoController = {
  async obtenerTodos(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const proyectos = await proyectoService.obtenerTodos();
      res.json({ data: proyectos });
    } catch (error) {
      next(error);
    }
  },

  async obtenerPublicados(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const proyectos = await proyectoService.obtenerPublicados();
      res.json({ data: proyectos });
    } catch (error) {
      next(error);
    }
  },

  async obtenerPorId(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const proyecto = await proyectoService.obtenerPorId(Number(id));
      res.json({ data: proyecto });
    } catch (error) {
      next(error);
    }
  },

  async crear(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const proyecto = await proyectoService.crear(req.body);
      res.status(201).json({
        data: proyecto,
        message: 'Proyecto creado correctamente',
      });
    } catch (error) {
      next(error);
    }
  },

  async actualizar(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await proyectoService.actualizar(Number(id), req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async eliminar(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await proyectoService.eliminar(Number(id));
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async actualizarImagen(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No se proporcionó una imagen' });
      }

      const { id } = req.params;
      const result = await proyectoService.actualizarImagen(Number(id), req.file);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async eliminarImagen(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await proyectoService.eliminarImagen(Number(id));
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
