# Arquitectura Onion — Watch Party App

## Concepto

La arquitectura onion organiza el código en capas concéntricas. Las capas internas no conocen las externas. Las dependencias siempre apuntan hacia adentro.

```
┌────────────────────────────────────────────────┐
│           Infrastructure (HTTP, DB, WS)         │
│  ┌──────────────────────────────────────────┐  │
│  │         Application (Use Cases)          │  │
│  │  ┌────────────────────────────────────┐  │  │
│  │  │    Domain (Entities + Services)    │  │  │
│  │  └────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
```

---

## Capas — Backend (`backend/src/`)

### 1. Domain (centro) — `domain/`
La lógica de negocio pura. Sin frameworks, sin base de datos.

| Subcarpeta       | Contenido                                 |
|------------------|-------------------------------------------|
| `entities/`      | Room, WatchSession — las reglas de negocio |
| `repositories/`  | Interfaces (contratos) IRoomRepository, ISessionRepository |
| `services/`      | RoomService, SessionService — orquestación de entidades |

**Regla:** nada de `import` hacia capas externas.

### 2. Application — `application/use-cases/`
Casos de uso concretos. Un caso de uso = una acción del usuario.

| Archivo          | Qué hace                          |
|------------------|-----------------------------------|
| `CreateRoom.js`  | Validar + crear sala              |
| `JoinRoom.js`    | Validar + unirse a sala           |
| `EndSession.js`  | Validar + guardar sesión terminada |
| `GetHistory.js`  | Recuperar historial de sesiones   |

**Regla:** solo depende de Domain.

### 3. Infrastructure (exterior) — `infrastructure/`
Implementaciones concretas. Aquí viven los detalles técnicos.

| Subcarpeta              | Contenido                                  |
|-------------------------|--------------------------------------------|
| `database/`             | SQLiteAdapter, migrations, repositorios    |
| `websocket/`            | SocketHandler (Socket.io)                  |
| `http/`                 | Express app, routes, controllers           |

**Regla:** implementa las interfaces de Domain. Puede depender de cualquier capa.

---

## Capas — Frontend (`frontend/src/`)

### 1. Domain — `domain/types.ts`
Tipos TypeScript compartidos. Sin lógica.

### 2. Application — `application/`
Estado global (Zustand) y hooks de casos de uso.

| Archivo                    | Qué hace                              |
|----------------------------|---------------------------------------|
| `store/useAppStore.ts`     | Estado global: screen, room, messages |
| `hooks/useRoom.ts`         | Crear/unirse/salir/compartir sala     |
| `hooks/useChat.ts`         | Enviar y recibir mensajes             |

### 3. Infrastructure — `infrastructure/`
Comunicación con el mundo exterior.

| Archivo                        | Qué hace                     |
|--------------------------------|------------------------------|
| `socket/socketClient.ts`       | Singleton de Socket.io-client |
| `api/roomApi.ts`               | Fetch a /api/rooms            |
| `api/sessionApi.ts`            | Fetch a /api/sessions         |

### 4. Presentation — `presentation/`
Componentes React puros de UI.

| Subcarpeta      | Contenido                                        |
|-----------------|--------------------------------------------------|
| `components/`   | WpAvatar, WpBtn, WpInput, WpStars, WpChat, etc. |
| `screens/`      | HomeScreen, WaitingRoomScreen, LiveRoomScreen, etc. |
| `layouts/`      | AppLayout (nav dots, screen wrapper)             |
| `constants/`    | USER_PALETTE, colores predefinidos               |

---

## Flujo de datos

```
Browser click → Screen → Hook (application) → API/Socket (infrastructure) → Backend
                                    ↓
                              Zustand Store
                                    ↓
                           Screen re-renders
```

---

## Dependencias entre capas

```
Presentation → Application → Infrastructure (frontend)
                    ↓
                 Domain (tipos compartidos)

HTTP/WS Controller → Use Case → Domain Service → Repository Interface
                                                       ↓ (implementado por)
                                              Infrastructure Repository
```
