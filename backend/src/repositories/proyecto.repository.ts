import { pool } from '../config/database.js';
import type { Proyecto } from '../types/index.js';

export const proyectoRepository = {
  async obtenerTodos(): Promise<Proyecto[]> {
    const result = await pool.query(
      'SELECT * FROM proyectos ORDER BY orden ASC, fecha_creacion DESC'
    );
    return result.rows;
  },

  async obtenerPublicados(): Promise<Proyecto[]> {
    const result = await pool.query(
      'SELECT * FROM proyectos WHERE publicado = true ORDER BY orden ASC, fecha_creacion DESC'
    );
    return result.rows;
  },

  async obtenerPorId(proyecto_id: number): Promise<Proyecto | null> {
    const result = await pool.query(
      'SELECT * FROM proyectos WHERE proyecto_id = $1',
      [proyecto_id]
    );
    return result.rows[0] || null;
  },

  async crear(datos: Omit<Proyecto, 'proyecto_id' | 'fecha_creacion' | 'fecha_actualizacion'>): Promise<Proyecto> {
    const result = await pool.query(
      `INSERT INTO proyectos (nombre, descripcion, tecnologias, enlace_proyecto, enlace_repositorio, imagen_url, imagen_public_id, publicado, orden)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        datos.nombre,
        datos.descripcion,
        datos.tecnologias,
        datos.enlace_proyecto,
        datos.enlace_repositorio,
        datos.imagen_url,
        datos.imagen_public_id,
        datos.publicado,
        datos.orden,
      ]
    );
    return result.rows[0];
  },

  async actualizar(
    proyecto_id: number,
    datos: Partial<Omit<Proyecto, 'proyecto_id' | 'fecha_creacion' | 'fecha_actualizacion'>>
  ): Promise<void> {
    const campos = Object.keys(datos);
    const valores = Object.values(datos);

    if (campos.length === 0) return;

    const setClause = campos
      .map((campo, index) => `${campo} = $${index + 1}`)
      .join(', ');

    await pool.query(
      `UPDATE proyectos 
       SET ${setClause}, fecha_actualizacion = CURRENT_TIMESTAMP 
       WHERE proyecto_id = $${campos.length + 1}`,
      [...valores, proyecto_id]
    );
  },

  async eliminar(proyecto_id: number): Promise<void> {
    await pool.query('DELETE FROM proyectos WHERE proyecto_id = $1', [proyecto_id]);
  },
};
