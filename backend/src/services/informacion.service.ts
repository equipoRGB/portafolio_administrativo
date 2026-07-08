import { informacionRepository } from '../repositories/informacion.repository.js';
import { cloudinary } from '../config/cloudinary.js';
import { AppError } from '../middlewares/errorHandler.js';

export const informacionService = {
  async obtener() {
    let informacion = await informacionRepository.obtener();
    if (!informacion) {
      informacion = await informacionRepository.crear();
    }
    return informacion;
  },

  async actualizar(datos: Record<string, unknown>) {
    const informacion = await this.obtener();
    await informacionRepository.actualizar(informacion.informacion_id, datos);
    return { message: 'Información actualizada correctamente' };
  },

  async actualizarFotografia(file: Express.Multer.File) {
    const informacion = await this.obtener();

    if (informacion.fotografia_public_id) {
      await cloudinary.uploader.destroy(informacion.fotografia_public_id);
    }

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'portafolio/fotografia' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as { secure_url: string; public_id: string });
        }
      );
      uploadStream.end(file.buffer);
    });

    await informacionRepository.actualizarFotografia(
      informacion.informacion_id,
      result.secure_url,
      result.public_id
    );

    return {
      message: 'Fotografía actualizada correctamente',
      fotografia_url: result.secure_url,
    };
  },

  async eliminarFotografia() {
    const informacion = await this.obtener();

    if (informacion.fotografia_public_id) {
      await cloudinary.uploader.destroy(informacion.fotografia_public_id);
    }

    await informacionRepository.eliminarFotografia(informacion.informacion_id);

    return { message: 'Fotografía eliminada correctamente' };
  },
};
