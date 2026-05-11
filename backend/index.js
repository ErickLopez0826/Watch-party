import { createApp } from './src/infrastructure/http/app.js';
import { createSocketHandler } from './src/infrastructure/websocket/SocketHandler.js';
import { createDatabase } from './src/infrastructure/database/SQLiteAdapter.js';
import { runMigrations } from './src/infrastructure/database/migrations.js';
import { createServer } from 'node:http';

const PORT = process.env.PORT || 3001;

const db = createDatabase();
runMigrations(db);

const app = createApp(db);
const httpServer = createServer(app);
createSocketHandler(httpServer, db);

httpServer.listen(PORT, () => {
  console.log(`Watch Party server running on http://localhost:${PORT}`);
});
