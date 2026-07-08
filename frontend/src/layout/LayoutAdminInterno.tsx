import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, User, Briefcase, Wrench, FolderOpen, MessageSquare, Shield, LogOut } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useTema } from '../context/ThemeContext';

const enlaces = [
  { nombre: 'Dashboard', href: '/admin', icono: LayoutDashboard },
  { nombre: 'Información', href: '/admin/informacion', icono: User },
  { nombre: 'Experiencia', href: '/admin/experiencia', icono: Briefcase },
  { nombre: 'Herramientas', href: '/admin/herramientas', icono: Wrench },
  { nombre: 'Proyectos', href: '/admin/proyectos', icono: FolderOpen },
  { nombre: 'Mensajes', href: '/admin/mensajes', icono: MessageSquare },
  { nombre: 'Seguridad', href: '/admin/seguridad', icono: Shield },
];

export function LayoutAdminInterno({ children }: { children: React.ReactNode }) {
  const { usuario, logout } = useAuth();
  const { tema, alternarTema } = useTema();
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
          sidebarAbierto ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:inset-auto ${
          tema === 'oscuro' ? 'bg-gray-800' : 'bg-white border-r'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <Link to="/admin" className="text-xl font-bold">
              Admin Panel
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {enlaces.map((enlace) => {
              const Icono = enlace.icono;
              return (
                <Link
                  key={enlace.nombre}
                  to={enlace.href}
                  onClick={() => setSidebarAbierto(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tema === 'oscuro'
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <Icono size={20} />
                  {enlace.nombre}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t space-y-2">
            <div className={`text-sm ${tema === 'oscuro' ? 'text-gray-400' : 'text-gray-500'}`}>
              Conectado como: <span className="font-medium">{usuario?.nombre_usuario}</span>
            </div>
            <button
              onClick={alternarTema}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                tema === 'oscuro'
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {tema === 'oscuro' ? '☀️ Modo claro' : '🌙 Modo oscuro'}
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={20} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay para móvil */}
      {sidebarAbierto && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarAbierto(false)}
        />
      )}

      {/* Contenido principal */}
      <main className="flex-1">
        <header className={`p-4 border-b md:hidden ${tema === 'oscuro' ? 'bg-gray-800' : 'bg-white'}`}>
          <button
            onClick={() => setSidebarAbierto(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ☰
          </button>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
