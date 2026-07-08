import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

import { useTema } from '../../context/ThemeContext';
import { useAutoDismiss } from '../../hooks/useAutoDismiss';
import { experienciaService } from '../../services/api';
import { ApiError } from '../../lib/api';
import { formatearFecha } from '../../utils/formatearFecha';
import type { Experiencia } from '../../types';

export function PaginaExperiencia() {
  const { tema } = useTema();
  const { mensaje, mostrarMensaje } = useAutoDismiss();
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [editando, setEditando] = useState<Experiencia | null>(null);
  const [nueva, setNueva] = useState(false);
  const [formulario, setFormulario] = useState<Partial<Experiencia>>({});
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [guardando, setGuardando] = useState(false);

  const cargarExperiencias = async () => {
    const res = await experienciaService.obtenerTodas();
    setExperiencias(res.data);
  };

  useEffect(() => {
    let cancelado = false;
    experienciaService.obtenerTodas().then((res) => {
      if (!cancelado) setExperiencias(res.data);
    });
    return () => { cancelado = true; };
  }, []);

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setErrores({});

    try {
      if (editando) {
        await experienciaService.actualizar(editando.experiencia_id, formulario);
      } else {
        await experienciaService.crear(formulario as Omit<Experiencia, 'experiencia_id'>);
      }
      setEditando(null);
      setNueva(false);
      setFormulario({});
      cargarExperiencias();
      mostrarMensaje('exito', editando ? 'Experiencia actualizada.' : 'Experiencia creada.');
    } catch (error) {
      if (error instanceof ApiError && error.errores) {
        const erroresPorCampo: Record<string, string> = {};
        const mensajes: string[] = [];
        for (const err of error.errores) {
          if (!erroresPorCampo[err.campo]) {
            erroresPorCampo[err.campo] = err.mensaje;
            mensajes.push(err.mensaje);
          }
        }
        setErrores(erroresPorCampo);
        mostrarMensaje('error', mensajes.join('. '));
      } else {
        mostrarMensaje('error', error instanceof Error ? error.message : 'Error al guardar la experiencia.');
      }
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta experiencia?')) {
      await experienciaService.eliminar(id);
      cargarExperiencias();
    }
  };

  return (
    <div>
      {mensaje && (
        <div className={`mb-4 p-4 rounded-lg ${mensaje.tipo === 'exito'
          ? tema === 'oscuro' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
          : tema === 'oscuro' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
        }`}>
          {mensaje.texto}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Experiencia</h1>
        <button
          onClick={() => { setNueva(true); setEditando(null); setFormulario({}); setErrores({}); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          Nueva
        </button>
      </div>

      {(nueva || editando) && (
        <form onSubmit={handleGuardar} className={`p-6 rounded-lg mb-6 ${tema === 'oscuro' ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{editando ? 'Editar' : 'Nueva'} Experiencia</h2>
            <button type="button" onClick={() => { setNueva(false); setEditando(null); setErrores({}); }}>
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="Título"
                required
                value={formulario.titulo || ''}
                onChange={(e) => { setFormulario({ ...formulario, titulo: e.target.value }); setErrores((prev) => ({ ...prev, titulo: '' })); }}
                className={`px-4 py-2 rounded-lg border w-full ${tema === 'oscuro' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'} ${errores.titulo ? 'border-red-500' : ''}`}
              />
              {errores.titulo && <p className="text-red-500 text-sm mt-1">{errores.titulo}</p>}
            </div>
            <div>
              <input
                type="text"
                placeholder="Cargo"
                value={formulario.cargo || ''}
                onChange={(e) => { setFormulario({ ...formulario, cargo: e.target.value }); setErrores((prev) => ({ ...prev, cargo: '' })); }}
                className={`px-4 py-2 rounded-lg border w-full ${tema === 'oscuro' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'} ${errores.cargo ? 'border-red-500' : ''}`}
              />
              {errores.cargo && <p className="text-red-500 text-sm mt-1">{errores.cargo}</p>}
            </div>
            <div>
              <input
                type="text"
                placeholder="Empresa"
                value={formulario.empresa || ''}
                onChange={(e) => { setFormulario({ ...formulario, empresa: e.target.value }); setErrores((prev) => ({ ...prev, empresa: '' })); }}
                className={`px-4 py-2 rounded-lg border w-full ${tema === 'oscuro' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'} ${errores.empresa ? 'border-red-500' : ''}`}
              />
              {errores.empresa && <p className="text-red-500 text-sm mt-1">{errores.empresa}</p>}
            </div>
            <div>
              <input
                type="text"
                placeholder="Ubicación"
                value={formulario.ubicacion || ''}
                onChange={(e) => { setFormulario({ ...formulario, ubicacion: e.target.value }); setErrores((prev) => ({ ...prev, ubicacion: '' })); }}
                className={`px-4 py-2 rounded-lg border w-full ${tema === 'oscuro' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'} ${errores.ubicacion ? 'border-red-500' : ''}`}
              />
              {errores.ubicacion && <p className="text-red-500 text-sm mt-1">{errores.ubicacion}</p>}
            </div>
            <div>
              <input
                type="date"
                placeholder="Fecha inicio"
                value={formulario.fecha_inicio || ''}
                onChange={(e) => { setFormulario({ ...formulario, fecha_inicio: e.target.value }); setErrores((prev) => ({ ...prev, fecha_inicio: '' })); }}
                className={`px-4 py-2 rounded-lg border w-full ${tema === 'oscuro' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'} ${errores.fecha_inicio ? 'border-red-500' : ''}`}
              />
              {errores.fecha_inicio && <p className="text-red-500 text-sm mt-1">{errores.fecha_inicio}</p>}
            </div>
            <div>
              <input
                type="date"
                placeholder="Fecha fin"
                value={formulario.fecha_fin || ''}
                onChange={(e) => { setFormulario({ ...formulario, fecha_fin: e.target.value }); setErrores((prev) => ({ ...prev, fecha_fin: '' })); }}
                className={`px-4 py-2 rounded-lg border w-full ${tema === 'oscuro' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'} ${errores.fecha_fin ? 'border-red-500' : ''}`}
              />
              {errores.fecha_fin && <p className="text-red-500 text-sm mt-1">{errores.fecha_fin}</p>}
            </div>
            <div className="md:col-span-2">
              <textarea
                placeholder="Descripción"
                required
                rows={3}
                value={formulario.descripcion || ''}
                onChange={(e) => { setFormulario({ ...formulario, descripcion: e.target.value }); setErrores((prev) => ({ ...prev, descripcion: '' })); }}
                className={`px-4 py-2 rounded-lg border w-full ${tema === 'oscuro' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'} ${errores.descripcion ? 'border-red-500' : ''}`}
              />
              {errores.descripcion && <p className="text-red-500 text-sm mt-1">{errores.descripcion}</p>}
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={guardando}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {experiencias.map((exp) => (
          <div key={exp.experiencia_id} className={`p-4 rounded-lg ${tema === 'oscuro' ? 'bg-gray-800' : 'bg-white shadow'}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{exp.titulo}</h3>
                <p className="text-blue-500">{exp.cargo}</p>
                {exp.empresa && <p className="text-sm text-gray-500">{exp.empresa}</p>}
                <p className="text-sm text-gray-500">{formatearFecha(exp.fecha_inicio)} - {exp.fecha_fin ? formatearFecha(exp.fecha_fin) : 'Presente'}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditando(exp); setNueva(false); setFormulario(exp); }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleEliminar(exp.experiencia_id)}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
