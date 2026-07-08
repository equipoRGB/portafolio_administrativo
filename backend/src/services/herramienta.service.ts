import { herramientaRepository } from '../repositories/herramienta.repository.js';
import { AppError } from '../middlewares/errorHandler.js';

export const herramientaService = {
  async obtenerCategorias() {
    return await herramientaRepository.obtenerCategorias();
  },

  async crearCategoria(datos: Record<string, unknown>) {
    return await herramientaRepository.crearCategoria(datos as Parameters<typeof herramientaRepository.crearCategoria>[0]);
  },

  async actualizarCategoria(categoria_id: number, datos: Record<string, unknown>) {
    const categoria = await herramientaRepository.obtenerCategoriaPorId(categoria_id);

    if (!categoria) {
      throw new AppError('Categoría no encontrada', 404);
    }

    await herramientaRepository.actualizarCategoria(categoria_id, datos);

    return { message: 'Categoría actualizada correctamente' };
  },

  async eliminarCategoria(categoria_id: number) {
    const categoria = await herramientaRepository.obtenerCategoriaPorId(categoria_id);

    if (!categoria) {
      throw new AppError('Categoría no encontrada', 404);
    }

    await herramientaRepository.eliminarCategoria(categoria_id);

    return { message: 'Categoría eliminada correctamente' };
  },

  async obtenerHerramientas() {
    return await herramientaRepository.obtenerHerramientas();
  },

  async obtenerHerramientaPorId(herramienta_id: number) {
    const herramienta = await herramientaRepository.obtenerHerramientaPorId(herramienta_id);

    if (!herramienta) {
      throw new AppError('Herramienta no encontrada', 404);
    }

    return herramienta;
  },

  async crearHerramienta(datos: Record<string, unknown>) {
    const categoria = await herramientaRepository.obtenerCategoriaPorId(datos.categoria_id as number);

    if (!categoria) {
      throw new AppError('La categoría especificada no existe', 400);
    }

    return await herramientaRepository.crearHerramienta(datos as Parameters<typeof herramientaRepository.crearHerramienta>[0]);
  },

  async actualizarHerramienta(herramienta_id: number, datos: Record<string, unknown>) {
    const herramienta = await herramientaRepository.obtenerHerramientaPorId(herramienta_id);

    if (!herramienta) {
      throw new AppError('Herramienta no encontrada', 404);
    }

    if (datos.categoria_id) {
      const categoria = await herramientaRepository.obtenerCategoriaPorId(datos.categoria_id as number);
      if (!categoria) {
        throw new AppError('La categoría especificada no existe', 400);
      }
    }

    await herramientaRepository.actualizarHerramienta(herramienta_id, datos);

    return { message: 'Herramienta actualizada correctamente' };
  },

  async eliminarHerramienta(herramienta_id: number) {
    const herramienta = await herramientaRepository.obtenerHerramientaPorId(herramienta_id);

    if (!herramienta) {
      throw new AppError('Herramienta no encontrada', 404);
    }

    await herramientaRepository.eliminarHerramienta(herramienta_id);

    return { message: 'Herramienta eliminada correctamente' };
  },
};
