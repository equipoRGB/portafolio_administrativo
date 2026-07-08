import { useState } from 'react';
import { Save } from 'lucide-react';

import { useTema } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useAutoDismiss } from '../../hooks/useAutoDismiss';
import { authService } from '../../services/api';

export function PaginaSeguridad() {
  const { tema } = useTema();
  const { usuario } = useAuth();
  const { mensaje, mostrarMensaje } = useAutoDismiss();
  const [formularioUsuario, setFormularioUsuario] = useState({ nombre_usuario: usuario?.nombre_usuario || '' });
  const [formularioContrasena, setFormularioContrasena] = useState({ contrasenaActual: '', nuevaContrasena: '', confirmarContrasena: '' });
  const [guardando, setGuardando] = useState(false);

  const handleCambiarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    try {
      await authService.cambiarNombreUsuario(formularioUsuario.nombre_usuario);
      mostrarMensaje('exito', 'Nombre de usuario actualizado correctamente.');
    } catch (error) {
      mostrarMensaje('error', error instanceof Error ? error.message : 'Error al actualizar el usuario.');
    } finally {
      setGuardando(false);
    }
  };

  const handleCambiarContrasena = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    if (formularioContrasena.nuevaContrasena !== formularioContrasena.confirmarContrasena) {
      mostrarMensaje('error', 'Las contraseñas no coinciden.');
      setGuardando(false);
      return;
    }

    try {
      await authService.cambiarContrasena(formularioContrasena.contrasenaActual, formularioContrasena.nuevaContrasena);
      mostrarMensaje('exito', 'Contraseña actualizada correctamente.');
      setFormularioContrasena({ contrasenaActual: '', nuevaContrasena: '', confirmarContrasena: '' });
    } catch (error) {
      mostrarMensaje('error', error instanceof Error ? error.message : 'Error al actualizar la contraseña.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Seguridad</h1>

      {mensaje && (
        <div className={`mb-6 p-4 rounded-lg ${mensaje.tipo === 'exito'
          ? tema === 'oscuro' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
          : tema === 'oscuro' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
        }`}>
          {mensaje.texto}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cambiar usuario */}
        <form onSubmit={handleCambiarUsuario} className={`p-6 rounded-lg ${tema === 'oscuro' ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <h2 className="text-lg font-semibold mb-4">Cambiar nombre de usuario</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre de usuario actual</label>
              <input
                type="text"
                value={usuario?.nombre_usuario || ''}
                disabled
                className={`w-full px-4 py-2 rounded-lg border bg-gray-100 dark:bg-gray-600`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nuevo nombre de usuario</label>
              <input
                type="text"
                required
                value={formularioUsuario.nombre_usuario}
                onChange={(e) => setFormularioUsuario({ nombre_usuario: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${tema === 'oscuro' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
              />
            </div>
            <button
              type="submit"
              disabled={guardando}
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <Save size={20} />
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>

        {/* Cambiar contraseña */}
        <form onSubmit={handleCambiarContrasena} className={`p-6 rounded-lg ${tema === 'oscuro' ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <h2 className="text-lg font-semibold mb-4">Cambiar contraseña</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Contraseña actual</label>
              <input
                type="password"
                required
                value={formularioContrasena.contrasenaActual}
                onChange={(e) => setFormularioContrasena({ ...formularioContrasena, contrasenaActual: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${tema === 'oscuro' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nueva contraseña</label>
              <input
                type="password"
                required
                minLength={6}
                value={formularioContrasena.nuevaContrasena}
                onChange={(e) => setFormularioContrasena({ ...formularioContrasena, nuevaContrasena: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${tema === 'oscuro' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Confirmar nueva contraseña</label>
              <input
                type="password"
                required
                minLength={6}
                value={formularioContrasena.confirmarContrasena}
                onChange={(e) => setFormularioContrasena({ ...formularioContrasena, confirmarContrasena: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${tema === 'oscuro' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
              />
            </div>
            <button
              type="submit"
              disabled={guardando}
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <Save size={20} />
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
