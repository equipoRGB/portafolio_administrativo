const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ErrorCampo {
  campo: string;
  mensaje: string;
}

export class ApiError extends Error {
  public readonly errores?: ErrorCampo[];

  constructor(message: string, errores?: ErrorCampo[]) {
    super(message);
    this.errores = errores;
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string;
}

async function clienteApi<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.message || 'Error en la solicitud', data.errores);
  }

  return data;
}

export async function clienteApiConAuth<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem('token') || undefined;
  return clienteApi<T>(endpoint, { ...options, token });
}

export async function clienteApiPublico<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  return clienteApi<T>(endpoint, options);
}

export async function clienteApiFormData<T>(endpoint: string, formData: FormData, token?: string): Promise<T> {
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error en la solicitud');
  }

  return data;
}

export async function clienteApiFormDataPut<T>(endpoint: string, formData: FormData, token?: string): Promise<T> {
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers,
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error en la solicitud');
  }

  return data;
}
