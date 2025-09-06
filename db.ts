// db.ts
import { Client } from 'pg';

// Você pode usar variáveis de ambiente aqui
const client = new Client({
  host: '100.75.181.14',
  port: 5435,
  user: 'postgres',
  password: 'secret',
  database: 'rag'
});

export async function connectDB() {
  try {
    await client.connect();
    console.log('🟢 Conectado ao PostgreSQL com sucesso!');
  } catch (err) {
    console.error('🔴 Erro ao conectar ao PostgreSQL:', err);
    process.exit(1);
  }
}

export { client };

