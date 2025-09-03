import { loadEnv } from './config/env.js';
import { connectMongo } from './db/mongo.js';
import { createHttpServer } from './server.js';
import { startImapWorker } from './imap/worker.js';

async function main() {
  loadEnv();

  await connectMongo();

  const { app, server } = await createHttpServer();

  // Start IMAP background worker
  startImapWorker().catch((err) => {
    console.error('IMAP worker failed:', err);
  });

  const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
  server.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
