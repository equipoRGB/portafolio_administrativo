import type { Response, NextFunction } from 'express';

import { mensajeService } from '../services/mensaje.service.js';
import type { AuthRequest } from '../middlewares/auth.js';

export const mensajeController = {
  async obtenerTodos(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const mensajes = await mensajeService.obtenerTodos();
      res.json({ data: mensajes });
    } catch (error) {
      next(error);
    }
  },

  async obtenerPorId(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const mensaje = await mensajeService.obtenerPorId(Number(id));
      res.json({ data: mensaje });
    } catch (error) {
      next(error);
    }
  },

  async crear(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const mensaje = await mensajeService.crear(req.body);
      res.status(201).json({
        data: mensaje,
        message: 'Mensaje enviado correctamente',
      });
    } catch (error) {
      next(error);
    }
  },

  async actualizarEstado(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { leido } = req.body;
      const result = await mensajeService.actualizarEstado(Number(id), leido);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async eliminar(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await mensajeService.eliminar(Number(id));
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
