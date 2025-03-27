import { mercadolibreSync } from './sync';
import { supabase } from '../supabase';

async function testSync() {
  try {
    // 1. Obtener una cuenta de prueba
    const { data: testAccount, error: accountError } = await supabase
      .from('mercadolibre_accounts')
      .select('*')
      .limit(1)
      .single();

    if (accountError) throw accountError;
    if (!testAccount) {
      console.error('No hay cuentas para probar');
      return;
    }

    console.log('Cuenta seleccionada para prueba:', {
      id: testAccount.id,
      user_id: testAccount.user_id,
      last_sync: testAccount.last_sync
    });

    // 2. Ejecutar sincronización manual
    console.log('\nIniciando prueba de sincronización...');
    await mercadolibreSync.syncAccount(testAccount);
    
    // 3. Obtener cuenta actualizada
    const { data: updatedAccount } = await supabase
      .from('mercadolibre_accounts')
      .select('last_sync')
      .eq('id', testAccount.id)
      .single();

    // 4. Verificar resultados
    const { data: products, error: productsError } = await supabase
      .from('mercadolibre_products')
      .select('*')
      .eq('client_id', testAccount.user_id);

    if (productsError) throw productsError;

    console.log('\nResultados de la prueba:');
    console.log('- Cuenta procesada:', testAccount.id);
    console.log('- Productos sincronizados:', products?.length || 0);
    console.log('- Última sincronización:', updatedAccount?.last_sync);
    
    if (products && products.length > 0) {
      console.log('\nEjemplo de producto sincronizado:');
      console.log({
        id: products[0].id,
        title: products[0].title,
        price: products[0].price,
        status: products[0].status
      });
    }
  } catch (error) {
    console.error('Error durante la prueba de sincronización:', error);
  }
}

// Ejecutar la prueba
testSync()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
