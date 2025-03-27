import { supabase } from '@/lib/supabase/client.js'
import { MercadoLibreAccount } from '@/lib/mercadolibre/types'

class MercadoLibreSync {
  syncSpecificAccount = async (accountId: string) => {
    try {
      console.log('Iniciando sync para cuenta:', accountId)
      
      const { data: account, error } = await supabase
        .from('mercadolibre_accounts')
        .select('*')
        .eq('id', accountId)
        .single()

      if (error || !account) throw error
      
      const productIds = await this.getAllItems(account)
      console.log(`Productos a sincronizar: ${productIds.length}`)
      
    } catch (error) {
      console.error('Error en syncSpecificAccount:', error)
      throw error
    }
  }

  private getAllItems = async (account: MercadoLibreAccount) => {
    const items = []
    let offset = 0
    const limit = 50

    while (true) {
      const response = await fetch(
        `https://api.mercadolibre.com/users/${account.account_id}/items/search` +
        `?access_token=${account.access_token}&offset=${offset}&limit=${limit}`
      )
      
      const data = await response.json()
      items.push(...data.results)
      if (offset + limit >= data.paging.total) break
      offset += limit
    }
    
    return items
  }
}

export const mercadolibreSync = new MercadoLibreSync()
