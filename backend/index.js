import { createApp } from './src/infrastructure/http/app.js';
import { createSocketHandler } from './src/infrastructure/websocket/SocketHandler.js';
import { createDatabase } from './src/infrastructure/database/SQLiteAdapter.js';
import { runMigrations } from './src/infrastructure/database/migrations.js';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const IS_PROD = process.env.NODE_ENV === 'production';

const db = createDatabase(process.env.DATABASE_PATH);
runMigrations(db);

// In production the backend serves the built frontend from frontend/dist/
const staticDir = IS_PROD ? join(__dir, '../frontend/dist') : null;

const app = createApp(db, staticDir);
const httpServer = createServer(app);
createSocketHandler(httpServer, db);

httpServer.listen(PORT, () => {
  console.log(`Watch Party server running on http://localhost:${PORT} [${IS_PROD ? 'production' : 'development'}]`);
});
