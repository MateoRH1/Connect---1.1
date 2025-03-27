import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { BarChart, TrendingUp, DollarSign, Clock, AlertCircle, MinusCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { mercadolibre } from '../lib/mercadolibre';
import { supabase } from '../lib/supabase';

export function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [showOverlay, setShowOverlay] = React.useState(false);
  const [accountStatus, setAccountStatus] = React.useState<'pending' | 'active' | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Filtro de fechas (por defecto últimos 7 días)
  const [startDate, setStartDate] = React.useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = React.useState(() => new Date().toISOString().split('T')[0]);

  // Métricas de la tabla mercadolibre_orders
  const [ordersStats, setOrdersStats] = React.useState({
    totalFacturacion: 0,       // Suma de ingresos_productos
    totalUnidadesVendidas: 0,  // Suma de unidades
    totalCargosVenta: 0,       // Suma de cargo_venta_impuestos
    facturacionNeta: 0,        // totalFacturacion - totalCargosVenta
  });
  const [isOrdersLoading, setIsOrdersLoading] = React.useState(false);

  React.useEffect(() => {
    const checkAccountStatus = async () => {
      if (user) {
        try {
          const account = await mercadolibre.getUserAccount(user.id);
          const { data: authCode } = await mercadolibre.getLatestAuthCode(user.id);
          
          if (account) {
            setAccountStatus('active');
          } else if (authCode) {
            setAccountStatus('pending');
            setShowOverlay(location.state?.showActivationMessage);
          } else {
            setAccountStatus(null);
          }
        } catch (error) {
          console.error('Error checking account status:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkAccountStatus();
  }, [user, location.state?.showActivationMessage]);

  // Función para obtener métricas desde la tabla mercadolibre_orders
  const fetchOrdersMetrics = async () => {
    if (!user) return;
    setIsOrdersLoading(true);

    try {
      // Ajusta el nombre de la tabla y columnas según tu base de datos
      let query = supabase
        .from('mercadolibre_orders')
        .select('*')
        .eq('cuenta', user.id);  // <--- Ajustado a 'cuenta'

      // Filtramos por la columna "fecha"
      if (startDate) {
        query = query.gte('fecha', startDate);
      }
      if (endDate) {
        query = query.lte('fecha', endDate);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Suma de facturación (ingresos_productos)
      const totalFacturacion = data.reduce(
        (acc, order) => acc + (order.ingresos_productos || 0),
        0
      );
      // Unidades vendidas (unidades)
      const totalUnidadesVendidas = data.reduce(
        (acc, order) => acc + (order.unidades || 0),
        0
      );
      // Cargos por venta (cargo_venta_impuestos)
      const totalCargosVenta = data.reduce(
        (acc, order) => acc + (order.cargo_venta_impuestos || 0),
        0
      );
      // Facturación Neta
      const facturacionNeta = totalFacturacion - totalCargosVenta;

      setOrdersStats({
        totalFacturacion,
        totalUnidadesVendidas,
        totalCargosVenta,
        facturacionNeta
      });
    } catch (error) {
      console.error("Error fetching orders metrics:", error);
    } finally {
      setIsOrdersLoading(false);
    }
  };

  // Actualiza las métricas cada vez que cambian las fechas o el usuario
  React.useEffect(() => {
    fetchOrdersMetrics();
  }, [user, startDate, endDate]);

  // Construimos el arreglo de estadísticas
  // (Cargos por venta se muestra en rojo)
  const stats = [
    {
      label: 'Facturación',
      value: `$${ordersStats.totalFacturacion.toLocaleString()}`,
      icon: DollarSign,
      colorClass: 'text-gray-900',
    },
    {
      label: 'Unidades Vendidas',
      value: ordersStats.totalUnidadesVendidas.toLocaleString(),
      icon: TrendingUp,
      colorClass: 'text-gray-900',
    },
    {
      label: 'Cargos por venta',
      value: `$${ordersStats.totalCargosVenta.toLocaleString()}`,
      icon: MinusCircle,
      colorClass: 'text-red-600', // <--- color rojo
    },
    {
      label: 'Facturación Neta',
      value: `$${ordersStats.facturacionNeta.toLocaleString()}`,
      icon: BarChart,
      colorClass: 'text-gray-900',
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {showOverlay && accountStatus === 'pending' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 relative">
            <button
              onClick={() => setShowOverlay(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
            <div className="flex items-center justify-center mb-4">
              <Clock className="h-12 w-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">
              ¡Cuenta Conectada con Éxito!
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Tu dashboard estará completamente habilitado en las próximas 4 horas hábiles 
              mientras un operador procesa tu conexión con MercadoLibre.
            </p>
            <button
              onClick={() => setShowOverlay(false)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {accountStatus === 'pending' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Tu cuenta está pendiente de activación. Un operador está procesando tu conexión con MercadoLibre.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user?.email}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your store today.
          </p>
        </div>

        {/* Sección de filtro por fecha */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Filtrar por fecha</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Desde
              </label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hasta
              </label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="border border-gray-300 rounded-md p-2"
              />
            </div>
            <button
              onClick={fetchOrdersMetrics}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors self-center"
            >
              Aplicar Filtro
            </button>
          </div>
        </div>

        {/* Sección de métricas */}
        {isOrdersLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.label}
                        </dt>
                        <dd className="flex items-baseline">
                          {/* Aplicamos la clase de color si existe */}
                          <div className={`text-2xl font-semibold ${stat.colorClass}`}>
                            {stat.value}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
