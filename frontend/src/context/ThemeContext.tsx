/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Tema = 'claro' | 'oscuro';

const TEMA_KEY = 'tema';

interface ContextoTema {
  tema: Tema;
  alternarTema: () => void;
}

const ThemeContext = createContext<ContextoTema | undefined>(undefined);

function ProveedorTema({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(() => {
    return (localStorage.getItem(TEMA_KEY) as Tema) || 'claro';
  });

  useEffect(() => {
    localStorage.setItem(TEMA_KEY, tema);
  }, [tema]);

  function alternarTema() {
    setTema((prev) => (prev === 'claro' ? 'oscuro' : 'claro'));
  }

  return (
    <ThemeContext.Provider value={{ tema, alternarTema }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTema(): ContextoTema {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTema debe usarse dentro de ProveedorTema');
  }
  return context;
}

export { ProveedorTema, useTema };
