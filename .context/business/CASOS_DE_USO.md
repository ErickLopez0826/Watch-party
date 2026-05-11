# Casos de Uso — Watch Party App

## UC-01: Crear Sala

**Actor:** Usuario  
**Precondición:** Nombre de usuario válido (2-20 chars)  
**Flujo:**
1. Usuario ingresa su nombre en Home
2. Presiona "Crear Sala Nueva"
3. Sistema genera código único de 6 chars
4. Sistema crea la sala en DB con estado `waiting`
5. Socket conecta al usuario a la sala
6. Navega a pantalla Sala Esperando

**Postcondición:** Sala activa con 1 usuario conectado

---

## UC-02: Unirse a Sala

**Actor:** Usuario  
**Precondición:** Nombre válido + código de sala existente y activa  
**Flujo:**
1. Usuario ingresa nombre
2. Expande "Unirse con código" e ingresa código
3. Sistema verifica que la sala exista, esté activa y tenga < 3 usuarios
4. Socket conecta al usuario
5. Todos los presentes reciben evento `room:updated`
6. Navega a pantalla Sala Esperando

**Errores posibles:**
- Sala no encontrada → mensaje de error
- Sala llena (3/3) → mensaje de error
- Sala cerrada → mensaje de error

---

## UC-03: Compartir Pantalla

**Actor:** Usuario dentro de una sala  
**Precondición:** Sala en estado `waiting`  
**Flujo:**
1. Usuario presiona "🎥 Compartir mi pantalla"
2. Backend recibe `share:start`, actualiza sala a `live`, registra `sharingUser`
3. Backend crea WatchSession en DB con `startedAt = now()`
4. `session:started` se emite con sessionId
5. Todos navegan a pantalla Sala En Vivo
6. WebRTC establece conexión P2P para el stream

---

## UC-04: Detener Compartición

**Actor:** Usuario que está compartiendo  
**Flujo:**
1. Presiona "⏹ Detener" o "✅ Terminar sesión"
2. Socket emite `share:stop`
3. Sala vuelve a `waiting`, `sharingUser = null`
4. "Terminar sesión" → navega al formulario de sesión

---

## UC-05: Guardar Sesión

**Actor:** Usuario que compartió  
**Precondición:** Sesión activa existe (sessionId conocido)  
**Flujo:**
1. Formulario muestra campos: título, tipo, capítulos, dónde pararon, rating, notas
2. Usuario completa y presiona "✅ Guardar y volver al inicio"
3. Frontend llama `PATCH /api/sessions/:id/finish`
4. Backend valida y actualiza WatchSession con `endedAt` y duración calculada
5. Navega al Historial

---

## UC-06: Ver Historial

**Actor:** Cualquier usuario  
**Flujo:**
1. Presiona "📺 Ver Historial" desde Home o Sala
2. Frontend llama `GET /api/sessions/history`
3. Muestra cards con título, tipo, capítulos, rating, fecha, duración, usuarios
4. Cards son expandibles para ver detalles y notas
5. Buscador filtra por título en tiempo real

---

## UC-07: Chat en tiempo real

**Actor:** Usuarios en sala  
**Flujo:**
1. Usuario escribe mensaje o clickea reacción emoji
2. Socket emite `chat:message` con texto y usuario
3. Servidor relay emite a todos en la sala
4. Mensaje aparece en el panel de chat con nombre, hora y avatar de color

---

## UC-08: Salir de sala

**Actor:** Usuario en sala  
**Flujo:**
1. Presiona "← Salir"
2. Socket emite `room:leave`
3. Backend remueve al usuario de la sala
4. Si sala queda vacía → estado `closed`
5. Resto de usuarios reciben `room:updated`
6. Navega a Home
