import { mercadolibreSync } from './src/lib/mercadolibre/sync.js';

async function main() {
  const accountId = 'b2925be6-a002-4176-af1b-3ed3e7becbe7';
  console.log(`Starting sync for account ${accountId}...`);
  await mercadolibreSync.syncSpecificAccount(accountId);
  console.log('Sync completed');
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
