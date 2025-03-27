import { supabase } from '../supabase/client.js'
import { MercadoLibreAccount } from './types.js'

class MercadoLibreSync {
  constructor() {
    this.syncAccount = this.syncAccount.bind(this)
  }

  async getAllItems(account) {
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

  async syncAccount(accountId) {
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
      
      // Resto de la implementación...
      
    } catch (error) {
      console.error('Error en syncAccount:', error)
      throw error
    }
  }
}

export const mercadolibreSync = new MercadoLibreSync()
