import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Briefcase, FolderOpen, Wrench } from 'lucide-react';

import { useTema } from '../../context/ThemeContext';
import { experienciaService, proyectoService, mensajeService, herramientaService } from '../../services/api';

export function Dashboard() {
  const { tema } = useTema();
  const [estadisticas, setEstadisticas] = useState({
    experiencias: 0,
    proyectos: 0,
    mensajesNoLeidos: 0,
    herramientas: 0,
  });

  useEffect(() => {
    Promise.all([
      experienciaService.obtenerTodas(),
      proyectoService.obtenerTodos(),
      mensajeService.obtenerTodos(),
      herramientaService.obtenerTodas(),
    ]).then(([expRes, proyRes, menRes, herrRes]) => {
      setEstadisticas({
        experiencias: expRes.data.length,
        proyectos: proyRes.data.length,
        mensajesNoLeidos: menRes.data.filter((m) => !m.leido).length,
        herramientas: herrRes.data.length,
      });
    });
  }, []);

  const tarjetas = [
    { titulo: 'Experiencias', valor: estadisticas.experiencias, icono: Briefcase, href: '/admin/experiencia', color: 'bg-blue-500' },
    { titulo: 'Proyectos', valor: estadisticas.proyectos, icono: FolderOpen, href: '/admin/proyectos', color: 'bg-green-500' },
    { titulo: 'Mensajes sin leer', valor: estadisticas.mensajesNoLeidos, icono: MessageSquare, href: '/admin/mensajes', color: 'bg-yellow-500' },
    { titulo: 'Herramientas', valor: estadisticas.herramientas, icono: Wrench, href: '/admin/herramientas', color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tarjetas.map((tarjeta) => {
          const Icono = tarjeta.icono;
          return (
            <Link
              key={tarjeta.titulo}
              to={tarjeta.href}
              className={`p-6 rounded-lg shadow-sm transition-shadow hover:shadow-md ${
                tema === 'oscuro' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${tema === 'oscuro' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {tarjeta.titulo}
                  </p>
                  <p className="text-3xl font-bold mt-1">{tarjeta.valor}</p>
                </div>
                <div className={`${tarjeta.color} p-3 rounded-lg text-white`}>
                  <Icono size={24} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
