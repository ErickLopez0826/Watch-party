import { WatchSession } from '../entities/WatchSession.js';
import { randomUUID } from 'node:crypto';

export class SessionService {
  constructor(sessionRepository) {
    this.sessionRepository = sessionRepository;
  }

  async startSession(roomId, sharedBy, usersPresent) {
    const session = new WatchSession({
      id: randomUUID(),
      roomId,
      title: null,
      type: null,
      chapters: null,
      sharedBy,
      usersPresent,
    });
    await this.sessionRepository.save(session);
    return session;
  }

  async finishSession(sessionId, data) {
    const session = await this.sessionRepository.findById(sessionId);
    if (!session) throw new Error('Sesión no encontrada');
    session.finish(data);
    await this.sessionRepository.save(session);
    return session;
  }

  async updateMetadata(sessionId, data) {
    const session = await this.sessionRepository.findById(sessionId);
    if (!session) throw new Error('Sesión no encontrada');
    session.title = data.title;
    session.type = data.type;
    session.chapters = data.chapters;
    session.stopAt = data.stopAt;
    session.rating = data.rating;
    session.notes = data.notes;
    await this.sessionRepository.updateMetadata(session);
    return session;
  }

  async getHistory() {
    return this.sessionRepository.findAll();
  }
}
