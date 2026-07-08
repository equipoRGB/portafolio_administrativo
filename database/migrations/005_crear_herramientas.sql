-- Migración 005: Crear tabla de herramientas
-- Descripción: Tabla para almacenar las tecnologías y herramientas del desarrollador

CREATE TABLE IF NOT EXISTS herramientas (
    herramienta_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(100),
    categoria_id INTEGER NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(categoria_id) ON DELETE CASCADE
);

-- Crear índice para agrupar herramientas por categoría
CREATE INDEX idx_herramientas_categoria ON herramientas(categoria_id);
