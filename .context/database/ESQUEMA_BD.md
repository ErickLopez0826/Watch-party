# Esquema de Base de Datos — Watch Party App

**Motor:** SQLite (via better-sqlite3)  
**Archivo:** `backend/data/watch_party.db`  
**Config:** WAL mode + foreign keys ON

---

## Tabla: `rooms`

| Columna       | Tipo    | Descripción                                 |
|---------------|---------|---------------------------------------------|
| `id`          | TEXT PK | UUID v4                                     |
| `code`        | TEXT    | Único, 6 chars mayúsculas, índice           |
| `creator_name`| TEXT    | Nombre del usuario que creó la sala         |
| `users`       | TEXT    | JSON array de nombres `["A", "B", "C"]`     |
| `state`       | TEXT    | `waiting` / `live` / `closed`               |
| `sharing_user`| TEXT    | Nombre del usuario que comparte (o NULL)    |
| `created_at`  | TEXT    | ISO 8601 (datetime de SQLite)               |

### Notas
- `users` se serializa como JSON porque SQLite no tiene array nativo
- `state` podría ser un ENUM pero SQLite no lo enforce; la validación está en el dominio
- La sala se mantiene aunque esté `closed` (historial de referencia)

---

## Tabla: `watch_sessions`

| Columna           | Tipo     | Descripción                                     |
|-------------------|----------|-------------------------------------------------|
| `id`              | TEXT PK  | UUID v4                                         |
| `room_id`         | TEXT FK  | Referencias `rooms.id`                          |
| `title`           | TEXT     | Título de la peli/serie (se llena al finalizar) |
| `type`            | TEXT     | `serie` / `pelicula`                            |
| `chapters`        | TEXT     | Ej: "S01E01-E03" (puede ser NULL)               |
| `shared_by`       | TEXT     | Nombre del usuario que compartió pantalla       |
| `users_present`   | TEXT     | JSON array de nombres de presentes              |
| `started_at`      | TEXT     | ISO 8601 — cuando inició el sharing             |
| `ended_at`        | TEXT     | ISO 8601 — NULL hasta que se guarda             |
| `duration_minutes`| INTEGER  | Calculado: (ended_at - started_at) en minutos   |
| `stop_at`         | TEXT     | Ej: "S01E03 min 45:30" (puede ser NULL)         |
| `rating`          | INTEGER  | 1-5, CHECK constraint                           |
| `notes`           | TEXT     | Texto libre, puede ser NULL                     |

### Notas
- Las sesiones en curso tienen `ended_at = NULL`
- El historial solo muestra sesiones donde `ended_at IS NOT NULL`
- `duration_minutes` se calcula en la entidad `WatchSession.finish()`

---

## Migraciones

Archivo: `backend/src/infrastructure/database/migrations.js`  
Las migraciones usan `CREATE TABLE IF NOT EXISTS` — idempotentes.  
Para versiones futuras, añadir ALTER TABLE aquí con guards manuales.

---

## Queries más usadas

```sql
-- Obtener sala por código
SELECT * FROM rooms WHERE code = ?;

-- Historial (solo finalizadas, más reciente primero)
SELECT * FROM watch_sessions 
WHERE ended_at IS NOT NULL 
ORDER BY ended_at DESC;

-- Sesión activa de una sala
SELECT * FROM watch_sessions 
WHERE room_id = ? AND ended_at IS NULL 
ORDER BY started_at DESC 
LIMIT 1;
```
