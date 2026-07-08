-- Migración 002: Crear tabla de información general
-- Descripción: Tabla para almacenar la información principal del portafolio

CREATE TABLE IF NOT EXISTS informacion_general (
    informacion_id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    profesion VARCHAR(200) NOT NULL,
    descripcion TEXT,
    fotografia_url VARCHAR(500),
    fotografia_public_id VARCHAR(255),
    curriculum_url VARCHAR(500),
    correo_electronico VARCHAR(255),
    telefono VARCHAR(50),
    github_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    twitter_url VARCHAR(500),
    instagram_url VARCHAR(500),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar registro inicial vacío
INSERT INTO informacion_general (nombre, profesion)
VALUES ('', '');
