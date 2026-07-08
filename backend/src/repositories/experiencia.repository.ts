import { pool } from '../config/database.js';
import type { Experiencia } from '../types/index.js';

export const experienciaRepository = {
  async obtenerTodas(): Promise<Experiencia[]> {
    const result = await pool.query(
      'SELECT * FROM experiencias ORDER BY orden ASC, fecha_inicio DESC'
    );
    return result.rows;
  },

  async obtenerPorId(experiencia_id: number): Promise<Experiencia | null> {
    const result = await pool.query(
      'SELECT * FROM experiencias WHERE experiencia_id = $1',
      [experiencia_id]
    );
    return result.rows[0] || null;
  },

  async crear(datos: Omit<Experiencia, 'experiencia_id' | 'fecha_creacion' | 'fecha_actualizacion'>): Promise<Experiencia> {
    const result = await pool.query(
      `INSERT INTO experiencias (titulo, cargo, descripcion, fecha_inicio, fecha_fin, empresa, ubicacion, orden)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [datos.titulo, datos.cargo, datos.descripcion, datos.fecha_inicio, datos.fecha_fin, datos.empresa, datos.ubicacion, datos.orden]
    );
    return result.rows[0];
  },

  async actualizar(
    experiencia_id: number,
    datos: Partial<Omit<Experiencia, 'experiencia_id' | 'fecha_creacion' | 'fecha_actualizacion'>>
  ): Promise<void> {
    const campos = Object.keys(datos);
    const valores = Object.values(datos);

    if (campos.length === 0) return;

    const setClause = campos
      .map((campo, index) => `${campo} = $${index + 1}`)
      .join(', ');

    await pool.query(
      `UPDATE experiencias 
       SET ${setClause}, fecha_actualizacion = CURRENT_TIMESTAMP 
       WHERE experiencia_id = $${campos.length + 1}`,
      [...valores, experiencia_id]
    );
  },

  async eliminar(experiencia_id: number): Promise<void> {
    await pool.query('DELETE FROM experiencias WHERE experiencia_id = $1', [experiencia_id]);
  },
};
