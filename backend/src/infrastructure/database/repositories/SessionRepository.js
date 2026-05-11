import { ISessionRepository } from '../../../domain/repositories/ISessionRepository.js';
import { WatchSession } from '../../../domain/entities/WatchSession.js';

export class SessionRepository extends ISessionRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  _toEntity(row) {
    if (!row) return null;
    return new WatchSession({
      id: row.id,
      roomId: row.room_id,
      title: row.title,
      type: row.type,
      chapters: row.chapters,
      sharedBy: row.shared_by,
      usersPresent: JSON.parse(row.users_present),
      startedAt: row.started_at ? new Date(row.started_at) : new Date(),
      endedAt: row.ended_at ? new Date(row.ended_at) : null,
      durationMinutes: row.duration_minutes,
      stopAt: row.stop_at,
      rating: row.rating,
      notes: row.notes,
    });
  }

  save(session) {
    this.db.prepare(`
      INSERT INTO watch_sessions (
        id, room_id, title, type, chapters, shared_by, users_present,
        started_at, ended_at, duration_minutes, stop_at, rating, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title            = excluded.title,
        type             = excluded.type,
        chapters         = excluded.chapters,
        ended_at         = excluded.ended_at,
        duration_minutes = excluded.duration_minutes,
        stop_at          = excluded.stop_at,
        rating           = excluded.rating,
        notes            = excluded.notes
    `).run(
      session.id,
      session.roomId,
      session.title,
      session.type,
      session.chapters,
      session.sharedBy,
      JSON.stringify(session.usersPresent),
      session.startedAt?.toISOString(),
      session.endedAt?.toISOString() ?? null,
      session.durationMinutes,
      session.stopAt,
      session.rating,
      session.notes,
    );
  }

  updateMetadata(session) {
    this.db.prepare(`
      UPDATE watch_sessions
      SET title = ?, type = ?, chapters = ?, stop_at = ?, rating = ?, notes = ?
      WHERE id = ?
    `).run(
      session.title,
      session.type,
      session.chapters,
      session.stopAt,
      session.rating,
      session.notes,
      session.id,
    );
  }

  findById(id) {
    const row = this.db.prepare('SELECT * FROM watch_sessions WHERE id = ?').get(id);
    return this._toEntity(row);
  }

  findAll() {
    const rows = this.db.prepare(
      'SELECT * FROM watch_sessions WHERE ended_at IS NOT NULL ORDER BY ended_at DESC'
    ).all();
    return rows.map(r => this._toEntity(r));
  }

  findAllByUser(name) {
    const rows = this.db.prepare(
      'SELECT * FROM watch_sessions WHERE users_present LIKE ? AND ended_at IS NOT NULL ORDER BY ended_at DESC'
    ).all(`%${name}%`);
    return rows.map(r => this._toEntity(r));
  }
}
