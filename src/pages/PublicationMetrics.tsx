import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft,
  BarChart2,
  Eye,
  ShoppingCart,
  MessageCircle,
  TrendingUp
} from 'lucide-react';

interface ProductMetrics {
  id: string;
  titulo: string;
  precio: number;
  link: string;
  categoria: string;
  condicion: string;
  cantidad_disponible: number;
  estado: string;
  imagen_principal: string;
  ultima_actualizacion: string;
  visitas: number;
  ventas: number;
  preguntas: number;
  tasa_conversion: number;
}

export function PublicationMetrics() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<ProductMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data, error } = await supabase
          .from('mercadolibre_products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) throw error;
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [productId]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!metrics) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64 text-gray-500">
          <h3 className="text-xl font-medium">No se encontraron métricas para esta publicación</h3>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#5552dd] hover:text-[#4543bb]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a publicaciones
        </button>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <img
                src={metrics.imagen_principal.replace('http://', 'https://') + '?quality=100'}
                alt={metrics.titulo}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold text-gray-900">{metrics.titulo}</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-[#5552dd]" />
                    <p className="text-sm font-medium text-gray-500">Visitas</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{metrics.visitas}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-[#5552dd]" />
                    <p className="text-sm font-medium text-gray-500">Ventas</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{metrics.ventas}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-[#5552dd]" />
                    <p className="text-sm font-medium text-gray-500">Preguntas</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{metrics.preguntas}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[#5552dd]" />
                    <p className="text-sm font-medium text-gray-500">Conversión</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{metrics.tasa_conversion}%</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Categoría</p>
                  <p className="font-medium">{metrics.categoria}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Condición</p>
                  <p className="font-medium">{metrics.condicion}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Stock disponible</p>
                  <p className="font-medium">{metrics.cantidad_disponible}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Última actualización</p>
                  <p className="font-medium">
                    {new Date(metrics.ultima_actualizacion).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
