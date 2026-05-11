# Flujo de Usuario — Watch Party App

## Mapa de pantallas

```
                    ┌─────────────┐
                    │    HOME     │
                    │  (Pantalla 1)│
                    └──────┬──────┘
                           │ Nombre ingresado
               ┌───────────┴───────────┐
               │                       │
        Crear sala               Unirse con código
               │                       │
               └───────────┬───────────┘
                           │
               ┌───────────▼───────────┐
               │  SALA: ESPERANDO      │
               │   (Pantalla 2)        │
               └───────────┬───────────┘
                           │ Compartir pantalla
               ┌───────────▼───────────┐
               │  SALA: EN VIVO        │
               │   (Pantalla 3)        │
               └───────────┬───────────┘
                           │ Terminar sesión
               ┌───────────▼───────────┐
               │  FORMULARIO SESIÓN    │
               │   (Pantalla 4)        │
               └───────────┬───────────┘
                           │ Guardar
               ┌───────────▼───────────┐
               │    HISTORIAL          │
               │   (Pantalla 5)        │
               └───────────┬───────────┘
                           │ Volver
                      [HOME]
```

## Atajos de navegación

- Desde **HOME** → Historial (link directo, sin necesidad de sala)
- Desde **SALA ESPERANDO** → Historial (botón secundario)
- Desde **HISTORIAL** → Home (botón volver)
- Desde **SALA EN VIVO** → Home (← Salir, sin guardar sesión)
- Los **NavDots** (indicadores abajo) permiten saltar entre pantallas en modo prototipo

## Transición de estados de sala

```
waiting ──── startSharing ───▶ live
  ▲                              │
  └─────── stopSharing ──────────┘
  
waiting/live ── todos salen ──▶ closed
```

## Escenario típico de una noche de Watch Party

1. **ASTAROTH0826** abre la app, escribe su nombre, crea sala → obtiene código `A3F12C`
2. Comparte el código por WhatsApp con Kinna y Crujipunk
3. Kinna y Crujipunk entran desde Home → "Unirse con código" → `A3F12C`
4. Los tres están en pantalla **Sala: Esperando**, chatean mientras se preparan
5. ASTAROTH0826 presiona "🎥 Compartir mi pantalla" → elige ventana del browser con Netflix
6. Los tres pasan a pantalla **Sala: En Vivo** — WebRTC P2P lleva el stream
7. Durante el episodio chatean: emojis, reacciones, comentarios en tiempo real
8. Al terminar, ASTAROTH0826 presiona "✅ Terminar sesión"
9. Formulario: título "The Last of Us", Serie, S01E01-E03, paró en S01E03 min 45:30, ⭐⭐⭐⭐⭐, notas
10. Guarda → **Historial** muestra la sesión guardada con todos los detalles
