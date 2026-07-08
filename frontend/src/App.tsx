import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ProveedorTema } from './context/ThemeContext';
import { ProveedorAuth } from './context/AuthContext';
import { LayoutPublico } from './layout/LayoutPublico';
import { LayoutAdmin } from './layout/LayoutAdmin';
import { LayoutAdminInterno } from './layout/LayoutAdminInterno';
import { PaginaInicio } from './pages/PaginaInicio';
import { PaginaLogin } from './pages/PaginaLogin';
import { Dashboard } from './pages/admin/Dashboard';
import { PaginaInformacion } from './pages/admin/PaginaInformacion';
import { PaginaExperiencia } from './pages/admin/PaginaExperiencia';
import { PaginaHerramientas } from './pages/admin/PaginaHerramientas';
import { PaginaProyectos } from './pages/admin/PaginaProyectos';
import { PaginaMensajes } from './pages/admin/PaginaMensajes';
import { PaginaSeguridad } from './pages/admin/PaginaSeguridad';

function App() {
  return (
    <BrowserRouter>
      <ProveedorTema>
        <ProveedorAuth>
          <Routes>
            <Route element={<LayoutPublico />}>
              <Route path="/" element={<PaginaInicio />} />
            </Route>

            <Route path="/login" element={<PaginaLogin />} />

            <Route element={<LayoutAdmin />}>
              <Route path="/admin" element={<LayoutAdminInterno><Dashboard /></LayoutAdminInterno>} />
              <Route path="/admin/informacion" element={<LayoutAdminInterno><PaginaInformacion /></LayoutAdminInterno>} />
              <Route path="/admin/experiencia" element={<LayoutAdminInterno><PaginaExperiencia /></LayoutAdminInterno>} />
              <Route path="/admin/herramientas" element={<LayoutAdminInterno><PaginaHerramientas /></LayoutAdminInterno>} />
              <Route path="/admin/proyectos" element={<LayoutAdminInterno><PaginaProyectos /></LayoutAdminInterno>} />
              <Route path="/admin/mensajes" element={<LayoutAdminInterno><PaginaMensajes /></LayoutAdminInterno>} />
              <Route path="/admin/seguridad" element={<LayoutAdminInterno><PaginaSeguridad /></LayoutAdminInterno>} />
            </Route>
          </Routes>
        </ProveedorAuth>
      </ProveedorTema>
    </BrowserRouter>
  );
}

export default App;
