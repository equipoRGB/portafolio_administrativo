import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useTema } from '../context/ThemeContext';
import { useAutoDismiss } from '../hooks/useAutoDismiss';

export function PaginaLogin() {
  const { login } = useAuth();
  const { tema } = useTema();
  const navigate = useNavigate();
  const { mensaje, mostrarMensaje } = useAutoDismiss(4000);
  const [formulario, setFormulario] = useState({ nombre_usuario: '', contrasena: '' });
  const [errores, setErrores] = useState<{ nombre_usuario?: string; contrasena?: string }>({});
  const [cargando, setCargando] = useState(false);

  const validar = () => {
    const nuevosErrores: { nombre_usuario?: string; contrasena?: string } = {};

    if (!formulario.nombre_usuario.trim()) {
      nuevosErrores.nombre_usuario = 'El usuario es obligatorio';
    }

    if (!formulario.contrasena) {
      nuevosErrores.contrasena = 'La contraseña es obligatoria';
    } else if (formulario.contrasena.length < 6) {
      nuevosErrores.contrasena = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validar()) return;

    setCargando(true);

    try {
      await login(formulario.nombre_usuario, formulario.contrasena);
      navigate('/admin');
    } catch (err) {
      mostrarMensaje('error', err instanceof Error ? err.message : 'Credenciales inválidas');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${tema === 'oscuro' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`w-full p-8 rounded-lg shadow-lg ${tema === 'oscuro' ? 'bg-gray-800' : 'bg-white'}`} style={{ maxWidth: '24rem' }}>
        <div className="text-center mb-8">
          <LogIn className="mx-auto h-12 w-12 text-blue-500" />
          <h1 className={`text-2xl font-bold mt-4 ${tema === 'oscuro' ? 'text-white' : 'text-gray-600'}`}>Iniciar Sesión</h1>
          <p className={`mt-2 ${tema === 'oscuro' ? 'text-gray-400' : 'text-gray-600'}`}>
            Accede al panel de administración
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mensaje && (
            <div className={`p-4 rounded-lg ${mensaje.tipo === 'error'
              ? tema === 'oscuro' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
              : tema === 'oscuro' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
            }`}>
              {mensaje.texto}
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium mb-2 ${tema === 'oscuro' ? 'text-white' : 'text-gray-600'}`}>Usuario</label>
            <input
              type="text"
              value={formulario.nombre_usuario}
              onChange={(e) => {
                setFormulario({ ...formulario, nombre_usuario: e.target.value });
                if (errores.nombre_usuario) setErrores({ ...errores, nombre_usuario: undefined });
              }}
              className={`w-full px-4 py-2 rounded-lg border ${
                errores.nombre_usuario
                  ? 'border-red-500'
                  : tema === 'oscuro'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            {errores.nombre_usuario && (
              <p className="mt-1 text-sm text-red-500">{errores.nombre_usuario}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${tema === 'oscuro' ? 'text-white' : 'text-gray-600'}`}>Contraseña</label>
            <input
              type="password"
              value={formulario.contrasena}
              onChange={(e) => {
                setFormulario({ ...formulario, contrasena: e.target.value });
                if (errores.contrasena) setErrores({ ...errores, contrasena: undefined });
              }}
              className={`w-full px-4 py-2 rounded-lg border ${
                errores.contrasena
                  ? 'border-red-500'
                  : tema === 'oscuro'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            {errores.contrasena && (
              <p className="mt-1 text-sm text-red-500">{errores.contrasena}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
