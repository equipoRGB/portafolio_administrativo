import { useState, useEffect } from 'react';
import { Trash2, Eye, EyeOff } from 'lucide-react';

import { useTema } from '../../context/ThemeContext';
import { mensajeService } from '../../services/api';
import type { Mensaje } from '../../types';

export function PaginaMensajes() {
  const { tema } = useTema();
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [seleccionado, setSeleccionado] = useState<Mensaje | null>(null);

  const cargarMensajes = async () => {
    const res = await mensajeService.obtenerTodos();
    setMensajes(res.data);
  };

  useEffect(() => {
    let cancelado = false;
    mensajeService.obtenerTodos().then((res) => {
      if (!cancelado) setMensajes(res.data);
    });
    return () => { cancelado = true; };
  }, []);

  const handleToggleLeido = async (mensaje: Mensaje) => {
    await mensajeService.actualizarEstado(mensaje.mensaje_id, !mensaje.leido);
    cargarMensajes();
  };

  const handleEliminar = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este mensaje?')) {
      await mensajeService.eliminar(id);
      setSeleccionado(null);
      cargarMensajes();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mensajes</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de mensajes */}
        <div className={`lg:col-span-1 rounded-lg ${tema === 'oscuro' ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <div className="p-4 border-b">
            <p className="text-sm text-gray-500">{mensajes.length} mensajes</p>
          </div>
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {mensajes.map((msg) => (
              <button
                key={msg.mensaje_id}
                onClick={() => setSeleccionado(msg)}
                className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  seleccionado?.mensaje_id === msg.mensaje_id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${!msg.leido ? 'font-bold' : ''}`}>{msg.nombre}</span>
                  {!msg.leido && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                </div>
                <p className="text-sm text-gray-500 truncate">{msg.asunto || msg.mensaje}</p>
                <p className="text-xs text-gray-400">{new Date(msg.fecha_creacion).toLocaleDateString()}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Detalle del mensaje */}
        <div className={`lg:col-span-2 rounded-lg ${tema === 'oscuro' ? 'bg-gray-800' : 'bg-white shadow'}`}>
          {seleccionado ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{seleccionado.nombre}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleLeido(seleccionado)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    title={seleccionado.leido ? 'Marcar como no leído' : 'Marcar como leído'}
                  >
                    {seleccionado.leido ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button
                    onClick={() => handleEliminar(seleccionado.mensaje_id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {seleccionado.correo_electronico && (
                  <p className="text-sm"><span className="font-medium">Correo:</span> {seleccionado.correo_electronico}</p>
                )}
                {seleccionado.telefono && (
                  <p className="text-sm"><span className="font-medium">Teléfono:</span> {seleccionado.telefono}</p>
                )}
                {seleccionado.asunto && (
                  <p className="text-sm"><span className="font-medium">Asunto:</span> {seleccionado.asunto}</p>
                )}
                <p className="text-sm text-gray-500">{new Date(seleccionado.fecha_creacion).toLocaleString()}</p>
              </div>

              <div className={`p-4 rounded-lg ${tema === 'oscuro' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className="whitespace-pre-wrap">{seleccionado.mensaje}</p>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              Selecciona un mensaje para ver su detalle
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
