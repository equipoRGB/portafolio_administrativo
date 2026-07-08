/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

import type { Usuario } from '../types';
import { authService } from '../services/api';

interface AuthContextType {
  usuario: Usuario | null;
  estaAutenticado: boolean;
  cargando: boolean;
  login: (nombre_usuario: string, contrasena: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function ProveedorAuth({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(() => !!localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    let cancelado = false;
    authService.obtenerUsuario()
      .then((response) => {
        if (!cancelado) setUsuario(response.data);
      })
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => { cancelado = true; };
  }, []);

  const login = async (nombre_usuario: string, contrasena: string) => {
    const response = await authService.login(nombre_usuario, contrasena);
    localStorage.setItem('token', response.data.token);
    setUsuario(response.data.usuario);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, estaAutenticado: !!usuario, cargando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de ProveedorAuth');
  }
  return context;
}
