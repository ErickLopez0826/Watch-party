export function runMigrations(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS rooms (
      id          TEXT PRIMARY KEY,
      code        TEXT UNIQUE NOT NULL,
      creator_name TEXT NOT NULL,
      users       TEXT NOT NULL DEFAULT '[]',
      state       TEXT NOT NULL DEFAULT 'waiting',
      sharing_user TEXT,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );`);

  // Add user_colors column if it doesn't exist (idempotent migration)
  const hasUserColors = db.prepare("PRAGMA table_info(rooms)").all().some(col => col.name === 'user_colors');
  if (!hasUserColors) {
    db.exec("ALTER TABLE rooms ADD COLUMN user_colors TEXT NOT NULL DEFAULT '{}'");
  }

  db.exec(`

    CREATE TABLE IF NOT EXISTS watch_sessions (
      id               TEXT PRIMARY KEY,
      room_id          TEXT NOT NULL,
      title            TEXT,
      type             TEXT,
      chapters         TEXT,
      shared_by        TEXT NOT NULL,
      users_present    TEXT NOT NULL DEFAULT '[]',
      started_at       TEXT NOT NULL DEFAULT (datetime('now')),
      ended_at         TEXT,
      duration_minutes INTEGER,
      stop_at          TEXT,
      rating           INTEGER CHECK(rating BETWEEN 1 AND 5),
      notes            TEXT,
      FOREIGN KEY (room_id) REFERENCES rooms(id)
    );
  `);
}
