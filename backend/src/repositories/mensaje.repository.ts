import { pool } from '../config/database.js';
import type { Mensaje } from '../types/index.js';

export const mensajeRepository = {
  async obtenerTodos(): Promise<Mensaje[]> {
    const result = await pool.query(
      'SELECT * FROM mensajes ORDER BY fecha_creacion DESC'
    );
    return result.rows;
  },

  async obtenerPorId(mensaje_id: number): Promise<Mensaje | null> {
    const result = await pool.query(
      'SELECT * FROM mensajes WHERE mensaje_id = $1',
      [mensaje_id]
    );
    return result.rows[0] || null;
  },

  async crear(datos: Omit<Mensaje, 'mensaje_id' | 'leido' | 'fecha_creacion' | 'fecha_actualizacion'>): Promise<Mensaje> {
    const result = await pool.query(
      `INSERT INTO mensajes (nombre, correo_electronico, telefono, asunto, mensaje)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [datos.nombre, datos.correo_electronico, datos.telefono, datos.asunto, datos.mensaje]
    );
    return result.rows[0];
  },

  async actualizarEstado(mensaje_id: number, leido: boolean): Promise<void> {
    await pool.query(
      'UPDATE mensajes SET leido = $1, fecha_actualizacion = CURRENT_TIMESTAMP WHERE mensaje_id = $2',
      [leido, mensaje_id]
    );
  },

  async eliminar(mensaje_id: number): Promise<void> {
    await pool.query('DELETE FROM mensajes WHERE mensaje_id = $1', [mensaje_id]);
  },
};
