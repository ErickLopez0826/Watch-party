import { IRoomRepository } from '../../../domain/repositories/IRoomRepository.js';
import { Room } from '../../../domain/entities/Room.js';

export class RoomRepository extends IRoomRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  _toEntity(row) {
    if (!row) return null;
    const room = new Room({
      id: row.id,
      code: row.code,
      creatorName: row.creator_name,
      users: JSON.parse(row.users),
      state: row.state,
      createdAt: new Date(row.created_at),
    });
    room.sharingUser = row.sharing_user || null;
    return room;
  }

  findByCode(code) {
    const row = this.db.prepare('SELECT * FROM rooms WHERE code = ?').get(code);
    return this._toEntity(row);
  }

  findById(id) {
    const row = this.db.prepare('SELECT * FROM rooms WHERE id = ?').get(id);
    return this._toEntity(row);
  }

  save(room) {
    this.db.prepare(`
      INSERT INTO rooms (id, code, creator_name, users, state, sharing_user, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        users        = excluded.users,
        state        = excluded.state,
        sharing_user = excluded.sharing_user
    `).run(
      room.id,
      room.code,
      room.creatorName,
      JSON.stringify(room.users),
      room.state,
      room.sharingUser,
      room.createdAt.toISOString(),
    );
  }

  delete(id) {
    this.db.prepare('DELETE FROM rooms WHERE id = ?').run(id);
  }
}
