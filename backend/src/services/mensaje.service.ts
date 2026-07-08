import { mensajeRepository } from '../repositories/mensaje.repository.js';
import { AppError } from '../middlewares/errorHandler.js';

export const mensajeService = {
  async obtenerTodos() {
    return await mensajeRepository.obtenerTodos();
  },

  async obtenerPorId(mensaje_id: number) {
    const mensaje = await mensajeRepository.obtenerPorId(mensaje_id);

    if (!mensaje) {
      throw new AppError('Mensaje no encontrado', 404);
    }

    return mensaje;
  },

  async crear(datos: Record<string, unknown>) {
    return await mensajeRepository.crear(datos as Parameters<typeof mensajeRepository.crear>[0]);
  },

  async actualizarEstado(mensaje_id: number, leido: boolean) {
    const mensaje = await mensajeRepository.obtenerPorId(mensaje_id);

    if (!mensaje) {
      throw new AppError('Mensaje no encontrado', 404);
    }

    await mensajeRepository.actualizarEstado(mensaje_id, leido);

    return { message: 'Estado del mensaje actualizado correctamente' };
  },

  async eliminar(mensaje_id: number) {
    const mensaje = await mensajeRepository.obtenerPorId(mensaje_id);

    if (!mensaje) {
      throw new AppError('Mensaje no encontrado', 404);
    }

    await mensajeRepository.eliminar(mensaje_id);

    return { message: 'Mensaje eliminado correctamente' };
  },
};
