import { pool } from '../config/database.js';
import type { Categoria, Herramienta } from '../types/index.js';

export const herramientaRepository = {
  async obtenerCategorias(): Promise<Categoria[]> {
    const result = await pool.query('SELECT * FROM categorias ORDER BY categoria_id');
    return result.rows;
  },

  async obtenerCategoriaPorId(categoria_id: number): Promise<Categoria | null> {
    const result = await pool.query(
      'SELECT * FROM categorias WHERE categoria_id = $1',
      [categoria_id]
    );
    return result.rows[0] || null;
  },

  async crearCategoria(datos: Omit<Categoria, 'categoria_id' | 'fecha_creacion' | 'fecha_actualizacion'>): Promise<Categoria> {
    const result = await pool.query(
      'INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING *',
      [datos.nombre, datos.descripcion]
    );
    return result.rows[0];
  },

  async actualizarCategoria(
    categoria_id: number,
    datos: Partial<Omit<Categoria, 'categoria_id' | 'fecha_creacion' | 'fecha_actualizacion'>>
  ): Promise<void> {
    const campos = Object.keys(datos);
    const valores = Object.values(datos);

    if (campos.length === 0) return;

    const setClause = campos
      .map((campo, index) => `${campo} = $${index + 1}`)
      .join(', ');

    await pool.query(
      `UPDATE categorias 
       SET ${setClause}, fecha_actualizacion = CURRENT_TIMESTAMP 
       WHERE categoria_id = $${campos.length + 1}`,
      [...valores, categoria_id]
    );
  },

  async eliminarCategoria(categoria_id: number): Promise<void> {
    await pool.query('DELETE FROM categorias WHERE categoria_id = $1', [categoria_id]);
  },

  async obtenerHerramientas(): Promise<(Herramienta & { categoria_nombre: string })[]> {
    const result = await pool.query(
      `SELECT h.*, c.nombre as categoria_nombre 
       FROM herramientas h 
       JOIN categorias c ON h.categoria_id = c.categoria_id 
       ORDER BY c.categoria_id, h.nombre`
    );
    return result.rows;
  },

  async obtenerHerramientaPorId(herramienta_id: number): Promise<Herramienta | null> {
    const result = await pool.query(
      'SELECT * FROM herramientas WHERE herramienta_id = $1',
      [herramienta_id]
    );
    return result.rows[0] || null;
  },

  async crearHerramienta(datos: Omit<Herramienta, 'herramienta_id' | 'fecha_creacion' | 'fecha_actualizacion'>): Promise<Herramienta> {
    const result = await pool.query(
      'INSERT INTO herramientas (nombre, descripcion, icono, categoria_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [datos.nombre, datos.descripcion, datos.icono, datos.categoria_id]
    );
    return result.rows[0];
  },

  async actualizarHerramienta(
    herramienta_id: number,
    datos: Partial<Omit<Herramienta, 'herramienta_id' | 'fecha_creacion' | 'fecha_actualizacion'>>
  ): Promise<void> {
    const campos = Object.keys(datos);
    const valores = Object.values(datos);

    if (campos.length === 0) return;

    const setClause = campos
      .map((campo, index) => `${campo} = $${index + 1}`)
      .join(', ');

    await pool.query(
      `UPDATE herramientas 
       SET ${setClause}, fecha_actualizacion = CURRENT_TIMESTAMP 
       WHERE herramienta_id = $${campos.length + 1}`,
      [...valores, herramienta_id]
    );
  },

  async eliminarHerramienta(herramienta_id: number): Promise<void> {
    await pool.query('DELETE FROM herramientas WHERE herramienta_id = $1', [herramienta_id]);
  },
};
