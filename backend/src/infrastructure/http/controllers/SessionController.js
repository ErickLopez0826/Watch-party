import { SessionService } from '../../../domain/services/SessionService.js';
import { SessionRepository } from '../../database/repositories/SessionRepository.js';
import { EndSession } from '../../../application/use-cases/EndSession.js';
import { UpdateSession } from '../../../application/use-cases/UpdateSession.js';
import { GetHistory } from '../../../application/use-cases/GetHistory.js';

export class SessionController {
  constructor(db) {
    const repo = new SessionRepository(db);
    const service = new SessionService(repo);
    this.endSession = new EndSession(service);
    this.updateSession = new UpdateSession(service);
    this.getHistory = new GetHistory(service);
  }

  async finish(req, res) {
    try {
      const { id } = req.params;
      const session = await this.endSession.execute(id, req.body);
      res.json(session.toJSON());
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const session = await this.updateSession.execute(id, req.body);
      res.json(session.toJSON());
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async history(req, res) {
    try {
      const sessions = await this.getHistory.execute();
      res.json(sessions.map(s => s.toJSON()));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
