# Reglas de Negocio — Watch Party App

## Usuarios

| Regla | Detalle |
|-------|---------|
| Nombre mínimo | 2 caracteres |
| Nombre máximo | 20 caracteres |
| Sin registro | No hay cuentas. El nombre es solo para la sesión |
| Máximo por sala | 3 usuarios simultáneos |
| Colores asignados | Slot 0 → rojo #E50914 · Slot 1 → púrpura #8B5CF6 · Slot 2 → azul #3B82F6 |

## Salas

| Regla | Detalle |
|-------|---------|
| Código de sala | 6 caracteres alfanuméricos en mayúsculas (generado con crypto random) |
| Estados posibles | `waiting` → `live` → `closed` |
| Capacidad máxima | 3 usuarios |
| Sala vacía | Si todos salen, la sala se marca como `closed` automáticamente |
| Código único | No puede repetirse en salas activas |

## Compartir pantalla

| Regla | Detalle |
|-------|---------|
| Solo un compartidor | En cualquier momento, máximo 1 usuario puede compartir |
| Tecnología | WebRTC (navigator.mediaDevices.getDisplayMedia) |
| Señalización | Socket.io relay (sin TURN server para v1) |
| Al detener | El estado de la sala vuelve a `waiting` |

## Sesiones de watch

| Regla | Detalle |
|-------|---------|
| Se inicia al compartir | Automáticamente cuando alguien empieza a compartir |
| Se finaliza manualmente | El usuario presiona "Terminar sesión" |
| Duración | Calculada automáticamente (endedAt - startedAt) |
| Formulario obligatorio | Título + Tipo + Rating son requeridos para guardar |

## Formulario de sesión

| Campo | Regla |
|-------|-------|
| Título | Obligatorio, máx. 100 caracteres |
| Tipo | `serie` o `pelicula`, obligatorio |
| Capítulos | Opcional (ej: "S01E01-E03") |
| ¿Dónde pararon? | Opcional (ej: "S01E03 min 45:30") |
| Rating | Obligatorio, entero entre 1 y 5 |
| Notas | Opcional, texto libre |

## Chat

| Regla | Detalle |
|-------|---------|
| Mensajes en tiempo real | Via Socket.io |
| Longitud máxima | 300 caracteres por mensaje |
| Sin historial persistido | Los mensajes viven solo mientras dura la sesión |
| Reacciones rápidas | 😍 😂 🤔 👍 🔥 (se envían como mensajes normales) |

## Historial

| Regla | Detalle |
|-------|---------|
| Persiste en SQLite | Solo sesiones finalizadas (con endedAt) aparecen |
| Orden | Descendente por fecha de finalización |
| Acceso | Desde Home (sin estar en sala) o desde Sala Esperando |
