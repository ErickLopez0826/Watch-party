# API REST Endpoints — Watch Party App

**Base URL:** `http://localhost:3001/api`  
**Formato:** JSON en request y response  
**Autenticación:** Ninguna (app privada, 3 usuarios conocidos)

---

## Health Check

### `GET /health`
```json
{ "status": "ok" }
```

---

## Salas (`/api/rooms`)

### `POST /api/rooms` — Crear sala

**Body:**
```json
{ "userName": "ASTAROTH0826" }
```

**Response 201:**
```json
{
  "id": "uuid",
  "code": "A3F12C",
  "creatorName": "ASTAROTH0826",
  "users": ["ASTAROTH0826"],
  "state": "waiting",
  "sharingUser": null,
  "createdAt": "2026-05-10T21:00:00.000Z"
}
```

**Errores:**
- `400` — nombre inválido (< 2 o > 20 chars)

---

### `POST /api/rooms/:code/join` — Unirse a sala

**Body:**
```json
{ "userName": "Kinna" }
```

**Response 200:** mismo formato que crear sala (sala actualizada)

**Errores:**
- `400` — sala no encontrada / sala llena / sala cerrada / nombre inválido
- `404` — código no existe

---

### `GET /api/rooms/:code` — Obtener sala

**Response 200:** mismo formato que crear sala

**Errores:**
- `404` — sala no encontrada

---

## Sesiones (`/api/sessions`)

### `GET /api/sessions/history` — Historial completo

**Response 200:**
```json
[
  {
    "id": "uuid",
    "roomId": "uuid",
    "title": "The Last of Us",
    "type": "serie",
    "chapters": "S01E01-E03",
    "sharedBy": "ASTAROTH0826",
    "usersPresent": ["ASTAROTH0826", "Kinna", "Crujipunk"],
    "startedAt": "2026-05-10T21:00:00.000Z",
    "endedAt": "2026-05-10T23:15:00.000Z",
    "durationMinutes": 135,
    "stopAt": "S01E03 min 45:30",
    "rating": 5,
    "notes": "El final del E03 brutal."
  }
]
```

Solo retorna sesiones con `endedAt != null`, orden descendente.

---

### `PATCH /api/sessions/:id/finish` — Finalizar sesión

**Body:**
```json
{
  "title": "The Last of Us",
  "type": "serie",
  "chapters": "S01E01-E03",
  "stopAt": "S01E03 min 45:30",
  "rating": 5,
  "notes": "Brutal y hermoso."
}
```

**Response 200:** sesión completa (mismo formato de historial)

**Errores:**
- `400` — título vacío / tipo inválido / rating fuera de rango
- `404` — sesión no encontrada (id inválido)
