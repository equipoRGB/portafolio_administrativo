import { pool } from '../config/database.js';

export interface Usuario {
  usuario_id: number;
  nombre_usuario: string;
  contrasena: string;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export const authRepository = {
  async buscarPorNombreUsuario(nombre_usuario: string): Promise<Usuario | null> {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE nombre_usuario = $1',
      [nombre_usuario]
    );
    return result.rows[0] || null;
  },

  async buscarPorId(usuario_id: number): Promise<Usuario | null> {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE usuario_id = $1',
      [usuario_id]
    );
    return result.rows[0] || null;
  },

  async actualizarContrasena(usuario_id: number, contrasena: string): Promise<void> {
    await pool.query(
      'UPDATE usuarios SET contrasena = $1, fecha_actualizacion = CURRENT_TIMESTAMP WHERE usuario_id = $2',
      [contrasena, usuario_id]
    );
  },

  async actualizarNombreUsuario(usuario_id: number, nombre_usuario: string): Promise<void> {
    await pool.query(
      'UPDATE usuarios SET nombre_usuario = $1, fecha_actualizacion = CURRENT_TIMESTAMP WHERE usuario_id = $2',
      [nombre_usuario, usuario_id]
    );
  },
};
