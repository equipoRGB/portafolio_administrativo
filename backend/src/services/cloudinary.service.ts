import { cloudinary } from '../config/cloudinary.js';

export async function subirImagen(
  filePath: string,
  folder?: string
): Promise<{ publicId: string; url: string }> {
  const opciones = folder ? { folder } : undefined;

  const resultado = await cloudinary.uploader.upload(filePath, opciones);

  return {
    publicId: resultado.public_id,
    url: resultado.secure_url,
  };
}

export async function eliminarImagen(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
