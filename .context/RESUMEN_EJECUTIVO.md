# 📋 WATCH PARTY APP - RESUMEN EJECUTIVO

## ✅ FASE 0: PLANIFICACIÓN (ACTUAL)

### 📄 Documentos creados:

1. **Watch_Party_App_Guia_Informativa.docx**
   - Guía completa para Jorge y Carlos
   - Explica qué es, cómo funciona, limitaciones
   - Comparte con tu equipo

2. **PROMPT_CANVA_DESIGN.md**
   - Prompt detallado para generar diseños
   - Pantallas, colores, componentes, atmósfera
   - Usa esto en Canva

---

## 🎨 SIGUIENTE PASO: DISEÑO (DISEÑADOR O TÚ)

### Opción A: Contratas a un diseñador/UX
→ Dale el archivo `PROMPT_CANVA_DESIGN.md`
→ Pide que entregue en Figma o Canva
→ Incluye: 5 pantallas completas + componentes

### Opción B: Lo haces tú en Canva
→ Abre Canva
→ Copia el prompt
→ Crea los mockups
→ Exporta como PDFs/imágenes

### ⏱️ Tiempo estimado: 4-6 horas (si lo haces tú)

---

## 🛠️ DESPUÉS DEL DISEÑO: PROGRAMACIÓN

Una vez tengas los diseños, empezamos con:

### FASE 1: Setup inicial (30 min)
- [ ] Crear repositorio GitHub
- [ ] Inicializar Vite + React (frontend)
- [ ] Inicializar Express (backend)
- [ ] Conectar frontend ↔ backend vía WebSocket

### FASE 2: Salas y autenticación (45 min)
- [ ] Pantalla Home (login)
- [ ] Crear sala (genera código)
- [ ] Unirse a sala
- [ ] Mostrar usuarios conectados
- [ ] SQLite schema

### FASE 3: WebRTC sharing (1.5 horas)
- [ ] Capturar pantalla
- [ ] Establecer conexión P2P
- [ ] Transmitir stream
- [ ] Mostrar en tiempo real

### FASE 4: Chat (30 min)
- [ ] Mensajes en tiempo real
- [ ] Reacciones emoji
- [ ] Persistencia básica

### FASE 5: Historial (1 hora)
- [ ] Formulario de fin de sesión
- [ ] Guardar en BD
- [ ] Pantalla Historial
- [ ] Estadísticas

### FASE 6: Deploy + Polish (1 hora)
- [ ] Deploy a Vercel (frontend)
- [ ] Deploy a Render (backend)
- [ ] Testing
- [ ] Tema oscuro/claro

### ⏱️ Tiempo total programación: ~5-6 horas (spread en días)

---

## 🎯 DEFINICIONES CONFIRMADAS

### Backend
- **Plataforma:** Render.com (tier gratuita)
- **Tecnología:** Node.js + Express + Socket.io
- **Base de datos:** SQLite (en el servidor de Render)
- **Primera carga:** ~50 segundos (normal en tier gratis)

### Frontend
- **Plataforma:** Vercel.com (gratuita)
- **Tecnología:** React 18 + TypeScript + Vite + Tailwind CSS
- **Estado:** Zustand
- **WebRTC:** navigator.mediaDevices.getDisplayMedia()

### Requisitos de usuario
- Conexión a internet (siempre)
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Micrófono + cámara (NO obligatorio, solo para video)
- Permiso para compartir pantalla (el navegador lo pide)

---

## 🔐 Seguridad & Privacidad

✅ **Lo que SÍ hacemos:**
- P2P encriptado (WebRTC)
- Sin servidores intermedios tocando video
- Códigos únicos para salas (no URL públicas)
- Datos guardados solo en tu servidor Render
- Jorge y Carlos NO necesitan pasar contraseñas

❌ **Lo que NO hacemos:**
- Almacenar video (solo metadata: título, rating, notas)
- Pasar credenciales Netflix/Paramount
- Usar apps de terceros tipo HypeArboom

---

## 📊 Stack Resume

| Aspecto | Tecnología |
|---------|-----------|
| **Frontend** | React 18 + TypeScript + Vite + Tailwind CSS |
| **Backend** | Node.js + Express + Socket.io |
| **BD** | SQLite (Render) |
| **WebRTC** | navigator.mediaDevices + RTCPeerConnection |
| **Deploy Frontend** | Vercel |
| **Deploy Backend** | Render.com |
| **Versionamiento** | GitHub (tu repo) |
| **Diseño** | Figma/Canva |

---

## 📝 Detalles técnicos importantes

### Limitaciones aceptadas:
- Netflix podría degradar a 480p (no evitable)
- Paramount+ funciona mejor (como Meet)
- Máximo 3 usuarios (después ralentiza)
- Necesita conexión estable

### Validaciones clave:
- Nombre usuario: 3-20 caracteres
- Código sala: 6 caracteres alfanuméricos
- Título película: Max 100 caracteres
- Duración vista: Auto calculada
- Rating: 1-5 números enteros

### DB Schema básico:
```
Usuarios:
  - id (auto)
  - nombre (string)
  - sala_actual (string)
  - conectado_en (timestamp)

Salas:
  - id (uuid)
  - codigo (string unique)
  - creador (string)
  - usuarios (json array)
  - estado (active/closed)
  - fecha_creacion (timestamp)

SesionesWatching:
  - id (auto)
  - sala_id (foreign key)
  - titulo (string)
  - tipo (serie/pelicula)
  - capitulos (string)
  - compartido_por (string)
  - usuarios_presentes (json array)
  - fecha_inicio (timestamp)
  - fecha_termino (timestamp)
  - duracion_vista (integer minutes)
  - donde_paro (string)
  - rating (1-5)
  - notas (text)
```

---

## 🚀 CHECKLIST ANTES DE PROGRAMAR

- [ ] Documento informativo leído por Jorge y Carlos
- [ ] Mockups/diseños finalizados en Canva/Figma
- [ ] Decisión: Repositorio GitHub creado sí/no
- [ ] Nombre de dominio decidido (ej: watch-party.vercel.app)
- [ ] Cuentas creadas:
  - [ ] Vercel (para frontend)
  - [ ] Render.com (para backend)
  - [ ] GitHub (para versionamiento)
- [ ] Archivo `.env` configurado localmente (para secretos)
- [ ] Node.js instalado en tu máquina (v18+)
- [ ] npm o yarn listo

---

## 📞 SOPORTE & DEBUGGING FUTURO

Cuando haya bugs o necesiten cambios:

1. **Bug pequeño (5-15 min):** Arreglo rápido
2. **Feature nueva (30-60 min):** Valoro la complejidad
3. **Refactor/mejoría:** Depende del alcance
4. **Deployment:** Vercel + Render automático con Git push

---

## 💡 NOTAS FINALES

- **Esta es una app personal, NO para publicar:** Perfecto, es solo para ustedes 3
- **Performance:** WebRTC es peer-to-peer, así que es eficiente
- **Escalabilidad:** Si quieren agregar más de 3 personas luego, refactorizamos
- **Actualizaciones:** Cualquier cambio futuro es fácil porque tenemos la BD

---

## 🎯 PRÓXIMO PASO

**Acción inmediata:**
1. Comparte documento `Watch_Party_App_Guia_Informativa.docx` con Jorge y Carlos
2. Descarga `PROMPT_CANVA_DESIGN.md`
3. Diseña las 5 pantallas (tú o encarga)
4. Una vez tengas mockups, avísame → **EMPEZAMOS A CODEAR**

---

**Estado:** ✅ PLANIFICACIÓN COMPLETADA
**Próxima etapa:** 🎨 DISEÑO
**Etapa después:** 🛠️ DESARROLLO

¡Vamos! 🚀
