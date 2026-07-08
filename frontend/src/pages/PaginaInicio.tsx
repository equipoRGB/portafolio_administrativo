import { useState, useEffect } from 'react';
import { Download, ExternalLink, Send } from 'lucide-react';

import { useTema } from '../context/ThemeContext';
import { useAutoDismiss } from '../hooks/useAutoDismiss';
import { formatearFecha } from '../utils/formatearFecha';
import { informacionService, experienciaService, herramientaService, proyectoService, mensajeService } from '../services/api';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import type { InformacionGeneral, Experiencia, Herramienta, Proyecto, Categoria } from '../types';

export function PaginaInicio() {
  const { tema } = useTema();
  const [informacion, setInformacion] = useState<InformacionGeneral | null>(null);
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [herramientas, setHerramientas] = useState<Herramienta[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      informacionService.obtener(),
      experienciaService.obtenerTodas(),
      herramientaService.obtenerCategorias(),
      herramientaService.obtenerTodas(),
      proyectoService.obtenerPublicados(),
    ]).then(([infoRes, expRes, catRes, herrRes, proyRes]) => {
      setInformacion(infoRes.data);
      setExperiencias(expRes.data);
      setCategorias(catRes.data);
      setHerramientas(herrRes.data);
      setProyectos(proyRes.data);
    }).finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${tema === 'oscuro' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Navbar />

      {/* Inicio / Sobre mí */}
      <section id="inicio" className="min-h-screen pt-16 flex items-center px-4">
        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {informacion?.fotografia_url && (
            <div className="flex-shrink-0">
              <img
                src={informacion.fotografia_url}
                alt={informacion.nombre}
                className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover shadow-lg"
              />
            </div>
          )}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {informacion?.nombre || 'Tu Nombre'}
            </h1>
            <p className="text-xl md:text-2xl text-blue-500 mb-4">
              {informacion?.profesion || 'Tu Profesión'}
            </p>
            <p className={`text-lg leading-relaxed mb-6 ${tema === 'oscuro' ? 'text-gray-300' : 'text-gray-600'}`}>
              {informacion?.descripcion || 'Descripción breve sobre ti y tu trabajo.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="#proyectos"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Ver Proyectos
              </a>
              {informacion?.curriculum_url && (
                <a
                  href={informacion.curriculum_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                >
                  <Download size={20} />
                  Descargar CV
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Experiencia */}
      <section id="experiencia" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Experiencia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experiencias.length === 0 ? (
              <p className={`col-span-full text-center ${tema === 'oscuro' ? 'text-gray-400' : 'text-gray-500'}`}>
                No hay experiencias registradas aún.
              </p>
            ) : (
              experiencias.map((exp) => (
                <div
                  key={exp.experiencia_id}
                  className={`p-6 rounded-lg ${tema === 'oscuro' ? 'bg-gray-800' : 'bg-white shadow-md'}`}
                >
                  <h3 className="text-xl font-semibold">{exp.titulo}</h3>
                  <p className="text-blue-500 font-medium">{exp.cargo}</p>
                  {exp.empresa && (
                    <p className={`text-sm ${tema === 'oscuro' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {exp.empresa} {exp.ubicacion && `- ${exp.ubicacion}`}
                    </p>
                  )}
                  <p className={`text-sm ${tema === 'oscuro' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatearFecha(exp.fecha_inicio)} - {exp.fecha_fin ? formatearFecha(exp.fecha_fin) : 'Presente'}
                  </p>
                  {exp.descripcion && (
                    <p className={`mt-3 ${tema === 'oscuro' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {exp.descripcion}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Herramientas */}
      <section id="herramientas" className={`py-16 px-4 ${tema === 'oscuro' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Herramientas</h2>
          {herramientas.length === 0 ? (
            <p className={`text-center ${tema === 'oscuro' ? 'text-gray-400' : 'text-gray-500'}`}>
              No hay herramientas registradas aún.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categorias.map((cat) => (
                <div key={cat.categoria_id}>
                  <h3 className="text-xl font-semibold mb-4">{cat.nombre}</h3>
                  <div className="flex flex-wrap gap-2">
                    {herramientas
                      .filter((h) => h.categoria_id === cat.categoria_id)
                      .map((herramienta) => (
                        <span
                          key={herramienta.herramienta_id}
                          className={`px-3 py-1 rounded-full text-sm ${
                            tema === 'oscuro'
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {herramienta.nombre}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Proyectos */}
      <section id="proyectos" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Proyectos</h2>
          {proyectos.length === 0 ? (
            <p className={`text-center ${tema === 'oscuro' ? 'text-gray-400' : 'text-gray-500'}`}>
              No hay proyectos publicados aún.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {proyectos.map((proyecto) => (
                <div
                  key={proyecto.proyecto_id}
                  className={`rounded-lg overflow-hidden ${tema === 'oscuro' ? 'bg-gray-800' : 'bg-white shadow-md'}`}
                >
                  {proyecto.imagen_url && (
                    <img
                      src={proyecto.imagen_url}
                      alt={proyecto.nombre}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{proyecto.nombre}</h3>
                    {proyecto.descripcion && (
                      <p className={`mb-4 ${tema === 'oscuro' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {proyecto.descripcion}
                      </p>
                    )}
                    {proyecto.tecnologias && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {proyecto.tecnologias.split(',').map((tech, i) => (
                          <span
                            key={i}
                            className={`px-2 py-1 rounded text-xs ${
                              tema === 'oscuro'
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-4">
                      {proyecto.enlace_proyecto && (
                        <a
                          href={proyecto.enlace_proyecto}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-500 hover:underline"
                        >
                          <ExternalLink size={16} />
                          Ver proyecto
                        </a>
                      )}
                      {proyecto.enlace_repositorio && (
                        <a
                          href={proyecto.enlace_repositorio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-500 hover:underline"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                          Repositorio
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className={`py-16 px-4 ${tema === 'oscuro' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Contacto</h2>
          <FormularioContacto />
        </div>
      </section>

      <Footer
        correo={informacion?.correo_electronico}
        github={informacion?.github_url}
        linkedin={informacion?.linkedin_url}
        twitter={informacion?.twitter_url}
      />
    </div>
  );
}

function FormularioContacto() {
  const { tema } = useTema();
  const { mensaje, mostrarMensaje } = useAutoDismiss(4000);
  const [enviando, setEnviando] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [formulario, setFormulario] = useState({
    nombre: '',
    correo_electronico: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  });

  const validar = () => {
    const nuevosErrores: Record<string, string> = {};

    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    }

    if (!formulario.correo_electronico.trim() && !formulario.telefono.trim()) {
      nuevosErrores.correo_electronico = 'Proporciona al menos un medio de contacto';
      nuevosErrores.telefono = 'Proporciona al menos un medio de contacto';
    } else {
      if (formulario.correo_electronico && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.correo_electronico)) {
        nuevosErrores.correo_electronico = 'Ingresa un correo válido';
      }

      if (formulario.telefono && !/^\+?[\d\s-]{7,15}$/.test(formulario.telefono)) {
        nuevosErrores.telefono = 'Ingresa un teléfono válido';
      }
    }

    if (!formulario.mensaje.trim()) {
      nuevosErrores.mensaje = 'El mensaje es obligatorio';
    } else if (formulario.mensaje.trim().length < 10) {
      nuevosErrores.mensaje = 'El mensaje debe tener al menos 10 caracteres';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const limpiarError = (campo: string) => {
    if (errores[campo]) {
      setErrores({ ...errores, [campo]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validar()) return;

    setEnviando(true);

    try {
      await mensajeService.crear(formulario);
      mostrarMensaje('exito', 'Mensaje enviado correctamente.');
      setFormulario({ nombre: '', correo_electronico: '', telefono: '', asunto: '', mensaje: '' });
    } catch {
      mostrarMensaje('error', 'Error al enviar el mensaje. Intenta nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {mensaje && (
        <div
          className={`p-4 rounded-lg ${
            mensaje.tipo === 'exito'
              ? tema === 'oscuro' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
              : tema === 'oscuro' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Nombre *</label>
        <input
          type="text"
          value={formulario.nombre}
          onChange={(e) => {
            setFormulario({ ...formulario, nombre: e.target.value });
            limpiarError('nombre');
          }}
          className={`w-full px-4 py-2 rounded-lg border ${
            errores.nombre
              ? 'border-red-500'
              : tema === 'oscuro'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
        {errores.nombre && <p className="mt-1 text-sm text-red-500">{errores.nombre}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Correo electrónico</label>
          <input
            type="email"
            value={formulario.correo_electronico}
            onChange={(e) => {
              setFormulario({ ...formulario, correo_electronico: e.target.value });
              limpiarError('correo_electronico');
            }}
            className={`w-full px-4 py-2 rounded-lg border ${
              errores.correo_electronico
                ? 'border-red-500'
                : tema === 'oscuro'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
          {errores.correo_electronico && <p className="mt-1 text-sm text-red-500">{errores.correo_electronico}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Teléfono</label>
          <input
            type="tel"
            value={formulario.telefono}
            onChange={(e) => {
              setFormulario({ ...formulario, telefono: e.target.value });
              limpiarError('telefono');
            }}
            className={`w-full px-4 py-2 rounded-lg border ${
              errores.telefono
                ? 'border-red-500'
                : tema === 'oscuro'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
          {errores.telefono && <p className="mt-1 text-sm text-red-500">{errores.telefono}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Asunto</label>
        <input
          type="text"
          value={formulario.asunto}
          onChange={(e) => setFormulario({ ...formulario, asunto: e.target.value })}
          className={`w-full px-4 py-2 rounded-lg border ${
            tema === 'oscuro'
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Mensaje *</label>
        <textarea
          rows={5}
          value={formulario.mensaje}
          onChange={(e) => {
            setFormulario({ ...formulario, mensaje: e.target.value });
            limpiarError('mensaje');
          }}
          className={`w-full px-4 py-2 rounded-lg border ${
            errores.mensaje
              ? 'border-red-500'
              : tema === 'oscuro'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
        {errores.mensaje && <p className="mt-1 text-sm text-red-500">{errores.mensaje}</p>}
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        <Send size={20} />
        {enviando ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  );
}
