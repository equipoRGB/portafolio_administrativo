import { clienteApiPublico, clienteApiConAuth, clienteApiFormDataPut } from '../lib/api';
import type { ApiResponse, LoginResponse, Usuario, InformacionGeneral, Experiencia, Categoria, Herramienta, Proyecto, Mensaje } from '../types';

export const authService = {
  async login(nombre_usuario: string, contrasena: string): Promise<ApiResponse<LoginResponse>> {
    return clienteApiPublico<ApiResponse<LoginResponse>>('/auth/login', {
      method: 'POST',
      body: { nombre_usuario, contrasena },
    });
  },

  async obtenerUsuario(): Promise<ApiResponse<Usuario>> {
    return clienteApiConAuth<ApiResponse<Usuario>>('/auth/usuario');
  },

  async cambiarNombreUsuario(nombre_usuario: string): Promise<{ message: string }> {
    return clienteApiConAuth<{ message: string }>('/auth/usuario', {
      method: 'PUT',
      body: { nombre_usuario },
    });
  },

  async cambiarContrasena(contrasenaActual: string, nuevaContrasena: string): Promise<{ message: string }> {
    return clienteApiConAuth<{ message: string }>('/auth/contrasena', {
      method: 'PUT',
      body: { contrasenaActual, nuevaContrasena },
    });
  },
};

export const informacionService = {
  async obtener(): Promise<ApiResponse<InformacionGeneral | null>> {
    return clienteApiPublico<ApiResponse<InformacionGeneral | null>>('/informacion');
  },

  async actualizar(datos: Partial<InformacionGeneral>): Promise<{ message: string }> {
    return clienteApiConAuth<{ message: string }>('/informacion', {
      method: 'PUT',
      body: datos,
    });
  },

  async actualizarFotografia(archivo: File): Promise<{ message: string; fotografia_url: string }> {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('fotografia', archivo);
    return clienteApiFormDataPut<{ message: string; fotografia_url: string }>('/informacion/fotografia', formData, token || undefined);
  },

  async eliminarFotografia(): Promise<{ message: string }> {
    return clienteApiConAuth<{ message: string }>('/informacion/fotografia', {
      method: 'DELETE',
    });
  },
};

export const experienciaService = {
  async obtenerTodas(): Promise<ApiResponse<Experiencia[]>> {
    return clienteApiPublico<ApiResponse<Experiencia[]>>('/experiencias');
  },

  async obtenerPorId(id: number): Promise<ApiResponse<Experiencia>> {
    return clienteApiConAuth<ApiResponse<Experiencia>>(`/experiencias/${id}`);
  },

  async crear(datos: Omit<Experiencia, 'experiencia_id'>): Promise<ApiResponse<Experiencia>> {
    return clienteApiConAuth<ApiResponse<Experiencia>>('/experiencias', {
      method: 'POST',
      body: datos,
    });
  },

  async actualizar(id: number, datos: Partial<Experiencia>): Promise<{ message: string }> {
    return clienteApiConAuth<{ message: string }>(`/experiencias/${id}`, {
      method: 'PUT',
      body: datos,
    });
  },

  async eliminar(id: number): Promise<{ message: string }> {
    return clienteApiConAuth<{ message: string }>(`/experiencias/${id}`, {
      method: 'DELETE',
    });
  },
};

export const herramientaService = {
  async obtenerCategorias(): Promise<ApiResponse<Categoria[]>> {
    return clienteApiPublico<ApiResponse<Categoria[]>>('/herramientas/categorias');
  },

  async crearCategoria(datos: Omit<Categoria, 'categoria_id'>): Promise<ApiResponse<Categoria>> {
    return clienteApiConAuth<ApiResponse<Categoria>>('/herramientas/categorias', {
      method: 'POST',
      body: datos,
    });
  },

  async actualizarCategoria(id: number, datos: Partial<Categoria>): Promise<{ message: string }> {
    return clienteApiConAuth<{ message: string }>(`/herramientas/categorias/${id}`, {
      method: 'PUT',
      body: datos,
    });
  },

  async eliminarCategoria(id: number): Promise<{ message: string }> {
    return clienteApiConAuth<{ message: string }>(`/herramientas/categorias/${id}`, {
      method: 'DELETE',
    });
  },

  async obtenerTodas(): Promise<ApiResponse<Herramienta[]>> {
    return clienteApiPublico<ApiResponse<Herramienta[]>>('/herramientas');
  },

  async crear(datos: Omit<Herramienta, 'herramienta_id'>): Promise<ApiResponse<Herramienta>> {
    return clienteApiConAuth<ApiResponse<Herramienta>>('/herramientas', {
      method: 'POST',
      body: datos,
    });
  },

  async actualizar(id: number, datos: Partial<Herramienta>): Promise<{ message: string }> {
    return clienteApiConAuth<{ message: string }>(`/herramientas/${id}`, {
      method: 'PUT',
      body: datos,
    });
  },

  async eliminar(id: number): Promise<{ message: string }> {
    return clienteApiConAuth<{ message: string }>(`/herramientas/${id}`, {
      method: 'DELETE',
    });
  },
};

export const proyectoService = {
  async obtenerPublicados(): Promise<ApiResponse<Proyecto[]>> {
    return clienteApiPublico<ApiResponse<Proyecto[]>>('/proyectos/publicados');
  },

  async obtenerTodos(): Promise<ApiResponse<Proyecto[]>> {
    return clienteApiConAuth<ApiResponse<Proyecto[]>>('/proyectos');
  },

  async obtenerPorId(id: number): Promise<ApiResponse<Proyecto>> {
    return clienteApiConAuth<ApiResponse<Proyecto>>(`/proyectos/${id}`);
  },

  async crear(datos: Omit<Proyecto, 'proyecto_id' | 'imagen_url' | 'imagen_public_id'>): Promise<ApiResponse<Proyecto>> {
    return clienteApiConAuth<ApiResponse<Proyecto>>('/proyectos', {
      method: 'POST',
      body: datos,
    });
  },

  async actualizar(id: number, datos: Partial<Proyecto>): Promise<{ message: string }> {
    return clienteApiConAuth<{ message: string }>(`/proyectos/${id}`, {
      method: 'PUT',
      body: datos,
    });
  },

  async eliminar(id: number): Promise<{ message: string }> {
    return clienteApiConAuth<{ message: string }>(`/proyectos/${id}`, {
      method: 'DELETE',
    });
  },

  async actualizarImagen(id: number, archivo: File): Promise<{ message: string; imagen_url: string }> {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('imagen', archivo);
    return clienteApiFormDataPut<{ message: string; imagen_url: string }>(`/proyectos/${id}/imagen`, formData, token || undefined);
  },

  async eliminarImagen(id: number): Promise<{ message: string }> {
    return clienteApiConAuth<{ message: string }>(`/proyectos/${id}/imagen`, {
      method: 'DELETE',
    });
  },
};

export const mensajeService = {
  async crear(datos: { nombre: string; correo_electronico?: string; telefono?: string; asunto?: string; mensaje: string }): Promise<ApiResponse<Mensaje>> {
    return clienteApiPublico<ApiResponse<Mensaje>>('/mensajes', {
      method: 'POST',
      body: datos,
    });
  },

  async obtenerTodos(): Promise<ApiResponse<Mensaje[]>> {
    return clienteApiConAuth<ApiResponse<Mensaje[]>>('/mensajes');
  },

  async obtenerPorId(id: number): Promise<ApiResponse<Mensaje>> {
    return clienteApiConAuth<ApiResponse<Mensaje>>(`/mensajes/${id}`);
  },

  async actualizarEstado(id: number, leido: boolean): Promise<{ message: string }> {
    return clienteApiConAuth<{ message: string }>(`/mensajes/${id}/estado`, {
      method: 'PUT',
      body: { leido },
    });
  },

  async eliminar(id: number): Promise<{ message: string }> {
    return clienteApiConAuth<{ message: string }>(`/mensajes/${id}`, {
      method: 'DELETE',
    });
  },
};
