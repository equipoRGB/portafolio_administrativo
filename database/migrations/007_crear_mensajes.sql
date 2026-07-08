-- Migración 007: Crear tabla de mensajes
-- Descripción: Tabla para almacenar los mensajes enviados desde el formulario de contacto

CREATE TABLE IF NOT EXISTS mensajes (
    mensaje_id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    correo_electronico VARCHAR(255),
    telefono VARCHAR(50),
    asunto VARCHAR(200),
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT false,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_medio_contacto CHECK (correo_electronico IS NOT NULL OR telefono IS NOT NULL)
);

-- Crear índice para filtrar mensajes no leídos
CREATE INDEX idx_mensajes_leido ON mensajes(leido);

-- Crear índice para ordenar por fecha
CREATE INDEX idx_mensajes_fecha ON mensajes(fecha_creacion DESC);
