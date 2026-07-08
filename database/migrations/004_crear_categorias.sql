-- Migración 004: Crear tabla de categorías
-- Descripción: Tabla para almacenar las categorías de herramientas (Backend, Frontend, Complementarias)

CREATE TABLE IF NOT EXISTS categorias (
    categoria_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar categorías predeterminadas
INSERT INTO categorias (nombre, descripcion) VALUES
    ('Backend', 'Tecnologías del lado del servidor'),
    ('Frontend', 'Tecnologías del lado del cliente'),
    ('Herramientas complementarias', 'Herramientas de desarrollo y productividad');
