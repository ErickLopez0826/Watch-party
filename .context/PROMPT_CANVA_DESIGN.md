# 🎬 PROMPT PARA CANVA DESIGN - Watch Party App

Copia y pega este prompt en Canva (o comparte con el diseñador)

---

## CONTEXT

Estamos creando una aplicación web llamada **Watch Party App** que permite a 3 amigos ver películas/series en línea de forma sincronizada.

**Diseño base:**
- Paleta de colores: Azul profesional (#2E75B6) + Blanco + Grises
- Tipografía: Arial / Sans-serif moderna
- Vibes: Limpia, minimalista, amigable

---

## 🎨 PANTALLAS A DISEÑAR

### PANTALLA 1: HOME / LOGIN

**Objetivo:** Que ingresen nombre y elijan crear o unirse a una sala

**Elementos:**
- Logo grande: "🎬 WATCH PARTY APP" (título)
- Línea divisoria
- Campo input: "¿Cuál es tu nombre?" (placeholder suave)
- Botón primario azul: "➕ Crear Sala Nueva" (grande, destacado)
- Botón secundario: "🔗 Unirse a Sala Existente" con campo para código
  - Subinput dentro: "Código de sala (ej: ABC123)"
- Botón terciario pequeño: "📺 Ver Historial"
- Footer: Créditos "Made by Outforge" o similar
- Fondo: Blanco con detalles sutiles de color (gradiente suave azul en esquinas)

**Mood:** Bienvenida cálida, fácil de usar


---

### PANTALLA 2: SALA (ESPERANDO)

**Objetivo:** Mostrar que están en una sala, esperando que alguien comparta

**Elementos:**
- Header arriba: "Sala: ABC123 | Conectados: 3 usuarios"
- Área principal: Área gris clara (donde irá el video)
  - Icono grande: 📺
  - Texto: "Esperando stream..." (en gris)
- Panel de usuarios (abajo o lado):
  - 🟢 ASTAROTH0826 (tú)
  - 🟢 Kinna
  - 🟢 Crujipunk
  - (Circulitos de colores diferentes para cada uno)
- Botón destacado: "🎥 Compartir mi pantalla" (azul)
- Chat panel (lado derecho o abajo)
  - Pequeño, mostrando últimos mensajes
  - Input: "Escribe aquí..."
- Botones acción:
  - [← Salir] (esquina inferior izquierda)
  - [Ir al Historial] (esquina inferior derecha)


---

### PANTALLA 3: SALA (EN VIVO - COMPARTIENDO)

**Objetivo:** Mostrar video en vivo + controles + chat

**Elementos:**
- Header: "Sala: ABC123 | Conectados: 3 | En vivo: ▶️"
- Área principal GRANDE: Video compartido
  - Borde sutilmente redondeado
  - Sobrepuesto arriba a la izquierda: "Compartido por: ASTAROTH0826"
- Controles debajo del video:
  - [⏹️ Detener compartir] [🔊 Vol] [⏱️ +Info]
  - Pequeña barra de progreso (simulada)
- Panel de usuarios (abajo):
  - 🟢 ASTAROTH0826 (compartiendo)
  - 🟢 Kinna (viendo)
  - 🟢 Crujipunk (viendo)
- Chat en vivo (lado derecho):
  - Mensajes mostrando:
    - "ASTAROTH0826: Uy, esto sí está bueno"
    - "Kinna: 😍😍😍"
    - "Crujipunk: Increíble"
  - Input abajo: [Escribe aquí...] [😊] [Enviar]
  - Pequeños botones de reacciones: [😍] [😂] [🤔] [👍]


---

### PANTALLA 4: FORMULARIO - TERMINAR SESIÓN

**Objetivo:** Guardar los detalles de lo que vieron

**Elementos:**
- Título: "✅ Sesión terminada"
- Formulario con campos:
  - **Título** (ej: "The Last of Us")
    - Input texto ancho
  - **Tipo** (radio buttons o tabs)
    - [📺 Serie] [🎬 Película]
  - **Capítulos/Detalles** (ej: "S01E01-E03")
    - Input texto
  - **¿Dónde pararon?** (ej: "S01E03 min 45:30")
    - Input texto
  - **⭐ Rating** (1-5 estrellas)
    - 5 estrellas clickeables [⭐] [⭐] [⭐] [⭐] [⭐]
  - **Notas del equipo** (opcional)
    - Textarea
  - Info automática (gris claro):
    - "Duración total: 2h 15min ✓"
    - "Usuarios: ASTAROTH0826, Jorge, Carlos"
- Botón grande abajo:
  - "✅ Guardar y Volver a Home" (azul)


---

### PANTALLA 5: HISTORIAL

**Objetivo:** Mostrar todas las películas/series vistas

**Elementos:**
- Header: "📺 MI HISTORIAL"
- Barra de búsqueda: [🔍 Buscar por título]
- Botón filtro: "[Filtrar por...]"
- Cards de películas/series (en grid o lista):
  
  Cada card muestra:
  ```
  ┌─────────────────────────────┐
  │ 📺 The Last of Us           │
  │ Serie: S01E01-E03           │
  │ ⭐⭐⭐⭐⭐ (5 estrellas)        │
  │ 09/05/2026 | 2h 15min       │
  │ Con: ASTAROTH0826, Jorge... │
  │ Paró en: S01E03 min 45:30   │
  │ Notas: Muy emocionante      │
  │ [Ver más ▼]                 │
  └─────────────────────────────┘
  ```

- Estadísticas abajo (opcional):
  - "Has visto: 15 películas/series"
  - "Tiempo total: 48 horas"
- Botón: "[← Volver]"


---

## 🎨 DIRECTRICES DE DISEÑO

### Colores
- **Primario (Azul):** #2E75B6
- **Fondo:** #FFFFFF (blanco)
- **Texto principal:** #1A1A1A (gris oscuro)
- **Texto secundario:** #666666 (gris)
- **Acentos suaves:** #E0E8F0 (azul muy claro para inputs)
- **Errores (si aplica):** #D32F2F (rojo)
- **Success (si aplica):** #388E3C (verde)
- **Estados activos:** 🟢 Verde claro, 🟡 Amarillo si se desconecta

### Tipografía
- **Títulos:** Arial Bold, 32-48px
- **Subtítulos:** Arial Bold, 24px
- **Cuerpo:** Arial Regular, 16px
- **Pequeño:** Arial Regular, 12px

### Espaciado
- Márgenes: 24px (o múltiplos)
- Padding en botones: 12px vertical, 20px horizontal
- Gap entre elementos: 16px

### Componentes
- **Botones:** Redondeados (border-radius: 8px)
  - Primario: Azul #2E75B6, texto blanco
  - Secundario: Borde azul, fondo transparente, texto azul
  - Terciario: Texto azul, sin borde
- **Inputs:** Borde #CCCCCC, fondo #F5F5F5, padding 12px
- **Cards:** Sombra suave (box-shadow: 0 2px 8px rgba(0,0,0,0.1))
- **Iconos:** Emojis (🎬, 📺, 🎥, ⭐, etc.)

### Responsive
- Mobile first: La app debe verse bien en celulares también
- Versión desktop: Pantalla completa
- Versión mobile: Menos ancho, elementos apilados

---

## 🎬 ATMÓSFERA VISUAL

- **Limpia y moderna:** Sin saturación de elementos
- **Amigable:** Usa emojis, colores cálidos
- **Profesional:** Pero relajada, no corporativa
- **Accesible:** Contraste suficiente, texto legible

---

## 📋 CHECKLIST FINAL

- [ ] 5 pantallas principales diseñadas
- [ ] Consistencia de colores en todas las pantallas
- [ ] Botones claros y con buena jerarquía
- [ ] Chat y formularios bien estructurados
- [ ] Historial fácil de navegar
- [ ] Responsive (mobile + desktop)
- [ ] Emojis consistentes
- [ ] Tipografía profesional
- [ ] Espaciado uniforme

---

## 💾 DELIVERABLES

Preferiblemente en Figma o Canva con:
1. **Wireframes** (estructura) - si requieren
2. **Mockups** (diseño con colores) - IMPORTANTE
3. **Componentes reutilizables:** Botones, inputs, cards, headers
4. **Design System** básico (colores, tipografía, espaciado)

---

## 📞 NOTAS FINALES

- Esto será programado en React, así que el diseño debe ser modular
- Los emojis pueden reemplazarse por iconos SVG luego si se necesita
- El video compartido en pantalla 3 es un placeholder (será WebRTC en vivo)
- El chat es un ejemplo, en vivo será en tiempo real

**¡Listo para empezar a diseñar!** 🚀
