import { pool } from '../config/database.js';
import type { InformacionGeneral } from '../types/index.js';

export const informacionRepository = {
  async obtener(): Promise<InformacionGeneral | null> {
    const result = await pool.query('SELECT * FROM informacion_general LIMIT 1');
    return result.rows[0] || null;
  },

  async crear(): Promise<InformacionGeneral> {
    const result = await pool.query(
      `INSERT INTO informacion_general (nombre, profesion) VALUES ('', '') RETURNING *`
    );
    return result.rows[0];
  },

  async actualizar(
    informacion_id: number,
    datos: Partial<Omit<InformacionGeneral, 'informacion_id' | 'fecha_creacion' | 'fecha_actualizacion'>>
  ): Promise<void> {
    const campos = Object.keys(datos);
    const valores = Object.values(datos);

    if (campos.length === 0) return;

    const setClause = campos
      .map((campo, index) => `${campo} = $${index + 1}`)
      .join(', ');

    await pool.query(
      `UPDATE informacion_general 
       SET ${setClause}, fecha_actualizacion = CURRENT_TIMESTAMP 
       WHERE informacion_id = $${campos.length + 1}`,
      [...valores, informacion_id]
    );
  },

  async actualizarFotografia(
    informacion_id: number,
    fotografia_url: string,
    fotografia_public_id: string
  ): Promise<void> {
    await pool.query(
      `UPDATE informacion_general 
       SET fotografia_url = $1, fotografia_public_id = $2, fecha_actualizacion = CURRENT_TIMESTAMP 
       WHERE informacion_id = $3`,
      [fotografia_url, fotografia_public_id, informacion_id]
    );
  },

  async eliminarFotografia(informacion_id: number): Promise<void> {
    await pool.query(
      `UPDATE informacion_general 
       SET fotografia_url = NULL, fotografia_public_id = NULL, fecha_actualizacion = CURRENT_TIMESTAMP 
       WHERE informacion_id = $1`,
      [informacion_id]
    );
  },
};
