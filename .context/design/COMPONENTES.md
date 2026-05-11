# Inventario de Componentes — Watch Party App

## Componentes compartidos (`frontend/src/presentation/components/`)

### `WpAvatar`
Círculo de usuario con iniciales y punto de estado.

```tsx
<WpAvatar user={user} size={36} showStatus isSharing />
```

| Prop         | Tipo    | Default | Descripción                    |
|--------------|---------|---------|--------------------------------|
| `user`       | User    | —       | Objeto usuario con color e iniciales |
| `size`       | number  | 36      | Diámetro en px                 |
| `showStatus` | boolean | true    | Muestra punto verde/rojo       |
| `isSharing`  | boolean | false   | Punto rojo (compartiendo)      |

---

### `WpBtn`
Botón con 4 variantes.

```tsx
<WpBtn variant="primary" onClick={fn} disabled={false} style={{}}>
  Texto
</WpBtn>
```

Variantes: `primary` | `outline` | `ghost` | `danger`

---

### `WpInput`
Input de texto o textarea.

```tsx
<WpInput value={v} onChange={setV} placeholder="..." multiline />
```

| Prop          | Tipo    | Descripción               |
|---------------|---------|---------------------------|
| `value`       | string  | Valor controlado          |
| `onChange`    | fn      | Callback con nuevo valor  |
| `placeholder` | string  | Texto placeholder         |
| `multiline`   | boolean | Usa textarea              |
| `style`       | CSS     | Override de estilos       |

---

### `WpStars`
Rating de 1-5 estrellas.

```tsx
<WpStars value={4} onChange={setRating} size={28} readonly={false} />
```

---

### `WpRoomHeader`
Barra superior de sala con código, estado EN VIVO y botón copiar.

```tsx
<WpRoomHeader roomCode="ABC123" onBack={fn} isLive userCount={3} />
```

---

### `WpChat`
Panel de chat completo con mensajes, reacciones y input.

```tsx
<WpChat users={users} style={{ flex: 1 }} />
```

Consume el hook `useChat()` internamente.  
Necesita `users` para mostrar colores y avatares de cada mensaje.

---

### `WpUserList`
Lista de usuarios conectados con sus estados.

```tsx
<WpUserList users={users} sharingUserName="ASTAROTH0826" />
```

---

## Pantallas (`frontend/src/presentation/screens/`)

| Pantalla           | Componente          | Estado que consume        |
|--------------------|---------------------|---------------------------|
| Home               | `HomeScreen`        | `userName`, `setScreen`   |
| Sala: Esperando    | `WaitingRoomScreen` | `room`, `messages`        |
| Sala: En Vivo      | `LiveRoomScreen`    | `room`, `messages`        |
| Formulario         | `EndSessionScreen`  | `activeSessionId`, `room` |
| Historial          | `HistoryScreen`     | `history`                 |

---

## Layout (`frontend/src/presentation/layouts/`)

### `AppLayout`
Wrapper principal con NavDots de navegación.

- Envuelve cualquier pantalla
- `NavDots`: 5 puntos, el activo se expande, click navega entre pantallas
- Posición fixed en bottom-center, con backdrop blur

---

## Constantes (`frontend/src/presentation/constants/`)

### `USER_PALETTE`
Array de 3 slots de color para los usuarios:

```ts
[
  { key: 'slot0', color: '#E50914', initials: '' },  // rojo
  { key: 'slot1', color: '#8B5CF6', initials: '' },  // púrpura
  { key: 'slot2', color: '#3B82F6', initials: '' },  // azul
]
```

Las iniciales y el nombre se asignan dinámicamente según el orden de entrada a la sala.
