import { experienciaRepository } from '../repositories/experiencia.repository.js';
import { AppError } from '../middlewares/errorHandler.js';

export const experienciaService = {
  async obtenerTodas() {
    return await experienciaRepository.obtenerTodas();
  },

  async obtenerPorId(experiencia_id: number) {
    const experiencia = await experienciaRepository.obtenerPorId(experiencia_id);

    if (!experiencia) {
      throw new AppError('Experiencia no encontrada', 404);
    }

    return experiencia;
  },

  async crear(datos: Record<string, unknown>) {
    return await experienciaRepository.crear(datos as Parameters<typeof experienciaRepository.crear>[0]);
  },

  async actualizar(experiencia_id: number, datos: Record<string, unknown>) {
    const experiencia = await experienciaRepository.obtenerPorId(experiencia_id);

    if (!experiencia) {
      throw new AppError('Experiencia no encontrada', 404);
    }

    await experienciaRepository.actualizar(experiencia_id, datos);

    return { message: 'Experiencia actualizada correctamente' };
  },

  async eliminar(experiencia_id: number) {
    const experiencia = await experienciaRepository.obtenerPorId(experiencia_id);

    if (!experiencia) {
      throw new AppError('Experiencia no encontrada', 404);
    }

    await experienciaRepository.eliminar(experiencia_id);

    return { message: 'Experiencia eliminada correctamente' };
  },
};
