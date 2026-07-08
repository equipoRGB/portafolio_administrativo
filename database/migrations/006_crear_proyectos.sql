-- Migración 006: Crear tabla de proyectos
-- Descripción: Tabla para almacenar los proyectos del portafolio

CREATE TABLE IF NOT EXISTS proyectos (
    proyecto_id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tecnologias TEXT,
    enlace_proyecto VARCHAR(500),
    enlace_repositorio VARCHAR(500),
    imagen_url VARCHAR(500),
    imagen_public_id VARCHAR(255),
    publicado BOOLEAN DEFAULT false,
    orden INTEGER DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índice para filtrar proyectos publicados
CREATE INDEX idx_proyectos_publicado ON proyectos(publicado);

-- Crear índice para ordenar proyectos
CREATE INDEX idx_proyectos_orden ON proyectos(orden);
