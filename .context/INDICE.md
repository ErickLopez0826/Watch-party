# Índice de Documentación — Watch Party App

## Estructura del proyecto

```
Watch party/
├── backend/               ← Node.js + Express + Socket.io (Onion)
│   ├── src/
│   │   ├── domain/        ← Entidades + interfaces + servicios
│   │   ├── application/   ← Casos de uso
│   │   └── infrastructure/← DB (SQLite), HTTP (Express), WS (Socket.io)
│   ├── data/              ← watch_party.db (SQLite)
│   └── index.js
│
├── frontend/              ← React 18 + TypeScript + Vite (Onion)
│   └── src/
│       ├── domain/        ← Tipos TypeScript
│       ├── application/   ← Zustand store + hooks
│       ├── infrastructure/← Socket client + API fetch
│       └── presentation/  ← Componentes + Pantallas + Layout
│
└── .context/              ← Documentación del proyecto
    ├── architecture/      ← Arquitectura Onion detallada
    ├── business/          ← Reglas de negocio, casos de uso, flujos
    ├── database/          ← Esquema y queries
    ├── api/               ← Endpoints REST + eventos WebSocket
    └── design/            ← Design system + componentes
```

## Documentos disponibles

| Documento | Ruta | Descripción |
|-----------|------|-------------|
| Arquitectura Onion | `.context/architecture/ARQUITECTURA_ONION.md` | Capas, dependencias, flujo de datos |
| Reglas de negocio | `.context/business/REGLAS_DE_NEGOCIO.md` | Validaciones, límites, comportamientos |
| Casos de uso | `.context/business/CASOS_DE_USO.md` | UC-01 a UC-08 detallados |
| Flujo de usuario | `.context/business/FLUJO_DE_USUARIO.md` | Mapa de pantallas + escenario típico |
| Esquema de BD | `.context/database/ESQUEMA_BD.md` | Tablas, columnas, queries |
| Endpoints REST | `.context/api/ENDPOINTS.md` | Todos los endpoints con ejemplos |
| Eventos WebSocket | `.context/api/WEBSOCKET_EVENTS.md` | Eventos cliente↔servidor + WebRTC |
| Design System | `.context/design/DESIGN_SYSTEM.md` | Tokens CSS, tipografía, componentes |
| Inventario componentes | `.context/design/COMPONENTES.md` | Props y uso de cada componente |
| Resumen ejecutivo | `.context/RESUMEN_EJECUTIVO.md` | Fases, stack, checklist |
| Prompt de diseño | `.context/PROMPT_CANVA_DESIGN.md` | Para generar mockups en Canva/Figma |

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + TypeScript + Vite + Zustand |
| Backend | Node.js + Express + Socket.io |
| Base de datos | SQLite (better-sqlite3) |
| WebRTC | navigator.mediaDevices + RTCPeerConnection |
| Deploy frontend | Vercel |
| Deploy backend | Render.com |

## Comandos de inicio rápido

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (en otra terminal)
cd frontend && npm install && npm run dev
```

Frontend disponible en `http://localhost:5173`  
Backend disponible en `http://localhost:3001`
