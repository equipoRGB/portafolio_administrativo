import type { Request, Response, NextFunction } from 'express';

import { authService } from '../services/auth.service.js';
import type { AuthRequest } from '../middlewares/auth.js';

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre_usuario, contrasena } = req.body;
      const result = await authService.login(nombre_usuario, contrasena);
      res.json({
        data: result,
        message: 'Inicio de sesión exitoso',
      });
    } catch (error) {
      next(error);
    }
  },

  async obtenerUsuario(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const usuario = await authService.obtenerUsuario(req.usuarioId!);
      res.json({ data: usuario });
    } catch (error) {
      next(error);
    }
  },

  async cambiarContrasena(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { contrasenaActual, nuevaContrasena } = req.body;
      const result = await authService.cambiarContrasena(
        req.usuarioId!,
        contrasenaActual,
        nuevaContrasena
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async cambiarNombreUsuario(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { nombre_usuario } = req.body;
      const result = await authService.cambiarNombreUsuario(req.usuarioId!, nombre_usuario);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
