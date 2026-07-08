-- Migración 003: Crear tabla de experiencias
-- Descripción: Tabla para almacenar la experiencia profesional del desarrollador

CREATE TABLE IF NOT EXISTS experiencias (
    experiencia_id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    cargo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    empresa VARCHAR(200),
    ubicacion VARCHAR(200),
    orden INTEGER DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índice para ordenar experiencias
CREATE INDEX idx_experiencias_orden ON experiencias(orden);
