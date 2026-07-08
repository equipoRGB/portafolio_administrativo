import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { config } from '../config/index.js';
import { authRepository } from '../repositories/auth.repository.js';
import { AppError } from '../middlewares/errorHandler.js';

export const authService = {
  async login(nombre_usuario: string, contrasena: string) {
    const usuario = await authRepository.buscarPorNombreUsuario(nombre_usuario);

    if (!usuario) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!contrasenaValida) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const token = jwt.sign(
      { usuarioId: usuario.usuario_id },
      config.jwt.secret,
      { expiresIn: '24h' }
    );

    return {
      token,
      usuario: {
        usuario_id: usuario.usuario_id,
        nombre_usuario: usuario.nombre_usuario,
      },
    };
  },

  async cambiarContrasena(usuario_id: number, contrasenaActual: string, nuevaContrasena: string) {
    const usuario = await authRepository.buscarPorId(usuario_id);

    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404);
    }

    const contrasenaValida = await bcrypt.compare(contrasenaActual, usuario.contrasena);

    if (!contrasenaValida) {
      throw new AppError('La contraseña actual es incorrecta', 401);
    }

    const contrasenaHasheada = await bcrypt.hash(nuevaContrasena, 10);
    await authRepository.actualizarContrasena(usuario_id, contrasenaHasheada);

    return { message: 'Contraseña actualizada correctamente' };
  },

  async cambiarNombreUsuario(usuario_id: number, nombre_usuario: string) {
    const usuarioExistente = await authRepository.buscarPorNombreUsuario(nombre_usuario);

    if (usuarioExistente && usuarioExistente.usuario_id !== usuario_id) {
      throw new AppError('El nombre de usuario ya está en uso', 409);
    }

    await authRepository.actualizarNombreUsuario(usuario_id, nombre_usuario);

    return { message: 'Nombre de usuario actualizado correctamente' };
  },

  async obtenerUsuario(usuario_id: number) {
    const usuario = await authRepository.buscarPorId(usuario_id);

    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404);
    }

    return {
      usuario_id: usuario.usuario_id,
      nombre_usuario: usuario.nombre_usuario,
    };
  },
};
