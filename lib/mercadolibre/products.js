import { makeApiRequest } from './api.js';
import { supabase } from '../supabase.js';

export async function fetchProducts(accessToken: string, userId: string) {
  try {
    const products = await makeApiRequest({
      endpoint: '/items/search',
      accessToken,
      params: {
        seller_id: userId
      }
    });

    // Insert products into Supabase
    const { data, error } = await supabase
      .from('mercadolibre_products')
      .upsert(products.map(product => ({
        client_id: userId,
        mla: product.id,
        title: product.title,
        price: product.price,
        brand: product.attributes.find(attr => attr.id === 'BRAND')?.value_name || '',
        model: product.attributes.find(attr => attr.id === 'MODEL')?.value_name || '',
        last_updated: new Date().toISOString()
      })));

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}
