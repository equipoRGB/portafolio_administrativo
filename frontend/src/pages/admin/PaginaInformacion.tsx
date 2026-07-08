import { useState, useEffect, useRef } from 'react';
import { Save, Upload, Trash2, X, Check } from 'lucide-react';

import { useTema } from '../../context/ThemeContext';
import { useAutoDismiss } from '../../hooks/useAutoDismiss';
import { informacionService } from '../../services/api';
import type { InformacionGeneral } from '../../types';

const URL_REGEX = /^https?:\/\/.+/;

export function PaginaInformacion() {
  const { tema } = useTema();
  const { mensaje, mostrarMensaje } = useAutoDismiss();
  const [informacion, setInformacion] = useState<Partial<InformacionGeneral>>({});
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [guardando, setGuardando] = useState(false);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [eliminandoFoto, setEliminandoFoto] = useState(false);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);
  const [archivoPendiente, setArchivoPendiente] = useState<File | null>(null);
  const inputFotoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    informacionService.obtener().then((res) => {
      if (res.data) {
        setInformacion(res.data);
      }
    });
  }, []);

  const validar = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!informacion.nombre?.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    }

    if (!informacion.profesion?.trim()) {
      nuevosErrores.profesion = 'La profesión es obligatoria';
    }

    if (informacion.correo_electronico && informacion.correo_electronico.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(informacion.correo_electronico)) {
        nuevosErrores.correo_electronico = 'Ingresa un correo válido';
      }
    }

    const urlCampos = [
      { key: 'curriculum_url', label: 'del currículum' },
      { key: 'github_url', label: 'de GitHub' },
      { key: 'linkedin_url', label: 'de LinkedIn' },
      { key: 'twitter_url', label: 'de Twitter' },
      { key: 'instagram_url', label: 'de Instagram' },
    ];

    for (const campo of urlCampos) {
      const valor = informacion[campo.key as keyof InformacionGeneral] as string;
      if (valor && valor.trim()) {
        if (!URL_REGEX.test(valor)) {
          nuevosErrores[campo.key] = `URL ${campo.label} inválida`;
        }
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const limpiarError = (campo: string) => {
    if (errores[campo]) {
      setErrores((prev) => {
        const nuevos = { ...prev };
        delete nuevos[campo];
        return nuevos;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validar()) return;

    setGuardando(true);

    try {
      const datosLimpios: Record<string, unknown> = {};

      if (informacion.nombre?.trim()) datosLimpios.nombre = informacion.nombre.trim();
      if (informacion.profesion?.trim()) datosLimpios.profesion = informacion.profesion.trim();
      if (informacion.descripcion) datosLimpios.descripcion = informacion.descripcion;

      const urlCampos = ['curriculum_url', 'correo_electronico', 'github_url', 'linkedin_url', 'twitter_url', 'instagram_url'] as const;

      for (const campo of urlCampos) {
        const valor = informacion[campo];
        if (valor && valor.trim()) {
          datosLimpios[campo] = valor.trim();
        } else {
          datosLimpios[campo] = null;
        }
      }

      if (informacion.telefono && informacion.telefono.trim()) {
        datosLimpios.telefono = informacion.telefono.trim();
      } else {
        datosLimpios.telefono = null;
      }

      await informacionService.actualizar(datosLimpios);
      mostrarMensaje('exito', 'Información actualizada correctamente.');
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error al actualizar la información.';
      mostrarMensaje('error', mensaje);
    } finally {
      setGuardando(false);
    }
  };

  const handleSeleccionarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    if (archivo.size > 5 * 1024 * 1024) {
      mostrarMensaje('error', 'La imagen no debe superar los 5MB.');
      if (inputFotoRef.current) inputFotoRef.current.value = '';
      return;
    }

    if (!archivo.type.startsWith('image/')) {
      mostrarMensaje('error', 'Solo se permiten archivos de imagen.');
      if (inputFotoRef.current) inputFotoRef.current.value = '';
      return;
    }

    setArchivoPendiente(archivo);
    const urlPreview = URL.createObjectURL(archivo);
    setPreviewFoto(urlPreview);
  };

  const handleConfirmarFoto = async () => {
    if (!archivoPendiente) return;

    setSubiendoFoto(true);
    try {
      const result = await informacionService.actualizarFotografia(archivoPendiente);
      setInformacion((prev) => ({
        ...prev,
        fotografia_url: result.fotografia_url,
      }));
      mostrarMensaje('exito', 'Fotografía actualizada correctamente.');
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error al subir la fotografía.';
      mostrarMensaje('error', mensaje);
    } finally {
      setSubiendoFoto(false);
      setArchivoPendiente(null);
      setPreviewFoto(null);
      if (inputFotoRef.current) inputFotoRef.current.value = '';
    }
  };

  const handleCancelarFoto = () => {
    setArchivoPendiente(null);
    setPreviewFoto(null);
    if (inputFotoRef.current) inputFotoRef.current.value = '';
  };

  const handleEliminarFoto = async () => {
    setEliminandoFoto(true);
    try {
      await informacionService.eliminarFotografia();
      setInformacion((prev) => ({
        ...prev,
        fotografia_url: null,
        fotografia_public_id: null,
      }));
      mostrarMensaje('exito', 'Fotografía eliminada correctamente.');
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error al eliminar la fotografía.';
      mostrarMensaje('error', mensaje);
    } finally {
      setEliminandoFoto(false);
    }
  };

  const tieneFotoActual = !!informacion.fotografia_url;
  const tienePreview = !!previewFoto;

  const inputClass = (campo: string) =>
    `w-full px-4 py-2 rounded-lg border ${
      errores[campo]
        ? 'border-red-500'
        : tema === 'oscuro'
          ? 'bg-gray-700 border-gray-600 text-white'
          : 'border-gray-300'
    }`;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Información General</h1>

      <form onSubmit={handleSubmit} className={`p-6 rounded-lg ${tema === 'oscuro' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        {mensaje && (
          <div className={`mb-6 p-4 rounded-lg ${mensaje.tipo === 'exito' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {mensaje.texto}
          </div>
        )}

        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Fotografía</label>
          <div className="flex items-start gap-4">
            {tienePreview ? (
              <div className="relative">
                <img
                  src={previewFoto}
                  alt="Vista previa"
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="absolute -top-2 -right-2 flex gap-1">
                  <button
                    type="button"
                    onClick={handleConfirmarFoto}
                    disabled={subiendoFoto}
                    className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelarFoto}
                    disabled={subiendoFoto}
                    className="p-1 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X size={14} />
                  </button>
                </div>
                {subiendoFoto && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">Subiendo...</span>
                  </div>
                )}
              </div>
            ) : tieneFotoActual ? (
              <div className="relative">
                <img
                  src={informacion.fotografia_url ?? ''}
                  alt="Fotografía de perfil"
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleEliminarFoto}
                  disabled={eliminandoFoto}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ) : (
              <div className={`w-32 h-32 rounded-lg flex items-center justify-center ${tema === 'oscuro' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <span className={`text-sm ${tema === 'oscuro' ? 'text-gray-400' : 'text-gray-500'}`}>Sin foto</span>
              </div>
            )}
            <div>
              <input
                ref={inputFotoRef}
                type="file"
                accept="image/*"
                onChange={handleSeleccionarArchivo}
                className="hidden"
              />
              {!tienePreview && (
                <button
                  type="button"
                  onClick={() => inputFotoRef.current?.click()}
                  disabled={subiendoFoto}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  <Upload size={18} />
                  {subiendoFoto ? 'Subiendo...' : tieneFotoActual ? 'Cambiar foto' : 'Subir foto'}
                </button>
              )}
              <p className={`text-xs mt-2 ${tema === 'oscuro' ? 'text-gray-400' : 'text-gray-500'}`}>
                JPG, PNG. Máximo 5MB.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nombre *</label>
            <input
              type="text"
              value={informacion.nombre || ''}
              onChange={(e) => {
                setInformacion({ ...informacion, nombre: e.target.value });
                limpiarError('nombre');
              }}
              className={inputClass('nombre')}
            />
            {errores.nombre && <p className="mt-1 text-sm text-red-500">{errores.nombre}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Profesión *</label>
            <input
              type="text"
              value={informacion.profesion || ''}
              onChange={(e) => {
                setInformacion({ ...informacion, profesion: e.target.value });
                limpiarError('profesion');
              }}
              className={inputClass('profesion')}
            />
            {errores.profesion && <p className="mt-1 text-sm text-red-500">{errores.profesion}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Descripción</label>
            <textarea
              rows={4}
              value={informacion.descripcion || ''}
              onChange={(e) => setInformacion({ ...informacion, descripcion: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${tema === 'oscuro' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">URL del CV</label>
            <input
              type="url"
              value={informacion.curriculum_url || ''}
              onChange={(e) => {
                setInformacion({ ...informacion, curriculum_url: e.target.value });
                limpiarError('curriculum_url');
              }}
              className={inputClass('curriculum_url')}
            />
            {errores.curriculum_url && <p className="mt-1 text-sm text-red-500">{errores.curriculum_url}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Correo electrónico</label>
            <input
              type="email"
              value={informacion.correo_electronico || ''}
              onChange={(e) => {
                setInformacion({ ...informacion, correo_electronico: e.target.value });
                limpiarError('correo_electronico');
              }}
              className={inputClass('correo_electronico')}
            />
            {errores.correo_electronico && <p className="mt-1 text-sm text-red-500">{errores.correo_electronico}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Teléfono</label>
            <input
              type="tel"
              value={informacion.telefono || ''}
              onChange={(e) => setInformacion({ ...informacion, telefono: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${tema === 'oscuro' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">GitHub URL</label>
            <input
              type="url"
              value={informacion.github_url || ''}
              onChange={(e) => {
                setInformacion({ ...informacion, github_url: e.target.value });
                limpiarError('github_url');
              }}
              className={inputClass('github_url')}
            />
            {errores.github_url && <p className="mt-1 text-sm text-red-500">{errores.github_url}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
            <input
              type="url"
              value={informacion.linkedin_url || ''}
              onChange={(e) => {
                setInformacion({ ...informacion, linkedin_url: e.target.value });
                limpiarError('linkedin_url');
              }}
              className={inputClass('linkedin_url')}
            />
            {errores.linkedin_url && <p className="mt-1 text-sm text-red-500">{errores.linkedin_url}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Twitter URL</label>
            <input
              type="url"
              value={informacion.twitter_url || ''}
              onChange={(e) => {
                setInformacion({ ...informacion, twitter_url: e.target.value });
                limpiarError('twitter_url');
              }}
              className={inputClass('twitter_url')}
            />
            {errores.twitter_url && <p className="mt-1 text-sm text-red-500">{errores.twitter_url}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Instagram URL</label>
            <input
              type="url"
              value={informacion.instagram_url || ''}
              onChange={(e) => {
                setInformacion({ ...informacion, instagram_url: e.target.value });
                limpiarError('instagram_url');
              }}
              className={inputClass('instagram_url')}
            />
            {errores.instagram_url && <p className="mt-1 text-sm text-red-500">{errores.instagram_url}</p>}
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={guardando}
            className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
