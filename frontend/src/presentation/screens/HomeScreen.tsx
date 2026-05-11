import { useState } from 'react';
import { WpInput } from '../components/WpInput';
import { WpBtn } from '../components/WpBtn';
import { useRoom } from '../../application/hooks/useRoom';
import { useAppStore } from '../../application/store/useAppStore';

const COLOR_OPTIONS = [
  '#E50914', '#8B5CF6', '#3B82F6', '#10B981',
  '#F59E0B', '#EC4899', '#06B6D4', '#F97316',
];

export function HomeScreen() {
  const { setUserName, setUserColor, userName, userColor } = useAppStore();
  const { handleCreateRoom, handleJoinRoom } = useRoom();
  const [name, setName] = useState(userName);
  const [code, setCode] = useState('');
  const { setScreen } = useAppStore();

  const canGo = name.trim().length >= 2;
  const canJoin = canGo && code.length >= 6;

  const onCreateRoom = async () => {
    if (!canGo) return;
    const trimmed = name.trim();
    setUserName(trimmed);
    await handleCreateRoom(trimmed);
  };

  const onJoinRoom = async () => {
    if (!canJoin) return;
    const trimmed = name.trim();
    setUserName(trimmed);
    await handleJoinRoom(code, trimmed);
  };

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '40px 20px' }}>
      <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 700, height: 320, background: 'radial-gradient(ellipse, var(--accent-glow) 0%, transparent 68%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 72, lineHeight: 0.88, letterSpacing: '0.02em' }}>
            WATCH<br />
            <span style={{ color: 'var(--accent)' }}>PARTY</span>
          </div>
        </div>

        {/* Name + color */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-secondary)', marginBottom: 7 }}>
            TU USUARIO
          </label>
          <WpInput value={name} onChange={setName} placeholder="Ej: ASTAROTH0826" />

          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>COLOR</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c}
                  onClick={() => setUserColor(c)}
                  title={c}
                  style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: c, cursor: 'pointer',
                    border: userColor === c ? '2.5px solid #fff' : '2.5px solid transparent',
                    outline: userColor === c ? `2px solid ${c}` : 'none',
                    outlineOffset: 1,
                    transition: 'transform 0.1s',
                    transform: userColor === c ? 'scale(1.18)' : 'scale(1)',
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
            {/* Preview */}
            <span style={{
              fontSize: 12, fontWeight: 700, color: userColor,
              opacity: name.trim() ? 1 : 0.35,
              transition: 'opacity 0.2s',
              marginLeft: 4,
            }}>
              {name.trim() || 'PREVIEW'}
            </span>
          </div>
        </div>

        <WpBtn variant="primary" onClick={onCreateRoom} disabled={!canGo} style={{ width: '100%', padding: '15px', fontSize: 15, marginBottom: 16 }}>
          + Crear Sala Nueva
        </WpBtn>

        {/* Join section — always visible */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid var(--border)',
          padding: '16px',
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-secondary)', marginBottom: 10 }}>
            🔗 UNIRSE CON CÓDIGO
          </div>
          <WpInput
            value={code}
            onChange={v => setCode(v.toUpperCase().slice(0, 8))}
            placeholder="Código de sala (ej: ABC123)"
            style={{ marginBottom: 10 }}
          />
          {!canGo && (
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 8 }}>
              Escribe tu nombre arriba (mínimo 2 caracteres)
            </div>
          )}
          {canGo && code.length > 0 && code.length < 6 && (
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 8 }}>
              El código debe tener 6 caracteres ({code.length}/6)
            </div>
          )}
          <WpBtn variant="primary" onClick={onJoinRoom} disabled={!canJoin} style={{ width: '100%', padding: '12px' }}>
            Entrar →
          </WpBtn>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => setScreen('history')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13, fontFamily: 'var(--font-body)', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            📺 Ver Historial
          </button>
        </div>
      </div>
    </div>
  );
}
