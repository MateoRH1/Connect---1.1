import { supabase } from './src/lib/supabase';
import { fetchProducts } from './src/lib/mercadolibre/products';

async function main() {
  const clientId = 'b2925be6-a002-4176-af1b-3ed3e7becbe7';

  try {
    // Get the client's MercadoLibre account
    const { data: account, error } = await supabase
      .from('mercadolibre_accounts')
      .select('*')
      .eq('user_id', clientId)
      .single();

    if (error) throw error;
    if (!account) throw new Error('No MercadoLibre account found for this client');

    console.log('Starting product sync for client:', clientId);
    
    // Fetch and sync products
    await fetchProducts(account.access_token, clientId);

    // Verify the products were inserted
    const { data: products, count } = await supabase
      .from('mercadolibre_products')
      .select('*', { count: 'exact' })
      .eq('client_id', clientId);

    console.log(`Successfully synced ${count} products for client ${clientId}`);
    console.log('Sample product:', products[0]);
  } catch (error) {
    console.error('Error syncing products:', error);
    process.exit(1);
  }
}

main().catch(console.error);
