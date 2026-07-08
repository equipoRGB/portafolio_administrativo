import { Outlet } from 'react-router-dom';

import { useTema } from '../context/ThemeContext';

export function LayoutPublico() {
  const { tema } = useTema();

  return (
    <div className={`min-h-screen ${tema === 'oscuro' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Outlet />
    </div>
  );
}
