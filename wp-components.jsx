
// Watch Party — All Screens & Shared UI
// Exports everything to window for use in main app

const { useState, useEffect, useRef } = React;

// ─── Constants ───────────────────────────────────────────────────────────────

const WP_USERS = [
  { key: 'me',        name: 'ASTAROTH0826', color: '#E50914', initials: 'A8' },
  { key: 'kinna',     name: 'Kinna',        color: '#8B5CF6', initials: 'Ki' },
  { key: 'crujipunk', name: 'Crujipunk',    color: '#3B82F6', initials: 'Cr' },
];

const WP_MESSAGES = [
  { key: 'me',        text: '¿Ya están listos?',               time: '21:02' },
  { key: 'kinna',     text: '¡Aquí! 🙌',                       time: '21:03' },
  { key: 'crujipunk', text: 'Listo también',                   time: '21:03' },
  { key: 'me',        text: 'Dale, comparto ahora',            time: '21:04' },
  { key: 'kinna',     text: '😍😍 esto está buenísimo!',       time: '21:07' },
  { key: 'crujipunk', text: 'Increíble la actuación',         time: '21:08' },
  { key: 'me',        text: 'El E03 final me dejó sin palabras', time: '21:09' },
];

const WP_HISTORY = [
  {
    id: 1, title: 'The Last of Us', type: 'serie',
    chapters: 'S01E01–E03', stopAt: 'S01E03 min 45:30',
    rating: 5, date: '08 May 2026', duration: '2h 15min',
    users: ['ASTAROTH0826', 'Kinna', 'Crujipunk'],
    notes: 'El final del E03 nos dejó en silencio. Brutal y hermoso.',
    color: '#E50914',
  },
  {
    id: 2, title: 'Dune: Parte Dos', type: 'pelicula',
    chapters: null, stopAt: 'Completa',
    rating: 4, date: '25 Abr 2026', duration: '3h 06min',
    users: ['ASTAROTH0826', 'Kinna', 'Crujipunk'],
    notes: 'Visual impresionante. El ritmo lento vale la pena.',
    color: '#F59E0B',
  },
  {
    id: 3, title: 'Shōgun', type: 'serie',
    chapters: 'S01E01–E05', stopAt: 'S01E05 final',
    rating: 5, date: '10 Abr 2026', duration: '4h 30min',
    users: ['ASTAROTH0826', 'Crujipunk'],
    notes: 'Obra maestra absoluta. Kinna se perdió algo épico.',
    color: '#8B5CF6',
  },
  {
    id: 4, title: 'Severance', type: 'serie',
    chapters: 'S02E01–E04', stopAt: 'S02E04 min 28:00',
    rating: 5, date: '02 Abr 2026', duration: '3h 15min',
    users: ['ASTAROTH0826', 'Kinna'],
    notes: 'El misterio de la T2 es impresionante.',
    color: '#3B82F6',
  },
];

// ─── Primitive Components ────────────────────────────────────────────────────

function WpScreen({ children, style }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    const id = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div ref={ref} style={{ height: '100%', display: 'flex', flexDirection: 'column', ...style }}>
      {children}
    </div>
  );
}

function WpAvatar({ userKey, size = 36, showStatus = true, isSharing = false }) {
  const u = WP_USERS.find(u => u.key === userKey) || { color: '#555', initials: '?' };
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: u.color, display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: Math.round(size * 0.37), fontWeight: 700,
      color: '#fff', position: 'relative', flexShrink: 0, letterSpacing: '-0.02em',
      boxShadow: `0 0 0 2px var(--bg-base), 0 0 0 3.5px ${u.color}55`,
    }}>
      {u.initials}
      {showStatus && (
        <span style={{
          position: 'absolute', bottom: -1, right: -1,
          width: Math.round(size * 0.3), height: Math.round(size * 0.3),
          borderRadius: '50%',
          background: isSharing ? 'var(--accent)' : '#46d369',
          border: '2px solid var(--bg-base)',
        }} />
      )}
    </div>
  );
}

function WpBtn({ children, variant = 'primary', onClick, style, disabled }) {
  const [hov, setHov] = useState(false);
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, padding: '12px 22px', borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer', border: 'none',
    transition: 'all 0.15s ease', opacity: disabled ? 0.45 : 1,
    letterSpacing: '0.01em', userSelect: 'none',
  };
  const map = {
    primary: {
      background: hov ? 'var(--accent-hover)' : 'var(--accent)',
      color: '#fff',
      boxShadow: hov ? '0 0 24px var(--accent-glow)' : '0 2px 8px var(--accent-glow)',
    },
    outline: {
      background: hov ? 'rgba(255,255,255,0.05)' : 'transparent',
      color: hov ? 'var(--text-primary)' : 'var(--text-secondary)',
      border: `1.5px solid ${hov ? 'var(--border-bright)' : 'var(--border)'}`,
    },
    ghost: {
      background: hov ? 'var(--bg-card)' : 'transparent',
      color: hov ? 'var(--text-primary)' : 'var(--text-secondary)',
    },
    danger: {
      background: hov ? '#991b1b' : 'rgba(153,27,27,0.5)',
      color: '#fca5a5',
      border: '1.5px solid #7f1d1d',
    },
  };
  return (
    <button
      style={{ ...base, ...map[variant], ...style }}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </button>
  );
}

function WpInput({ value, onChange, placeholder, style, multiline }) {
  const [focused, setFocused] = useState(false);
  const shared = {
    width: '100%', padding: '11px 14px',
    background: 'var(--bg-input)', border: '1.5px solid',
    borderColor: focused ? 'var(--accent)' : 'var(--border)',
    borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused ? '0 0 0 3px var(--accent-glow)' : 'none',
    boxSizing: 'border-box', ...style,
  };
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ ...shared, minHeight: 88, resize: 'vertical', lineHeight: 1.5 }}
      />
    );
  }
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={shared}
    />
  );
}

function WpStars({ value, onChange, size = 28 }) {
  const [hov, setHov] = useState(0);
  const display = hov || value;
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHov(n)}
          onMouseLeave={() => setHov(0)}
          style={{
            fontSize: size, cursor: 'pointer',
            color: n <= display ? '#FBBF24' : 'var(--text-dim)',
            transition: 'color 0.1s, transform 0.1s',
            transform: n <= display ? 'scale(1.15)' : 'scale(1)',
            display: 'inline-block', lineHeight: 1,
          }}
        >★</span>
      ))}
    </div>
  );
}

// ─── Room Header ─────────────────────────────────────────────────────────────

function WpRoomHeader({ roomCode, onBack, isLive = false }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '0 var(--density-padding)',
      height: 56,
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-elevated)',
      flexShrink: 0,
    }}>
      <WpBtn variant="ghost" onClick={onBack} style={{ padding: '7px 12px', fontSize: 13 }}>
        ← Salir
      </WpBtn>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 21,
          letterSpacing: '0.06em', color: 'var(--text-primary)',
        }}>
          SALA: {roomCode}
        </span>

        {isLive && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(229,9,20,0.12)', border: '1px solid rgba(229,9,20,0.25)',
            borderRadius: 6, padding: '3px 10px',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)',
              animation: 'wp-pulse 1.5s infinite', display: 'inline-block',
            }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.1em' }}>
              EN VIVO
            </span>
          </div>
        )}

        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>3 conectados</span>
      </div>

      <button
        onClick={copy}
        style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '7px 13px', cursor: 'pointer',
          color: copied ? '#46d369' : 'var(--text-secondary)',
          fontSize: 12, fontFamily: 'var(--font-body)',
          transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: 5,
        }}
      >
        {copied ? '✓ Copiado' : '🔗 Copiar código'}
      </button>
    </div>
  );
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────

function WpChat({ initialMessages, style }) {
  const [msgs, setMsgs] = useState(initialMessages || []);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs]);

  const send = (text) => {
    if (!text.trim()) return;
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    setMsgs(prev => [...prev, { key: 'me', text, time }]);
    setInput('');
  };

  const REACTIONS = ['😍', '😂', '🤔', '👍', '🔥'];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      borderLeft: '1px solid var(--border)',
      background: 'var(--bg-base)',
      ...style,
    }}>
      {/* Header */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-secondary)' }}>
          CHAT
        </span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        style={{
          flex: 1, overflowY: 'auto', padding: '12px 14px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}
      >
        {msgs.map((msg, i) => {
          const u = WP_USERS.find(u => u.key === msg.key) || { name: '?', color: '#666' };
          return (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <WpAvatar userKey={msg.key} size={26} showStatus={false} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', marginBottom: 2 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: u.color }}>{u.name}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{msg.time}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.45, wordBreak: 'break-word' }}>
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reactions */}
      <div style={{
        padding: '7px 12px', borderTop: '1px solid var(--border)',
        display: 'flex', gap: 5, flexShrink: 0,
      }}>
        {REACTIONS.map(e => (
          <button
            key={e}
            onClick={() => send(e)}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 6, padding: '4px 7px', cursor: 'pointer', fontSize: 14,
              transition: 'background 0.15s',
            }}
          >{e}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: '10px 12px', borderTop: '1px solid var(--border)',
        display: 'flex', gap: 8, flexShrink: 0,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send(input)}
          placeholder="Escribe aquí..."
          style={{
            flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '8px 11px', color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none',
          }}
        />
        <button
          onClick={() => send(input)}
          style={{
            background: 'var(--accent)', border: 'none', borderRadius: 8,
            padding: '8px 13px', cursor: 'pointer', color: '#fff', fontSize: 15,
            flexShrink: 0,
          }}
        >→</button>
      </div>
    </div>
  );
}

// ─── User Sidebar ─────────────────────────────────────────────────────────────

function WpUserList({ sharingKey = null }) {
  return (
    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-secondary)', marginBottom: 12 }}>
        CONECTADOS
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {WP_USERS.map(u => (
          <div key={u.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <WpAvatar userKey={u.key} size={34} isSharing={sharingKey === u.key} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                {sharingKey === u.key ? '📡 Compartiendo' : sharingKey ? '👁 Viendo' : '● En línea'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SCREEN 1 — HOME ─────────────────────────────────────────────────────────

function HomeScreen({ onCreateRoom, onJoinRoom, onHistory }) {
  const [name, setName] = useState('');
  const [showJoin, setShowJoin] = useState(false);
  const [code, setCode] = useState('');

  const canGo = name.trim().length >= 2;
  const canJoin = canGo && code.length >= 6;

  return (
    <WpScreen>
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', padding: '40px 20px',
      }}>
        {/* bg glow */}
        <div style={{
          position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 320,
          background: 'radial-gradient(ellipse, var(--accent-glow) 0%, transparent 68%)',
          pointerEvents: 'none',
        }} />
        {/* bottom glow */}
        <div style={{
          position: 'absolute', bottom: -60, left: '50%', transform: 'translateX(-50%)',
          width: 400, height: 200,
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 72, lineHeight: 0.88,
              color: 'var(--text-primary)', letterSpacing: '0.02em',
            }}>
              WATCH<br />
              <span style={{ color: 'var(--accent)' }}>PARTY</span>
            </div>
            <p style={{ marginTop: 14, fontSize: 13, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
              Películas juntos · Solo para nosotros tres
            </p>
          </div>

          {/* Name field */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.12em', color: 'var(--text-secondary)', marginBottom: 7,
            }}>
              TU USUARIO
            </label>
            <WpInput value={name} onChange={setName} placeholder="Ej: ASTAROTH0826" />
          </div>

          {/* Create */}
          <WpBtn
            variant="primary"
            onClick={() => canGo && onCreateRoom(name)}
            disabled={!canGo}
            style={{ width: '100%', padding: '15px', fontSize: 15, marginBottom: 10 }}
          >
            + Crear Sala Nueva
          </WpBtn>

          {/* Join */}
          <WpBtn
            variant="outline"
            onClick={() => setShowJoin(v => !v)}
            style={{ width: '100%', padding: '13px', fontSize: 14, marginBottom: showJoin ? 0 : 24 }}
          >
            🔗 Unirse con código {showJoin ? '▲' : '▼'}
          </WpBtn>

          {showJoin && (
            <div style={{
              background: 'var(--bg-card)', borderRadius: '0 0 var(--radius-md) var(--radius-md)',
              border: '1.5px solid var(--border)', borderTop: 'none',
              padding: '16px', marginBottom: 20,
            }}>
              <WpInput
                value={code}
                onChange={v => setCode(v.toUpperCase().slice(0, 8))}
                placeholder="Código de sala (ej: ABC123)"
                style={{ marginBottom: 10 }}
              />
              <WpBtn
                variant="primary"
                onClick={() => canJoin && onJoinRoom(name, code)}
                disabled={!canJoin}
                style={{ width: '100%', padding: '12px' }}
              >
                Entrar →
              </WpBtn>
            </div>
          )}

          {/* History link */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={onHistory}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-secondary)', fontSize: 13,
                fontFamily: 'var(--font-body)', transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              📺 Ver Historial
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 36, fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
            ASTAROTH0826 · KINNA · CRUJIPUNK
          </div>
        </div>
      </div>
    </WpScreen>
  );
}

// ─── SCREEN 2 — WAITING ROOM ─────────────────────────────────────────────────

function WaitingRoomScreen({ roomCode, onShare, onLeave, onHistory }) {
  return (
    <WpScreen>
      <WpRoomHeader roomCode={roomCode} onBack={onLeave} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Main area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 'var(--density-padding)', gap: 16, overflow: 'hidden' }}>
          {/* Video placeholder */}
          <div style={{
            flex: 1, borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-card)', border: '1.5px dashed var(--border)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 14,
          }}>
            <div style={{ fontSize: 56, opacity: 0.2 }}>📡</div>
            <div style={{ fontSize: 17, color: 'var(--text-secondary)', fontWeight: 500 }}>
              Esperando stream...
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'center', maxWidth: 280 }}>
              Cuando alguien comparta pantalla, el video aparecerá aquí
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            <WpBtn
              variant="primary"
              onClick={onShare}
              style={{ flex: 1, padding: '13px', fontSize: 14 }}
            >
              🎥 Compartir mi pantalla
            </WpBtn>
            <WpBtn
              variant="ghost"
              onClick={onHistory}
              style={{ padding: '13px 18px', fontSize: 13 }}
            >
              Historial →
            </WpBtn>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ width: 272, display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border)', flexShrink: 0 }}>
          <WpUserList />
          <WpChat
            initialMessages={WP_MESSAGES.slice(0, 3)}
            style={{ flex: 1, borderLeft: 'none', minHeight: 0 }}
          />
        </div>
      </div>
    </WpScreen>
  );
}

// ─── SCREEN 3 — LIVE ROOM ────────────────────────────────────────────────────

function LiveRoomScreen({ roomCode, onEndSession, onLeave }) {
  return (
    <WpScreen>
      <WpRoomHeader roomCode={roomCode} onBack={onLeave} isLive={true} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Main area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 'var(--density-padding)', gap: 14, overflow: 'hidden' }}>

          {/* Fake video */}
          <div style={{
            flex: 1, borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, #0d0d1a 0%, #12183a 40%, #0e2860 70%, #0d0d1a 100%)',
            backgroundSize: '300% 300%',
            animation: 'wp-stream 9s ease-in-out infinite',
            border: '1.5px solid rgba(229,9,20,0.2)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Scanlines */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)',
            }} />
            {/* Sharing badge */}
            <div style={{
              position: 'absolute', top: 14, left: 14,
              background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, padding: '6px 12px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)',
                animation: 'wp-pulse 1.5s infinite', display: 'inline-block',
              }} />
              <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>
                Compartido por ASTAROTH0826
              </span>
            </div>
            {/* Center label */}
            <div style={{
              position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
              fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em',
            }}>
              THE LAST OF US · S01E03
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
            <WpBtn variant="danger" style={{ padding: '11px 18px', fontSize: 13 }}>⏹ Detener</WpBtn>
            <WpBtn variant="outline" style={{ padding: '11px 16px', fontSize: 13 }}>🔊 Audio</WpBtn>
            <div style={{ flex: 1 }} />
            <WpBtn
              variant="primary"
              onClick={onEndSession}
              style={{ padding: '11px 22px', fontSize: 14 }}
            >
              ✅ Terminar sesión
            </WpBtn>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ width: 290, display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border)', flexShrink: 0 }}>
          <WpUserList sharingKey="me" />
          <WpChat
            initialMessages={WP_MESSAGES}
            style={{ flex: 1, borderLeft: 'none', minHeight: 0 }}
          />
        </div>
      </div>
    </WpScreen>
  );
}

// ─── SCREEN 4 — END SESSION ──────────────────────────────────────────────────

function EndSessionScreen({ onSave, onBack }) {
  const [title, setTitle] = useState('The Last of Us');
  const [type, setType] = useState('serie');
  const [chapters, setChapters] = useState('S01E01–E03');
  const [stopAt, setStopAt] = useState('S01E03 min 45:30');
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState('');

  const F = ({ label, children }) => (
    <div style={{ marginBottom: 'var(--density-gap)' }}>
      <label style={{
        display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
        color: 'var(--text-secondary)', marginBottom: 7,
      }}>
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <WpScreen>
      <div style={{ flex: 1, overflowY: 'auto', padding: '36px 20px' }}>
        <div style={{ maxWidth: 540, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--accent)', marginBottom: 6 }}>
              SESIÓN TERMINADA
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, color: 'var(--text-primary)', lineHeight: 1 }}>
              GUARDAR SESIÓN
            </div>
            <div style={{ marginTop: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
              Con: ASTAROTH0826, Kinna, Crujipunk &nbsp;·&nbsp; Duración: 2h 15min
            </div>
          </div>

          {/* Card */}
          <div style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)', padding: '24px 26px',
          }}>
            <F label="TÍTULO">
              <WpInput value={title} onChange={setTitle} placeholder="Nombre de la peli o serie" />
            </F>

            <F label="TIPO">
              <div style={{ display: 'flex', gap: 8 }}>
                {[{ k: 'serie', label: '📺 Serie' }, { k: 'pelicula', label: '🎬 Película' }].map(opt => (
                  <button
                    key={opt.k}
                    onClick={() => setType(opt.k)}
                    style={{
                      flex: 1, padding: '10px', borderRadius: 8, cursor: 'pointer',
                      border: '1.5px solid', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
                      transition: 'all 0.15s',
                      borderColor: type === opt.k ? 'var(--accent)' : 'var(--border)',
                      background: type === opt.k ? 'var(--accent-glow)' : 'var(--bg-input)',
                      color: type === opt.k ? 'var(--accent)' : 'var(--text-secondary)',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </F>

            <F label={type === 'serie' ? 'CAPÍTULOS VISTOS' : 'DETALLES'}>
              <WpInput
                value={chapters}
                onChange={setChapters}
                placeholder={type === 'serie' ? 'Ej: S01E01-E03' : 'Película completa'}
              />
            </F>

            <F label="¿DÓNDE PARARON?">
              <WpInput value={stopAt} onChange={setStopAt} placeholder="Ej: S01E03 min 45:30 o Completa" />
            </F>

            <F label="RATING">
              <WpStars value={rating} onChange={setRating} size={30} />
            </F>

            <F label="NOTAS DEL EQUIPO (OPCIONAL)">
              <WpInput
                value={notes}
                onChange={setNotes}
                placeholder="¿Qué les pareció? ¿Tienen recomendaciones?"
                multiline
              />
            </F>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <WpBtn variant="ghost" onClick={onBack} style={{ padding: '13px 18px' }}>
              ← Cancelar
            </WpBtn>
            <WpBtn
              variant="primary"
              onClick={onSave}
              style={{ flex: 1, padding: '13px', fontSize: 15 }}
            >
              ✅ Guardar y volver al inicio
            </WpBtn>
          </div>
        </div>
      </div>
    </WpScreen>
  );
}

// ─── SCREEN 5 — HISTORY ──────────────────────────────────────────────────────

function HistoryScreen({ onBack }) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const filtered = WP_HISTORY.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalMins = WP_HISTORY.reduce((acc, item) => {
    const m = item.duration.match(/(\d+)h\s*(\d+)?min?/);
    return m ? acc + parseInt(m[1]) * 60 + parseInt(m[2] || 0) : acc;
  }, 0);

  return (
    <WpScreen>
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px var(--density-padding)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginBottom: 24 }}>
            <WpBtn variant="ghost" onClick={onBack} style={{ padding: '7px 13px', flexShrink: 0, marginBottom: 4 }}>
              ← Inicio
            </WpBtn>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--text-primary)', lineHeight: 1 }}>
                HISTORIAL
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 5 }}>
                {WP_HISTORY.length} sesiones · {Math.floor(totalMins / 60)}h {totalMins % 60}min en total
              </div>
            </div>
          </div>

          {/* Search */}
          <WpInput
            value={search}
            onChange={setSearch}
            placeholder="🔍 Buscar por título..."
            style={{ marginBottom: 18 }}
          />

          {/* Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(item => (
              <div key={item.id} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderLeft: `3px solid ${item.color}`,
                borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}>
                {/* Card header */}
                <div
                  onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                  style={{
                    padding: '16px 18px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 14,
                  }}
                >
                  <div style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: item.color + '20',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 19, flexShrink: 0,
                  }}>
                    {item.type === 'serie' ? '📺' : '🎬'}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {item.title}
                      </span>
                      {item.chapters && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: item.color,
                          background: item.color + '20', borderRadius: 4, padding: '2px 7px',
                          letterSpacing: '0.05em',
                        }}>
                          {item.chapters}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 1, marginTop: 3 }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <span key={n} style={{ fontSize: 13, color: n <= item.rating ? '#FBBF24' : 'var(--text-dim)' }}>★</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{item.date}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{item.duration}</div>
                  </div>

                  <div style={{ color: 'var(--text-dim)', fontSize: 12, flexShrink: 0, marginLeft: 4 }}>
                    {expanded === item.id ? '▲' : '▼'}
                  </div>
                </div>

                {/* Expanded */}
                {expanded === item.id && (
                  <div style={{
                    padding: '14px 18px 18px',
                    borderTop: '1px solid var(--border)',
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
                  }}>
                    <div>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--text-secondary)', marginBottom: 4 }}>PARÓ EN</div>
                      <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{item.stopAt}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--text-secondary)', marginBottom: 4 }}>CON</div>
                      <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{item.users.join(', ')}</div>
                    </div>
                    {item.notes && (
                      <div style={{ gridColumn: '1/-1' }}>
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--text-secondary)', marginBottom: 4 }}>NOTAS</div>
                        <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.55, fontStyle: 'italic' }}>{item.notes}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{
            marginTop: 24, padding: '20px 24px',
            background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8,
          }}>
            {[
              { label: 'Sesiones', value: WP_HISTORY.length },
              { label: 'Horas juntos', value: `${Math.floor(totalMins / 60)}h ${totalMins % 60}m` },
              { label: 'Rating prom.', value: '4.8 ⭐' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--text-primary)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WpScreen>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
Object.assign(window, {
  HomeScreen, WaitingRoomScreen, LiveRoomScreen, EndSessionScreen, HistoryScreen,
});
