import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

import { useTema } from '../../context/ThemeContext';
import { useAutoDismiss } from '../../hooks/useAutoDismiss';
import { herramientaService } from '../../services/api';
import type { Categoria, Herramienta } from '../../types';

export function PaginaHerramientas() {
  const { tema } = useTema();
  const { mensaje, mostrarMensaje } = useAutoDismiss();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [herramientas, setHerramientas] = useState<Herramienta[]>([]);
  const [editandoCategoria, setEditandoCategoria] = useState<Categoria | null>(null);
  const [editandoHerramienta, setEditandoHerramienta] = useState<Herramienta | null>(null);
  const [nuevaCategoria, setNuevaCategoria] = useState(false);
  const [nuevaHerramienta, setNuevaHerramienta] = useState(false);
  const [formularioCategoria, setFormularioCategoria] = useState<Partial<Categoria>>({});
  const [formularioHerramienta, setFormularioHerramienta] = useState<Partial<Herramienta>>({});

  const cargarDatos = async () => {
    const [catRes, herrRes] = await Promise.all([
      herramientaService.obtenerCategorias(),
      herramientaService.obtenerTodas(),
    ]);
    setCategorias(catRes.data);
    setHerramientas(herrRes.data);
  };

  useEffect(() => {
    let cancelado = false;
    Promise.all([
      herramientaService.obtenerCategorias(),
      herramientaService.obtenerTodas(),
    ]).then(([catRes, herrRes]) => {
      if (!cancelado) {
        setCategorias(catRes.data);
        setHerramientas(herrRes.data);
      }
    });
    return () => { cancelado = true; };
  }, []);

  const handleGuardarCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editandoCategoria) {
        await herramientaService.actualizarCategoria(editandoCategoria.categoria_id, formularioCategoria);
      } else {
        await herramientaService.crearCategoria(formularioCategoria as Omit<Categoria, 'categoria_id'>);
      }
      setEditandoCategoria(null);
      setNuevaCategoria(false);
      setFormularioCategoria({});
      cargarDatos();
      mostrarMensaje('exito', editandoCategoria ? 'Categoría actualizada.' : 'Categoría creada.');
    } catch {
      mostrarMensaje('error', 'Error al guardar la categoría.');
    }
  };

  const handleEliminarCategoria = async (id: number) => {
    if (confirm('¿Estás seguro? Se eliminarán todas las herramientas de esta categoría.')) {
      try {
        await herramientaService.eliminarCategoria(id);
        cargarDatos();
        mostrarMensaje('exito', 'Categoría eliminada.');
      } catch {
        mostrarMensaje('error', 'Error al eliminar la categoría.');
      }
    }
  };

  const handleGuardarHerramienta = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editandoHerramienta) {
        await herramientaService.actualizar(editandoHerramienta.herramienta_id, formularioHerramienta);
      } else {
        await herramientaService.crear(formularioHerramienta as Omit<Herramienta, 'herramienta_id'>);
      }
      setEditandoHerramienta(null);
      setNuevaHerramienta(false);
      setFormularioHerramienta({});
      cargarDatos();
      mostrarMensaje('exito', editandoHerramienta ? 'Herramienta actualizada.' : 'Herramienta creada.');
    } catch {
      mostrarMensaje('error', 'Error al guardar la herramienta.');
    }
  };

  const handleEliminarHerramienta = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta herramienta?')) {
      try {
        await herramientaService.eliminar(id);
        cargarDatos();
        mostrarMensaje('exito', 'Herramienta eliminada.');
      } catch {
        mostrarMensaje('error', 'Error al eliminar la herramienta.');
      }
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

      <h1 className="text-2xl font-bold mb-6">Herramientas</h1>

      {/* Categorías */}
      <div className={`p-6 rounded-lg mb-6 ${tema === 'oscuro' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Categorías</h2>
          <button
            onClick={() => { setNuevaCategoria(true); setEditandoCategoria(null); setFormularioCategoria({}); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} />
            Nueva
          </button>
        </div>

        {(nuevaCategoria || editandoCategoria) && (
          <form onSubmit={handleGuardarCategoria} className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Nombre"
              required
              value={formularioCategoria.nombre || ''}
              onChange={(e) => setFormularioCategoria({ ...formularioCategoria, nombre: e.target.value })}
              className={`flex-1 px-4 py-2 rounded-lg border ${tema === 'oscuro' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
            />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Guardar
            </button>
            <button type="button" onClick={() => { setNuevaCategoria(false); setEditandoCategoria(null); }}>
              <X size={20} />
            </button>
          </form>
        )}

        <div className="space-y-2">
          {categorias.map((cat) => (
            <div key={cat.categoria_id} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-700">
              <span>{cat.nombre}</span>
              <div className="flex gap-2">
                <button onClick={() => { setEditandoCategoria(cat); setFormularioCategoria(cat); }} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleEliminarCategoria(cat.categoria_id)} className="p-1 hover:bg-red-100 text-red-500 rounded">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Herramientas */}
      <div className={`p-6 rounded-lg ${tema === 'oscuro' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Herramientas</h2>
          <button
            onClick={() => { setNuevaHerramienta(true); setEditandoHerramienta(null); setFormularioHerramienta({}); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} />
            Nueva
          </button>
        </div>

        {(nuevaHerramienta || editandoHerramienta) && (
          <form onSubmit={handleGuardarHerramienta} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Nombre"
              required
              value={formularioHerramienta.nombre || ''}
              onChange={(e) => setFormularioHerramienta({ ...formularioHerramienta, nombre: e.target.value })}
              className={`px-4 py-2 rounded-lg border ${tema === 'oscuro' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
            />
            <select
              value={formularioHerramienta.categoria_id || ''}
              onChange={(e) => setFormularioHerramienta({ ...formularioHerramienta, categoria_id: Number(e.target.value) })}
              className={`px-4 py-2 rounded-lg border ${tema === 'oscuro' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map((cat) => (
                <option key={cat.categoria_id} value={cat.categoria_id}>{cat.nombre}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Guardar
              </button>
              <button type="button" onClick={() => { setNuevaHerramienta(false); setEditandoHerramienta(null); }}>
                <X size={20} />
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {herramientas.map((herr) => (
            <div key={herr.herramienta_id} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-700">
              <span>{herr.nombre} <span className="text-sm text-gray-500">({herr.categoria_nombre})</span></span>
              <div className="flex gap-2">
                <button onClick={() => { setEditandoHerramienta(herr); setFormularioHerramienta(herr); }} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleEliminarHerramienta(herr.herramienta_id)} className="p-1 hover:bg-red-100 text-red-500 rounded">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
