import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { 
  Eye, 
  Package, 
  TrendingUp, 
  Zap, 
  Box, 
  DollarSign,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { DashboardLayout } from '../layouts/DashboardLayout';

interface Product {
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

export function Publications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    totalPublications: 0,
    activePublications: 0,
    totalStock: 0,
    totalSales: 0
  });
  
  // Estados para los filtros
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSubCategory1, setFilterSubCategory1] = useState("");
  const [filterSubCategory2, setFilterSubCategory2] = useState("");

  useEffect(() => {
    let subscription: any;
    
    const fetchProducts = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('mercadolibre_products')
          .select('*')
          .eq('client_id', user.id);

        if (error) throw error;
        updateProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const updateProducts = (data: Product[]) => {
      setProducts(data);
      const totalPublications = data?.length || 0;
      const activePublications = data?.filter(p => p.estado.toLowerCase() === 'active').length || 0;
      const totalStock = data?.reduce((sum, p) => sum + p.cantidad_disponible, 0) || 0;
      const totalSales = data?.reduce((sum, p) => sum + p.ventas, 0) || 0;

      setStats({
        totalPublications,
        activePublications,
        totalStock,
        totalSales
      });
    };

    fetchProducts();

    if (user?.id) {
      subscription = supabase
        .channel('custom-all-channel')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'mercadolibre_products',
            filter: `client_id=eq.${user.id}`
          },
          () => fetchProducts()
        )
        .subscribe();
    }

    return () => subscription?.unsubscribe();
  }, [user?.id]);

  const handleViewMetrics = (productId: string) => {
    navigate(`/publications/${productId}`);
  };

  const StatusBadge = ({ estado, className }: { estado: string; className?: string }) => (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
      estado.toLowerCase() === 'active' 
        ? 'bg-green-100 text-green-700' 
        : 'bg-red-100 text-red-700'
    } ${className}`}>
      <div className={`h-2 w-2 rounded-full ${
        estado.toLowerCase() === 'active' ? 'bg-green-500' : 'bg-red-500'
      }`} />
      {estado}
    </span>
  );

  // Función para obtener las partes de la categoría
  const getCategoryParts = (categoria: string) => {
    const parts = categoria.split('>').map(p => p.trim());
    return {
      parent: parts[0] || "",
      sub1: parts[1] || "",
      sub2: parts[2] || ""
    };
  };

  // Opciones para cada filtro basadas en los productos disponibles
  const parentCategories = Array.from(
    new Set(products.map(product => getCategoryParts(product.categoria).parent))
  );
  const subCategory1Options = Array.from(
    new Set(
      products
        .map(product => getCategoryParts(product.categoria))
        .filter(parts => !filterCategory || parts.parent === filterCategory)
        .map(parts => parts.sub1)
    )
  ).filter(option => option);
  const subCategory2Options = Array.from(
    new Set(
      products
        .map(product => getCategoryParts(product.categoria))
        .filter(parts => (!filterCategory || parts.parent === filterCategory) && (!filterSubCategory1 || parts.sub1 === filterSubCategory1))
        .map(parts => parts.sub2)
    )
  ).filter(option => option);

  // Filtrar productos según los filtros seleccionados
  const filteredProducts = products.filter(product => {
    const { parent, sub1, sub2 } = getCategoryParts(product.categoria);
    if (filterCategory && parent !== filterCategory) return false;
    if (filterSubCategory1 && sub1 !== filterSubCategory1) return false;
    if (filterSubCategory2 && sub2 !== filterSubCategory2) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              Mis Publicaciones
            </h1>
            <p className="text-gray-500 mt-1">Administra y monitorea tus productos publicados</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="p-2.5 hover:bg-gray-50 rounded-xl transition-all"
          >
            <RefreshCw className={`h-5 w-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-primary/10 to-blue-50 p-5 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Publicaciones totales</p>
                <p className="text-2xl font-bold mt-1">{stats.totalPublications}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-100 to-green-50 p-5 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Activas</p>
                <p className="text-2xl font-bold mt-1">{stats.activePublications}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-5 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Box className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Stock total</p>
                <p className="text-2xl font-bold mt-1">{stats.totalStock.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-100 to-amber-50 p-5 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ventas totales</p>
                <p className="text-2xl font-bold mt-1">{stats.totalSales.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros de Categoría */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <select
              value={filterCategory}
              onChange={e => {
                setFilterCategory(e.target.value);
                setFilterSubCategory1("");
                setFilterSubCategory2("");
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Todas</option>
              {parentCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Subcategoría 1</label>
            <select
              value={filterSubCategory1}
              onChange={e => {
                setFilterSubCategory1(e.target.value);
                setFilterSubCategory2("");
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Todas</option>
              {subCategory1Options.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Subcategoría 2</label>
            <select
              value={filterSubCategory2}
              onChange={e => setFilterSubCategory2(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Todas</option>
              {subCategory2Options.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-pulse space-y-4">
              <div className="h-24 bg-gray-100 rounded-xl"></div>
              <div className="h-24 bg-gray-100 rounded-xl"></div>
              <div className="h-24 bg-gray-100 rounded-xl"></div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ventas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasa de Conversión</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.imagen_principal ? (
                        <img
                          src={product.imagen_principal.replace('http://', 'https://')}
                          alt={product.titulo}
                          className="h-12 w-12 object-cover rounded"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-100 flex items-center justify-center rounded">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-lg font-semibold truncate">{product.titulo}</div>
                        <div className="text-sm text-gray-500 truncate">{getCategoryParts(product.categoria).parent} &gt; {getCategoryParts(product.categoria).sub1} &gt; {getCategoryParts(product.categoria).sub2}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">${product.precio.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.cantidad_disponible}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.visitas}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.ventas}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{Math.round(product.tasa_conversion)}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge estado={product.estado} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewMetrics(product.id)}
                          className="px-3 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors text-xs flex items-center gap-1"
                        >
                          <TrendingUp className="h-4 w-4" />
                          Métricas
                        </button>
                        <a
                          href={product.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors text-xs flex items-center gap-1"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Producto
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
