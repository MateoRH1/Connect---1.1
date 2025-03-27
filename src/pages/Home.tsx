import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, ShoppingCart, Users, TrendingUp } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sección Hero */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Optimiza tu</span>
                  <span className="block text-[#5552dd]">Negocio en MercadoLibre</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Connect ayuda a vendedores a maximizar su potencial en MercadoLibre a través de
                  consultoría experta y herramientas de análisis poderosas.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start space-x-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#5552dd] hover:bg-[#4543bb] md:py-4 md:text-lg md:px-8"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[#5552dd] bg-[#5552dd]/10 hover:bg-[#5552dd]/20 md:py-4 md:text-lg md:px-8"
                  >
                    Registrarme
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80"
            alt="Equipo trabajando en análisis"
          />
        </div>
      </div>

      {/* Sección de Características */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-[#5552dd] font-semibold tracking-wide uppercase">
              Características
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Todo lo que necesitas para tener éxito
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#5552dd] text-white">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  Análisis Avanzado
                </p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Obtén información detallada sobre el rendimiento de tu tienda con nuestras herramientas de análisis.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#5552dd] text-white">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  Gestión de Inventario
                </p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Gestiona eficientemente tu inventario en múltiples listados y almacenes.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#5552dd] text-white">
                  <Users className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  Consultoría Experta
                </p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Recibe asesoramiento personalizado de nuestro equipo de expertos en MercadoLibre.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#5552dd] text-white">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  Estrategia de Crecimiento
                </p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Desarrolla e implementa estrategias para escalar tu negocio efectivamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
