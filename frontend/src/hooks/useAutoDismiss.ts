import { useState, useEffect, useCallback } from 'react';

interface Mensaje {
  tipo: 'exito' | 'error';
  texto: string;
}

export function useAutoDismiss(duracionMs = 3000) {
  const [mensaje, setMensaje] = useState<Mensaje | null>(null);

  useEffect(() => {
    if (!mensaje) return;

    const timer = setTimeout(() => {
      setMensaje(null);
    }, duracionMs);

    return () => clearTimeout(timer);
  }, [mensaje, duracionMs]);

  const mostrarMensaje = useCallback((tipo: 'exito' | 'error', texto: string) => {
    setMensaje({ tipo, texto });
  }, []);

  const limpiarMensaje = useCallback(() => {
    setMensaje(null);
  }, []);

  return { mensaje, mostrarMensaje, limpiarMensaje };
}
