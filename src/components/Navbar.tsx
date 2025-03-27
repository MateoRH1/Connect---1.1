import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="flex items-center gap-2">
                <img 
                  src="/connect-logo.svg" 
                  alt="Connect" 
                  className="h-8 w-auto"
                />
              </div>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
            <Link to="/about" className="text-gray-600 hover:text-gray-900">
              Acerca de
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-gray-900">
              Precios
            </Link>
            <Link
              to="/login"
              className="bg-[#5552dd] text-white px-4 py-2 rounded-md hover:bg-[#4543bb]"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
            >
              Registrarse
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/about"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Acerca de
            </Link>
            <Link
              to="/pricing"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Precios
            </Link>
            <Link
              to="/login"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Registrarse
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
