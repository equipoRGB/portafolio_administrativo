import { proyectoRepository } from '../repositories/proyecto.repository.js';
import { cloudinary } from '../config/cloudinary.js';
import { AppError } from '../middlewares/errorHandler.js';

export const proyectoService = {
  async obtenerTodos() {
    return await proyectoRepository.obtenerTodos();
  },

  async obtenerPublicados() {
    return await proyectoRepository.obtenerPublicados();
  },

  async obtenerPorId(proyecto_id: number) {
    const proyecto = await proyectoRepository.obtenerPorId(proyecto_id);

    if (!proyecto) {
      throw new AppError('Proyecto no encontrado', 404);
    }

    return proyecto;
  },

  async crear(datos: Record<string, unknown>) {
    return await proyectoRepository.crear(datos as Parameters<typeof proyectoRepository.crear>[0]);
  },

  async actualizar(proyecto_id: number, datos: Record<string, unknown>) {
    const proyecto = await proyectoRepository.obtenerPorId(proyecto_id);

    if (!proyecto) {
      throw new AppError('Proyecto no encontrado', 404);
    }

    await proyectoRepository.actualizar(proyecto_id, datos);

    return { message: 'Proyecto actualizado correctamente' };
  },

  async eliminar(proyecto_id: number) {
    const proyecto = await proyectoRepository.obtenerPorId(proyecto_id);

    if (!proyecto) {
      throw new AppError('Proyecto no encontrado', 404);
    }

    if (proyecto.imagen_public_id) {
      await cloudinary.uploader.destroy(proyecto.imagen_public_id);
    }

    await proyectoRepository.eliminar(proyecto_id);

    return { message: 'Proyecto eliminado correctamente' };
  },

  async actualizarImagen(proyecto_id: number, file: Express.Multer.File) {
    const proyecto = await proyectoRepository.obtenerPorId(proyecto_id);

    if (!proyecto) {
      throw new AppError('Proyecto no encontrado', 404);
    }

    if (proyecto.imagen_public_id) {
      await cloudinary.uploader.destroy(proyecto.imagen_public_id);
    }

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'portafolio/proyectos' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as { secure_url: string; public_id: string });
        }
      );
      uploadStream.end(file.buffer);
    });

    await proyectoRepository.actualizar(proyecto_id, {
      imagen_url: result.secure_url,
      imagen_public_id: result.public_id,
    });

    return {
      message: 'Imagen del proyecto actualizada correctamente',
      imagen_url: result.secure_url,
    };
  },

  async eliminarImagen(proyecto_id: number) {
    const proyecto = await proyectoRepository.obtenerPorId(proyecto_id);

    if (!proyecto) {
      throw new AppError('Proyecto no encontrado', 404);
    }

    if (proyecto.imagen_public_id) {
      await cloudinary.uploader.destroy(proyecto.imagen_public_id);
    }

    await proyectoRepository.actualizar(proyecto_id, {
      imagen_url: null,
      imagen_public_id: null,
    });

    return { message: 'Imagen del proyecto eliminada correctamente' };
  },
};
