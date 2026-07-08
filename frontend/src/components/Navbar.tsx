import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';

import { useTema } from '../context/ThemeContext';

const enlaces = [
  { nombre: 'Inicio', href: '/#inicio' },
  { nombre: 'Experiencia', href: '/#experiencia' },
  { nombre: 'Herramientas', href: '/#herramientas' },
  { nombre: 'Proyectos', href: '/#proyectos' },
  { nombre: 'Contacto', href: '/#contacto' },
];

export function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { tema, alternarTema } = useTema();
  const [activo, setActivo] = useState('');

  useEffect(() => {
    const ids = enlaces.map((e) => e.href.replace('/#', ''));
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActivo(entry.target.id);
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    elements.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${tema === 'oscuro' ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">
            Portafolio
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {enlaces.map((enlace) => {
              const activoClase = activo === enlace.href.replace('/#', '');
              return (
                <a
                  key={enlace.nombre}
                  href={enlace.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activoClase
                      ? tema === 'oscuro'
                        ? 'text-blue-400 bg-gray-800'
                        : 'text-blue-600 bg-blue-50'
                      : tema === 'oscuro'
                        ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  {enlace.nombre}
                </a>
              );
            })}
            <button
              onClick={alternarTema}
              className={`p-2 rounded-lg transition-colors ${
                tema === 'oscuro'
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="Cambiar tema"
            >
              {tema === 'oscuro' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              tema === 'oscuro'
                ? 'text-gray-300 hover:bg-gray-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-label="Menú"
          >
            {menuAbierto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuAbierto && (
        <div className={`md:hidden ${tema === 'oscuro' ? 'bg-gray-900' : 'bg-white'} border-t`}>
          <div className="px-4 py-3 space-y-2">
            {enlaces.map((enlace) => (
              <a
                key={enlace.nombre}
                href={enlace.href}
                onClick={() => setMenuAbierto(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tema === 'oscuro'
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {enlace.nombre}
              </a>
            ))}
            <button
              onClick={() => {
                alternarTema();
                setMenuAbierto(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full ${
                tema === 'oscuro'
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tema === 'oscuro' ? <Sun size={20} /> : <Moon size={20} />}
              {tema === 'oscuro' ? 'Modo claro' : 'Modo oscuro'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
