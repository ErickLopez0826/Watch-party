import { useState } from 'react';
import { WpBtn } from './WpBtn';
import { WpOptionsMenu } from './WpOptionsMenu';

interface Props {
  roomCode: string;
  onBack: () => void;
  onEndSession?: () => void;
  isLive?: boolean;
  userCount?: number;
  onShowHistory: () => void;
}

export function WpRoomHeader({ roomCode, onBack, onEndSession, isLive = false, userCount = 0, onShowHistory }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(roomCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header style={{
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

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 21, letterSpacing: '0.06em' }}>
          SALA: {roomCode}
        </span>

        <button
          onClick={copy}
          title="Copiar código"
          style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 7, padding: '4px 10px', cursor: 'pointer',
            color: copied ? '#46d369' : 'var(--text-secondary)',
            fontSize: 11, fontFamily: 'var(--font-body)',
            transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: 4,
            flexShrink: 0,
          }}
        >
          {copied ? '✓ Copiado' : '🔗 Copiar'}
        </button>

        {isLive && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
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

        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{userCount} conectados</span>
      </div>

      <WpOptionsMenu onEndSession={onEndSession} onShowHistory={onShowHistory} />
    </header>
  );
}
