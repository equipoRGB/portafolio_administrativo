import { z } from 'zod';

const trimToNull = z.string().nullable().transform((val) => {
  if (val === null) return null;
  const trimmed = val.trim();
  return trimmed === '' ? null : trimmed;
});

export const crearExperienciaSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido'),
  cargo: trimToNull.optional(),
  descripcion: z.string().min(1, 'La descripción es requerida'),
  fecha_inicio: z.string().optional(),
  fecha_fin: trimToNull.optional(),
  empresa: trimToNull.optional(),
  ubicacion: trimToNull.optional(),
  orden: z.number().int().min(0).optional().nullable(),
});

export const actualizarExperienciaSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido').optional(),
  cargo: trimToNull.optional(),
  descripcion: trimToNull.optional(),
  fecha_inicio: z.string().optional(),
  fecha_fin: trimToNull.optional(),
  empresa: trimToNull.optional(),
  ubicacion: trimToNull.optional(),
  orden: z.number().int().min(0).optional().nullable(),
});

export type CrearExperienciaInput = z.infer<typeof crearExperienciaSchema>;
export type ActualizarExperienciaInput = z.infer<typeof actualizarExperienciaSchema>;
