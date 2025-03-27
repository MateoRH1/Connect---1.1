import { testDatabaseConnection } from './src/lib/test-connection.js';

async function main() {
  console.log('Testing database connection...');
  const result = await testDatabaseConnection();
  console.log('Connection result:', result);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
