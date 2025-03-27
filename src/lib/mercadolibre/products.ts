import { makeApiRequest } from './api';
import { supabase } from '../supabase';

interface MercadoLibreProduct {
  id: string;
  title: string;
  price: number;
  available_quantity: number;
  category_id: string;
  thumbnail: string;
  attributes: {
    id: string;
    name: string;
    value_name: string;
  }[];
}

export async function fetchProducts(accessToken: string, userId: string) {
  try {
    const items = await makeApiRequest<{ results: string[] }>({
      path: `/users/${userId}/items/search`,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const batchSize = 50;
    for (let i = 0; i < items.results.length; i += batchSize) {
      const batch = items.results.slice(i, i + batchSize);
      const products = await Promise.all(
        batch.map(id => getProductDetails(accessToken, id))
      );

      const { error } = await supabase
        .from('mercadolibre_products')
        .upsert(products.map(p => ({
          ...p,
          client_id: userId,
          last_updated: new Date().toISOString()
        })));

      if (error) throw error;
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

async function getProductDetails(accessToken: string, productId: string) {
  const product = await makeApiRequest<MercadoLibreProduct>({
    path: `/items/${productId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return {
    mla: product.id,
    title: product.title,
    price: product.price,
    available_quantity: product.available_quantity,
    category_id: product.category_id,
    thumbnail: product.thumbnail,
    brand: product.attributes.find(a => a.id === 'BRAND')?.value_name || '',
    model: product.attributes.find(a => a.id === 'MODEL')?.value_name || '',
    attributes: product.attributes
  };
}
