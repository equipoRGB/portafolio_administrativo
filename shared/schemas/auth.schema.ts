import { z } from 'zod';

export const loginSchema = z.object({
  nombre_usuario: z.string().min(1, 'El nombre de usuario es requerido'),
  contrasena: z.string().min(1, 'La contraseña es requerida'),
});

export const actualizarUsuarioSchema = z.object({
  nombre_usuario: z.string().min(1, 'El nombre de usuario es requerido').optional(),
  contrasena: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ActualizarUsuarioInput = z.infer<typeof actualizarUsuarioSchema>;
