export interface Usuario {
  usuario_id: number;
  nombre_usuario: string;
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
}

export interface Experiencia {
  experiencia_id: number;
  titulo: string;
  cargo: string;
  descripcion: string | null;
  fecha_inicio: string;
  fecha_fin: string | null;
  empresa: string | null;
  ubicacion: string | null;
  orden: number;
}

export interface Categoria {
  categoria_id: number;
  nombre: string;
  descripcion: string | null;
}

export interface Herramienta {
  herramienta_id: number;
  nombre: string;
  descripcion: string | null;
  icono: string | null;
  categoria_id: number;
  categoria_nombre?: string;
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
}

export interface Mensaje {
  mensaje_id: number;
  nombre: string;
  correo_electronico: string | null;
  telefono: string | null;
  asunto: string | null;
  mensaje: string;
  leido: boolean;
  fecha_creacion: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}
