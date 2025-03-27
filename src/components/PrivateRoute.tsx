import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { mercadolibre } from '../lib/mercadolibre';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('client' | 'consultant')[];
  requiresMercadoLibre?: boolean;
}

// Changed to named export
export function PrivateRoute({ children, allowedRoles, requiresMercadoLibre = false }: PrivateRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [isMercadoLibreConnected, setIsMercadoLibreConnected] = React.useState<boolean | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = React.useState(requiresMercadoLibre);

  React.useEffect(() => {
    const checkMercadoLibreConnection = async () => {
      if (!user || !requiresMercadoLibre || user.role !== 'client') {
        setIsCheckingConnection(false);
        return;
      }

      try {
        if (location.pathname === '/connect-mercadolibre') {
          setIsMercadoLibreConnected(false);
          setIsCheckingConnection(false);
          return;
        }

        const cachedStatus = mercadolibre.getConnectionStatus();
        if (cachedStatus) {
          setIsMercadoLibreConnected(true);
          setIsCheckingConnection(false);
          return;
        }

        const [account, authCode] = await Promise.all([
          mercadolibre.getUserAccount(user.id),
          mercadolibre.getLatestAuthCode(user.id)
        ]);

        const isConnected = !!account || !!authCode;
        setIsMercadoLibreConnected(isConnected);
        mercadolibre.setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      } catch (error) {
        console.error('Error checking MercadoLibre connection:', error);
        setIsMercadoLibreConnected(false);
        mercadolibre.clearConnectionStatus();
      } finally {
        setIsCheckingConnection(false);
      }
    };

    checkMercadoLibreConnection();
  }, [user, requiresMercadoLibre, location.pathname]);

  if (isLoading || (requiresMercadoLibre && isCheckingConnection)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiresMercadoLibre && user.role === 'client' && !isMercadoLibreConnected) {
    if (location.pathname !== '/connect-mercadolibre') {
      return <Navigate to="/connect-mercadolibre" replace />;
    }
  }

  return <>{children}</>;
}
