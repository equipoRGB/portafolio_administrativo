import { Outlet, Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useTema } from '../context/ThemeContext';

export function LayoutAdmin() {
  const { estaAutenticado, cargando } = useAuth();
  const { tema } = useTema();

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`min-h-screen ${tema === 'oscuro' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Outlet />
    </div>
  );
}
