import { z } from 'zod';

const trimToNull = z.string().nullable().transform((val) => {
  if (val === null) return null;
  const trimmed = val.trim();
  return trimmed === '' ? null : trimmed;
});

const urlOrNull = trimToNull.transform((val) => {
  if (val === null) return null;
  if (/^https?:\/\//.test(val)) return val;
  return `https://${val}`;
}).refine(
  (val) => val === null || /^https?:\/\/.+/.test(val),
  { message: 'URL inválida' }
);

export const crearProyectoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
  tecnologias: z.string().optional(),
  enlace_proyecto: urlOrNull.optional().nullable(),
  enlace_repositorio: urlOrNull.optional().nullable(),
  publicado: z.boolean().optional(),
  orden: z.number().int().min(0).optional().nullable(),
});

export const actualizarProyectoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').optional(),
  descripcion: z.string().optional(),
  tecnologias: z.string().optional(),
  enlace_proyecto: urlOrNull.optional().nullable(),
  enlace_repositorio: urlOrNull.optional().nullable(),
  publicado: z.boolean().optional(),
  orden: z.number().int().min(0).optional().nullable(),
});

export type CrearProyectoInput = z.infer<typeof crearProyectoSchema>;
export type ActualizarProyectoInput = z.infer<typeof actualizarProyectoSchema>;
