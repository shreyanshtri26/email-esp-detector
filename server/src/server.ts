import http from 'http';
import express from 'express';
import cors from 'cors';
import sessionsRouter from './routes/sessions.js';
import emailsRouter from './routes/emails.js';

export async function createHttpServer() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  app.use('/api/sessions', sessionsRouter);
  app.use('/api/emails', emailsRouter);

  const server = http.createServer(app);
  return { app, server };
}
