import { pool } from '../../backend/src/config/database.js';
import bcrypt from 'bcryptjs';

async function seed() {
  const nombreUsuario = 'admin';
  const contrasenaPlain = 'admin123';

  const hash = await bcrypt.hash(contrasenaPlain, 10);

  const result = await pool.query(
    `INSERT INTO usuarios (nombre_usuario, contrasena)
     VALUES ($1, $2)
     ON CONFLICT (nombre_usuario) DO NOTHING
     RETURNING usuario_id, nombre_usuario`,
    [nombreUsuario, hash]
  );

  if (result.rows.length > 0) {
    console.log(`Usuario creado: ${nombreUsuario} / ${contrasenaPlain}`);
  } else {
    console.log(`Usuario "${nombreUsuario}" ya existe`);
  }

  await pool.end();
}

seed().catch((err) => {
  console.error('Error al ejecutar seed:', err);
  process.exit(1);
});
