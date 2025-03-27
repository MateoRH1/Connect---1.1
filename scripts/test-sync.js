import { supabase } from '../src/lib/supabase/client.js'
import { mercadolibreSync } from '../src/lib/mercadolibre/sync.js'

async function testSync() {
  const { data: account, error } = await supabase
    .from('mercadolibre_accounts')
    .select('*')
    .limit(1)
    .single()

  if (!account || error) throw new Error('No hay cuentas disponibles')
  
  console.log('Probando cuenta:', account.id)
  
  try {
    await mercadolibreSync.syncAccount(account.id) // Nombre de método actualizado
    console.log('Sync completado')
  } catch (error) {
    console.error('Sync fallido:', error)
    process.exit(1)
  }
}

testSync()
