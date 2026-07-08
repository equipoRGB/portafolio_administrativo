import { z } from 'zod';

export const crearMensajeSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  correo_electronico: z.string().email('Correo electrónico inválido').optional().nullable().or(z.literal('')),
  telefono: z.string().optional().nullable().or(z.literal('')),
  asunto: z.string().optional(),
  mensaje: z.string().min(1, 'El mensaje es requerido'),
}).refine(
  (data) => {
    const correo = data.correo_electronico && data.correo_electronico.trim() !== '';
    const telefono = data.telefono && data.telefono.trim() !== '';
    return correo || telefono;
  },
  {
    message: 'Debe proporcionar al menos un medio de contacto (correo electrónico o teléfono)',
    path: ['correo_electronico'],
  }
);

export const actualizarEstadoMensajeSchema = z.object({
  leido: z.boolean(),
});

export type CrearMensajeInput = z.infer<typeof crearMensajeSchema>;
export type ActualizarEstadoMensajeInput = z.infer<typeof actualizarEstadoMensajeSchema>;
