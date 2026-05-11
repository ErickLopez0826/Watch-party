import express from 'express';
import cors from 'cors';
import { roomsRouter } from './routes/rooms.js';
import { sessionsRouter } from './routes/sessions.js';

export function createApp(db) {
  const app = express();

  // Allow any origin in dev (no FRONTEND_URL set); lock to specific origin in prod
  app.use(cors({ origin: process.env.FRONTEND_URL ?? true, credentials: true }));
  app.use(express.json());

  app.use('/api/rooms', roomsRouter(db));
  app.use('/api/sessions', sessionsRouter(db));

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  return app;
}
