-- Migración 001: Crear tabla de usuarios
-- Descripción: Tabla para almacenar las credenciales del administrador del sistema

CREATE TABLE IF NOT EXISTS usuarios (
    usuario_id SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario administrador por defecto
-- Contraseña: admin123 (debe ser hasheada con bcrypt en el backend)
-- INSERT INTO usuarios (nombre_usuario, contrasena) VALUES ('admin', 'hashed_password_here');
