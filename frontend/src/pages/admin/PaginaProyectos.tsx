import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Eye, EyeOff, Upload, Trash } from 'lucide-react';

import { useTema } from '../../context/ThemeContext';
import { useAutoDismiss } from '../../hooks/useAutoDismiss';
import { proyectoService } from '../../services/api';
import type { Proyecto } from '../../types';

export function PaginaProyectos() {
  const { tema } = useTema();
  const { mensaje, mostrarMensaje } = useAutoDismiss();
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [editando, setEditando] = useState<Proyecto | null>(null);
  const [nuevo, setNuevo] = useState(false);
  const [formulario, setFormulario] = useState<Partial<Proyecto>>({});
  const [fotoPrevisualizacion, setFotoPrevisualizacion] = useState<string | null>(null);
  const [fotoSeleccionada, setFotoSeleccionada] = useState<File | null>(null);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const proyectoActual = editando ?? (nuevo ? { proyecto_id: 0 } : null);

  const cargarProyectos = async () => {
    const res = await proyectoService.obtenerTodos();
    setProyectos(res.data);
  };

  useEffect(() => {
    let cancelado = false;
    proyectoService.obtenerTodos().then((res) => {
      if (!cancelado) setProyectos(res.data);
    });
    return () => { cancelado = true; };
  }, []);

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editando) {
        await proyectoService.actualizar(editando.proyecto_id, formulario);
      } else {
        const res = await proyectoService.crear(formulario as Omit<Proyecto, 'proyecto_id' | 'imagen_url' | 'imagen_public_id'>);
        if (fotoSeleccionada && res.data.proyecto_id) {
          await proyectoService.actualizarImagen(res.data.proyecto_id, fotoSeleccionada);
        }
      }
      setEditando(null);
      setNuevo(false);
      setFormulario({});
      setFotoPrevisualizacion(null);
      setFotoSeleccionada(null);
      if (inputFileRef.current) inputFileRef.current.value = '';
      cargarProyectos();
      mostrarMensaje('exito', editando ? 'Proyecto actualizado.' : 'Proyecto creado.');
    } catch (error) {
      mostrarMensaje('error', error instanceof Error ? error.message : 'Error al guardar el proyecto.');
    }
  };

  const handleEliminar = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este proyecto?')) {
      try {
        await proyectoService.eliminar(id);
        cargarProyectos();
        mostrarMensaje('exito', 'Proyecto eliminado.');
      } catch {
        mostrarMensaje('error', 'Error al eliminar el proyecto.');
      }
    }
  };

  const handleTogglePublicado = async (proyecto: Proyecto) => {
    try {
      await proyectoService.actualizar(proyecto.proyecto_id, { publicado: !proyecto.publicado });
      cargarProyectos();
      mostrarMensaje('exito', proyecto.publicado ? 'Proyecto ocultado.' : 'Proyecto publicado.');
    } catch {
      mostrarMensaje('error', 'Error al cambiar visibilidad.');
    }
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoSeleccionada(file);
    const reader = new FileReader();
    reader.onload = () => setFotoPrevisualizacion(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleConfirmarFoto = async () => {
    if (!fotoSeleccionada || !proyectoActual || !proyectoActual.proyecto_id) return;
    setSubiendoFoto(true);
    try {
      const res = await proyectoService.actualizarImagen(proyectoActual.proyecto_id, fotoSeleccionada);
      setFormulario((prev) => ({ ...prev, imagen_url: res.imagen_url }));
      setFotoPrevisualizacion(null);
      setFotoSeleccionada(null);
      cargarProyectos();
      mostrarMensaje('exito', 'Imagen actualizada.');
    } catch {
      mostrarMensaje('error', 'Error al subir la imagen.');
    } finally {
      setSubiendoFoto(false);
    }
  };

  const handleCancelarFoto = () => {
    setFotoPrevisualizacion(null);
    setFotoSeleccionada(null);
    if (inputFileRef.current) inputFileRef.current.value = '';
  };

  const handleEliminarFoto = async () => {
    if (!proyectoActual || !proyectoActual.proyecto_id) return;
    if (!confirm('¿Eliminar la imagen del proyecto?')) return;
    try {
      await proyectoService.eliminarImagen(proyectoActual.proyecto_id);
      setFormulario((prev) => ({ ...prev, imagen_url: null }));
      cargarProyectos();
      mostrarMensaje('exito', 'Imagen eliminada.');
    } catch {
      mostrarMensaje('error', 'Error al eliminar la imagen.');
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
        <h1 className="text-2xl font-bold">Proyectos</h1>
        <button
          onClick={() => { setNuevo(true); setEditando(null); setFormulario({}); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          Nuevo
        </button>
      </div>

      {(nuevo || editando) && (
        <form onSubmit={handleGuardar} className={`p-6 rounded-lg mb-6 ${tema === 'oscuro' ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{editando ? 'Editar' : 'Nuevo'} Proyecto</h2>
            <button type="button" onClick={() => { setNuevo(false); setEditando(null); }}>
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre"
              required
              value={formulario.nombre || ''}
              onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
              className={`px-4 py-2 rounded-lg border ${tema === 'oscuro' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
            />
            <input
              type="text"
              placeholder="Tecnologías (separadas por coma)"
              value={formulario.tecnologias || ''}
              onChange={(e) => setFormulario({ ...formulario, tecnologias: e.target.value })}
              className={`px-4 py-2 rounded-lg border ${tema === 'oscuro' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
            />
            <textarea
              placeholder="Descripción"
              rows={3}
              value={formulario.descripcion || ''}
              onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
              className={`md:col-span-2 px-4 py-2 rounded-lg border ${tema === 'oscuro' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
            />
            <input
              type="url"
              placeholder="Enlace al proyecto"
              value={formulario.enlace_proyecto || ''}
              onChange={(e) => setFormulario({ ...formulario, enlace_proyecto: e.target.value })}
              className={`px-4 py-2 rounded-lg border ${tema === 'oscuro' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
            />
            <input
              type="url"
              placeholder="Enlace al repositorio"
              value={formulario.enlace_repositorio || ''}
              onChange={(e) => setFormulario({ ...formulario, enlace_repositorio: e.target.value })}
              className={`px-4 py-2 rounded-lg border ${tema === 'oscuro' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
            />
          </div>

          {/* Imagen */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Imagen del proyecto</label>
            {(formulario.imagen_url && !fotoPrevisualizacion) ? (
              <div className="relative inline-block">
                <img src={formulario.imagen_url} alt="Vista previa" className="w-48 h-32 object-cover rounded-lg" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button type="button" onClick={() => inputFileRef.current?.click()} className="p-1.5 bg-gray-800/70 text-white rounded hover:bg-gray-800">
                    <Upload size={16} />
                  </button>
                  <button type="button" onClick={handleEliminarFoto} className="p-1.5 bg-red-600/70 text-white rounded hover:bg-red-600">
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {fotoPrevisualizacion && editando && (
                  <div className="relative">
                    <img src={fotoPrevisualizacion} alt="Previsualización" className="w-48 h-32 object-cover rounded-lg" />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button type="button" onClick={handleConfirmarFoto} disabled={subiendoFoto} className="p-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-xs">
                        {subiendoFoto ? '...' : '✓'}
                      </button>
                      <button type="button" onClick={handleCancelarFoto} className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700">
                        ✕
                      </button>
                    </div>
                  </div>
                )}
                {fotoPrevisualizacion && !editando && (
                  <div className="relative">
                    <img src={fotoPrevisualizacion} alt="Previsualización" className="w-48 h-32 object-cover rounded-lg" />
                    <div className="absolute top-2 right-2">
                      <button type="button" onClick={handleCancelarFoto} className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700">
                        ✕
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Se subirá al guardar</p>
                  </div>
                )}
                <button type="button" onClick={() => inputFileRef.current?.click()} className="flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Upload size={20} />
                  {fotoPrevisualizacion ? 'Cambiar imagen' : 'Subir imagen'}
                </button>
              </div>
            )}
            <input ref={inputFileRef} type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
          </div>

          <div className="mt-4">
            <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Guardar
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {proyectos.map((proy) => (
          <div key={proy.proyecto_id} className={`p-4 rounded-lg ${tema === 'oscuro' ? 'bg-gray-800' : 'bg-white shadow'}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{proy.nombre}</h3>
                  {proy.publicado ? (
                    <span className={`px-2 py-1 text-xs rounded ${tema === 'oscuro' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>Publicado</span>
                  ) : (
                    <span className={`px-2 py-1 text-xs rounded ${tema === 'oscuro' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>Borrador</span>
                  )}
                </div>
                {proy.descripcion && <p className="text-sm text-gray-500 mt-1">{proy.descripcion}</p>}
                {proy.tecnologias && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {proy.tecnologias.split(',').map((tech, i) => (
                      <span key={i} className={`px-2 py-1 text-xs rounded ${tema === 'oscuro' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>{tech.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleTogglePublicado(proy)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title={proy.publicado ? 'Ocultar' : 'Publicar'}>
                  {proy.publicado ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button onClick={() => { setEditando(proy); setFormulario(proy); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <Pencil size={18} />
                </button>
                <button onClick={() => handleEliminar(proy.proyecto_id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 rounded-lg">
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
