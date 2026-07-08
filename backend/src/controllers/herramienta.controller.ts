import type { Response, NextFunction } from 'express';

import { herramientaService } from '../services/herramienta.service.js';
import type { AuthRequest } from '../middlewares/auth.js';

export const herramientaController = {
  async obtenerCategorias(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const categorias = await herramientaService.obtenerCategorias();
      res.json({ data: categorias });
    } catch (error) {
      next(error);
    }
  },

  async crearCategoria(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const categoria = await herramientaService.crearCategoria(req.body);
      res.status(201).json({
        data: categoria,
        message: 'Categoría creada correctamente',
      });
    } catch (error) {
      next(error);
    }
  },

  async actualizarCategoria(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await herramientaService.actualizarCategoria(Number(id), req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async eliminarCategoria(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await herramientaService.eliminarCategoria(Number(id));
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async obtenerHerramientas(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const herramientas = await herramientaService.obtenerHerramientas();
      res.json({ data: herramientas });
    } catch (error) {
      next(error);
    }
  },

  async obtenerHerramientaPorId(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const herramienta = await herramientaService.obtenerHerramientaPorId(Number(id));
      res.json({ data: herramienta });
    } catch (error) {
      next(error);
    }
  },

  async crearHerramienta(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const herramienta = await herramientaService.crearHerramienta(req.body);
      res.status(201).json({
        data: herramienta,
        message: 'Herramienta creada correctamente',
      });
    } catch (error) {
      next(error);
    }
  },

  async actualizarHerramienta(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await herramientaService.actualizarHerramienta(Number(id), req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async eliminarHerramienta(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await herramientaService.eliminarHerramienta(Number(id));
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
