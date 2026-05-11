import { Router } from 'express';
import { RoomController } from '../controllers/RoomController.js';

export function roomsRouter(db) {
  const router = Router();
  const ctrl = new RoomController(db);

  router.post('/', (req, res) => ctrl.create(req, res));
  router.post('/:code/join', (req, res) => ctrl.join(req, res));
  router.get('/:code', (req, res) => ctrl.get(req, res));

  return router;
}
