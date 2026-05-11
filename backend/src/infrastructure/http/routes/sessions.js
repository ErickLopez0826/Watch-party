import { Router } from 'express';
import { SessionController } from '../controllers/SessionController.js';

export function sessionsRouter(db) {
  const router = Router();
  const ctrl = new SessionController(db);

  router.patch('/:id/finish', (req, res) => ctrl.finish(req, res));
  router.patch('/:id/update', (req, res) => ctrl.update(req, res));
  router.get('/history', (req, res) => ctrl.history(req, res));

  return router;
}
