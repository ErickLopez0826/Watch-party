# Eventos WebSocket (Socket.io) — Watch Party App

**URL:** `ws://localhost:3001`  
**Transporte:** Socket.io v4 con CORS para `http://localhost:5173`

---

## Convención de nombres

`entidad:accion` — emit del cliente inicia la acción.  
El servidor puede re-emitir a la sala completa (`io.to(code).emit`).

---

## Eventos que emite el CLIENTE → servidor

| Evento           | Payload                          | Descripción                          |
|------------------|----------------------------------|--------------------------------------|
| `room:join`      | `{ code, userName }`             | Entrar a sala (después de API call)  |
| `room:leave`     | ninguno                          | Salir de sala                        |
| `share:start`    | ninguno                          | Iniciar compartición de pantalla     |
| `share:stop`     | ninguno                          | Detener compartición                 |
| `chat:message`   | `{ text }`                       | Enviar mensaje de chat               |
| `webrtc:offer`   | `{ target, offer }`              | SDP offer para WebRTC                |
| `webrtc:answer`  | `{ answer }`                     | SDP answer para WebRTC               |
| `webrtc:ice`     | `{ candidate }`                  | ICE candidate para WebRTC            |

---

## Eventos que emite el SERVIDOR → cliente(s)

| Evento           | Destinatario     | Payload                                    | Cuándo                           |
|------------------|------------------|--------------------------------------------|----------------------------------|
| `room:updated`   | toda la sala     | `Room` (objeto completo)                   | Cualquier cambio en la sala      |
| `session:started`| toda la sala     | `{ sessionId }`                            | Al iniciar compartición          |
| `chat:message`   | toda la sala     | `{ userName, text, time }`                 | Cuando alguien envía un mensaje  |
| `error`          | el socket origen | `{ message }`                              | Error en operación               |
| `webrtc:offer`   | toda la sala     | `{ from, offer }`                          | Relay de SDP offer               |
| `webrtc:answer`  | toda la sala     | `{ from, answer }`                         | Relay de SDP answer              |
| `webrtc:ice`     | toda la sala     | `{ from, candidate }`                      | Relay de ICE candidate           |

---

## Flujo de señalización WebRTC

```
A (comparte)          Servidor            B y C (reciben)
     │                    │                    │
     │── webrtc:offer ───▶│── webrtc:offer ───▶│
     │                    │                    │
     │◀── webrtc:answer ──│◀── webrtc:answer ──│
     │                    │                    │
     │── webrtc:ice ──────▶── webrtc:ice ──────▶│
     │◀── webrtc:ice ─────│◀── webrtc:ice ──────│
```

El servidor es un **relay puro** — no procesa el contenido WebRTC, solo lo reenvía dentro de la sala.

---

## Gestión de desconexión

Cuando un socket se desconecta (`disconnect`):
1. El servidor ejecuta `roomService.leaveRoom(currentRoom, currentUser)`
2. Si la sala queda vacía → estado `closed`
3. El resto de usuarios recibe `room:updated` con la sala actualizada
