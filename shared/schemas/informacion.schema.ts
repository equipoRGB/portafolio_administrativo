import { z } from 'zod';

const trimToNull = z.string().nullable().transform((val) => {
  if (val === null) return null;
  const trimmed = val.trim();
  return trimmed === '' ? null : trimmed;
});

const urlOrNull = trimToNull.refine(
  (val) => val === null || /^https?:\/\/.+/.test(val),
  { message: 'URL inválida' }
);

const emailOrNull = trimToNull.refine(
  (val) => val === null || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
  { message: 'Correo electrónico inválido' }
);

export const actualizarInformacionSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').optional(),
  profesion: z.string().min(1, 'La profesión es requerida').optional(),
  descripcion: z.string().optional(),
  correo_electronico: emailOrNull.optional().nullable(),
  telefono: trimToNull.optional().nullable(),
  github_url: urlOrNull.optional().nullable(),
  linkedin_url: urlOrNull.optional().nullable(),
  twitter_url: urlOrNull.optional().nullable(),
  instagram_url: urlOrNull.optional().nullable(),
  curriculum_url: urlOrNull.optional().nullable(),
});

export type ActualizarInformacionInput = z.infer<typeof actualizarInformacionSchema>;
