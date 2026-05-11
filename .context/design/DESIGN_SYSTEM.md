# Design System — Watch Party App

## Filosofía visual

- **Dark-first:** fondo casi negro, elementos que emergen del oscuro
- **Cinema mood:** tipografía display bold, vibes de cartelera de cine
- **Minimalista:** solo lo esencial en pantalla, sin decoración innecesaria
- **Theamable:** soporte de modo claro + paleta de acento intercambiable

---

## Tokens CSS (`index.css`)

### Colores — Tema oscuro (default)

| Token               | Valor                        | Uso                            |
|---------------------|------------------------------|--------------------------------|
| `--bg-base`         | `#090909`                    | Fondo de página                |
| `--bg-elevated`     | `#101010`                    | Headers, nav                   |
| `--bg-card`         | `#171717`                    | Cards, paneles                 |
| `--bg-input`        | `#1f1f1f`                    | Inputs, áreas de escritura     |
| `--text-primary`    | `#e8e8e8`                    | Texto principal                |
| `--text-secondary`  | `#737373`                    | Labels, subtítulos             |
| `--text-dim`        | `#333333`                    | Placeholder, inactivo          |
| `--accent`          | Variable (default `#E50914`) | Botones primarios, highlights  |
| `--accent-hover`    | Variable                     | Estado hover del acento        |
| `--accent-glow`     | `rgba(accent, 0.22)`         | Sombra/glow de botones         |
| `--border`          | `rgba(255,255,255,0.07)`     | Bordes sutiles                 |
| `--border-bright`   | `rgba(255,255,255,0.13)`     | Bordes hover/activos           |
| `--online`          | `#46d369`                    | Indicador online               |

### Colores — Tema claro (`[data-theme="light"]`)

| Token               | Valor                        |
|---------------------|------------------------------|
| `--bg-base`         | `#f2f2f2`                    |
| `--bg-elevated`     | `#ffffff`                    |
| `--bg-card`         | `#fafafa`                    |
| `--bg-input`        | `#ebebeb`                    |
| `--text-primary`    | `#0f0f0f`                    |
| `--text-secondary`  | `#5a5a5a`                    |
| `--text-dim`        | `#b0b0b0`                    |

### Paleta de acentos disponibles

| Color       | Hex       | Mood           |
|-------------|-----------|----------------|
| Rojo (default) | `#E50914` | Cinematográfico |
| Azul        | `#3B82F6` | Tech / Moderno |
| Púrpura     | `#8B5CF6` | Premium        |
| Verde       | `#10B981` | Fresco         |
| Ámbar       | `#F59E0B` | Cálido         |

---

## Tipografía

| Token           | Fuente          | Uso                            |
|-----------------|-----------------|--------------------------------|
| `--font-display`| Bebas Neue      | Títulos grandes (WATCH PARTY, HISTORIAL) |
| `--font-body`   | DM Sans         | Todo el resto                  |

### Escala tipográfica recomendada

| Uso                | Tamaño | Peso  |
|--------------------|--------|-------|
| Hero/Logo          | 72px   | Bebas |
| Títulos pantalla   | 42-48px| Bebas |
| Subtítulos sección | 21px   | Bebas |
| Body regular       | 14-16px| 400   |
| Body enfatizado    | 14px   | 600   |
| Labels/Caps        | 10-11px| 700   |

---

## Border Radius

| Token         | Valor | Uso                          |
|---------------|-------|------------------------------|
| `--radius-sm` | 6px   | Chips, badges, tags          |
| `--radius-md` | 10px  | Botones, inputs              |
| `--radius-lg` | 14px  | Cards, paneles grandes       |

---

## Spacing (Density)

| Modo       | `--density-gap` | `--density-padding` |
|------------|-----------------|---------------------|
| Compact    | 10px            | 14px                |
| Normal     | 16px            | 22px                |
| Spacious   | 26px            | 34px                |

---

## Componentes

### Botones (`WpBtn`)

| Variante  | Background           | Color texto      | Uso                     |
|-----------|----------------------|------------------|-------------------------|
| `primary` | `var(--accent)`      | `#fff`           | Acción principal        |
| `outline` | transparent          | `var(--text-secondary)` | Acción secundaria  |
| `ghost`   | transparent hover card | `var(--text-secondary)` | Terciario/Nav  |
| `danger`  | rojo oscuro          | `#fca5a5`        | Acciones destructivas   |

Padding base: `12px 22px` · Border-radius: `var(--radius-md)`

### Inputs (`WpInput`)
- Border: `1.5px solid var(--border)` → `var(--accent)` en focus
- Glow on focus: `0 0 0 3px var(--accent-glow)`
- Soporte multiline (textarea)

### Avatares (`WpAvatar`)
- Círculo con iniciales del usuario
- Color único por usuario (slot de color)
- Indicador de estado: verde online / rojo compartiendo

### Cards de historial
- Border-left coloreado por sesión (identificación visual rápida)
- Expandible al click

---

## Animaciones

| Nombre       | Descripción                             | Duración |
|--------------|-----------------------------------------|----------|
| `wp-fadein`  | Entrada de pantallas (fade + slide up)  | 340ms    |
| `wp-pulse`   | Indicador "EN VIVO" pulsando            | 1.5s     |
| `wp-stream`  | Gradiente animado del video placeholder | 9s       |
