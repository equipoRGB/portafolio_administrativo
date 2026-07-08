import { z } from 'zod';

export const crearCategoriaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
});

export const actualizarCategoriaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').optional(),
  descripcion: z.string().optional(),
});

export const crearHerramientaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
  icono: z.string().optional(),
  categoria_id: z.number().int().positive('La categoría es requerida'),
});

export const actualizarHerramientaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').optional(),
  descripcion: z.string().optional(),
  icono: z.string().optional(),
  categoria_id: z.number().int().positive('La categoría es requerida').optional(),
});

export type CrearCategoriaInput = z.infer<typeof crearCategoriaSchema>;
export type ActualizarCategoriaInput = z.infer<typeof actualizarCategoriaSchema>;
export type CrearHerramientaInput = z.infer<typeof crearHerramientaSchema>;
export type ActualizarHerramientaInput = z.infer<typeof actualizarHerramientaSchema>;
