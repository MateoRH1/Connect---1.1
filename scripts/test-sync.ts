import { supabase } from '@/lib/supabase/client.js'
import { mercadolibreSync } from '@/lib/mercadolibre/sync'

async function testSync() {
  const { data: account, error } = await supabase
    .from('mercadolibre_accounts')
    .select('*')
    .limit(1)
    .single()

  if (!account || error) throw new Error('No hay cuentas disponibles')
  
  console.log('Probando cuenta:', account.id)
  
  try {
    await mercadolibreSync.syncSpecificAccount(account.id)
    console.log('Sync completado')
  } catch (error) {
    console.error('Sync fallido:', error)
    process.exit(1)
  }
}

testSync()
