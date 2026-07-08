import { Link } from 'react-router-dom';
import { useTema } from '../context/ThemeContext';

interface FooterProps {
  correo?: string | null;
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
}

export function Footer({ correo, github, linkedin, twitter }: FooterProps) {
  const { tema } = useTema();

  return (
    <footer className={`py-8 ${tema === 'oscuro' ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm">
            &copy; {new Date().getFullYear()} Portfolio. Todos los derechos reservados.
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className={`text-sm transition-colors hover:text-blue-500 ${
                tema === 'oscuro' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Admin
            </Link>
            {correo && (
              <a
                href={`mailto:${correo}`}
                className={`text-sm transition-colors hover:text-blue-500 ${
                  tema === 'oscuro' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Contacto
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm transition-colors hover:text-blue-500 ${
                  tema === 'oscuro' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                GitHub
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm transition-colors hover:text-blue-500 ${
                  tema === 'oscuro' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                LinkedIn
              </a>
            )}
            {twitter && (
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm transition-colors hover:text-blue-500 ${
                  tema === 'oscuro' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Twitter
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
