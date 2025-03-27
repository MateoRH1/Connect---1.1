import { MercadoLibreAuth } from './auth';
import { supabase } from '../supabase';
import { mercadolibreSync } from './sync';

class MercadoLibreService {
  private auth: MercadoLibreAuth;

  constructor() {
    this.auth = new MercadoLibreAuth();
    // Ensure proper initialization
    mercadolibreSync.startDailySync();
  }

  redirectToAuth = () => this.auth.redirectToAuth();
  exchangeCodeForToken = (code: string, userId: string) => this.auth.exchangeCodeForToken(code, userId);
  getLatestAuthCode = (userId: string) => this.auth.getLatestAuthCode(userId);
  getUserAccount = (userId: string) => this.auth.getUserAccount(userId);
  getConnectionStatus = () => this.auth.getConnectionStatus();
  setConnectionStatus = (status: 'connected' | 'disconnected') => this.auth.setConnectionStatus(status);
  clearConnectionStatus = () => this.auth.clearConnectionStatus();
}

export const mercadolibre = new MercadoLibreService();
