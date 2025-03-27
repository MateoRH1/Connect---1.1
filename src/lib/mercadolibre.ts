import { supabase } from './supabase';
import { MERCADOLIBRE_CONFIG } from '../config/mercadolibre';
import type { MercadoLibreAccount } from '../types';

class MercadoLibreService {
  private connectionStatusKey = 'ml_connection_status';
  private authStateKey = 'ml_auth_state';

  redirectToAuth(): void {
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem(this.authStateKey, state);
    
    const authUrl = `${MERCADOLIBRE_CONFIG.authUrl}?response_type=code&client_id=${MERCADOLIBRE_CONFIG.clientId}&redirect_uri=${MERCADOLIBRE_CONFIG.redirectUri}&state=${state}`;
    window.location.href = authUrl;
  }

  async exchangeCodeForToken(code: string, userId: string): Promise<void> {
    try {
      const { error: authCodeError } = await supabase
        .from('mercadolibre_auth_codes')
        .insert({
          user_id: userId,
          code: code,
          created_at: new Date().toISOString()
        });

      if (authCodeError) {
        throw authCodeError;
      }

      this.setConnectionStatus('connected');
      sessionStorage.removeItem(this.authStateKey);
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  }

  async getLatestAuthCode(userId: string) {
    try {
      const { data, error } = await supabase
        .from('mercadolibre_auth_codes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting latest auth code:', error);
      return null;
    }
  }

  async getUserAccount(userId: string): Promise<MercadoLibreAccount | null> {
    try {
      const { data, error } = await supabase
        .from('mercadolibre_accounts')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting user account:', error);
      return null;
    }
  }

  getConnectionStatus(): boolean {
    return sessionStorage.getItem(this.connectionStatusKey) === 'connected';
  }

  setConnectionStatus(status: 'connected' | 'disconnected'): void {
    sessionStorage.setItem(this.connectionStatusKey, status);
  }

  clearConnectionStatus(): void {
    sessionStorage.removeItem(this.connectionStatusKey);
  }

  getAuthState(): string | null {
    return sessionStorage.getItem(this.authStateKey);
  }

  clearAuthState(): void {
    sessionStorage.removeItem(this.authStateKey);
  }
}

export const mercadolibre = new MercadoLibreService();
