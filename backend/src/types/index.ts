export interface Usuario {
  usuario_id: number;
  nombre_usuario: string;
  contrasena: string;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export interface InformacionGeneral {
  informacion_id: number;
  nombre: string;
  profesion: string;
  descripcion: string | null;
  fotografia_url: string | null;
  fotografia_public_id: string | null;
  curriculum_url: string | null;
  correo_electronico: string | null;
  telefono: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export interface Experiencia {
  experiencia_id: number;
  titulo: string;
  cargo: string;
  descripcion: string | null;
  fecha_inicio: Date;
  fecha_fin: Date | null;
  empresa: string | null;
  ubicacion: string | null;
  orden: number;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export interface Categoria {
  categoria_id: number;
  nombre: string;
  descripcion: string | null;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export interface Herramienta {
  herramienta_id: number;
  nombre: string;
  descripcion: string | null;
  icono: string | null;
  categoria_id: number;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export interface Proyecto {
  proyecto_id: number;
  nombre: string;
  descripcion: string | null;
  tecnologias: string | null;
  enlace_proyecto: string | null;
  enlace_repositorio: string | null;
  imagen_url: string | null;
  imagen_public_id: string | null;
  publicado: boolean;
  orden: number;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export interface Mensaje {
  mensaje_id: number;
  nombre: string;
  correo_electronico: string | null;
  telefono: string | null;
  asunto: string | null;
  mensaje: string;
  leido: boolean;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}
