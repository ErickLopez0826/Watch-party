import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

interface Props {
  onEndSession?: () => void;
  onShowHistory: () => void;
}

const itemBase: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10,
  width: '100%', padding: '10px 16px',
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'var(--text-primary)', fontSize: 13,
  fontFamily: 'var(--font-body)', textAlign: 'left',
  transition: 'background 0.12s',
};

function MenuItem({ icon, label, onClick, danger }: { icon: string; label: string; onClick: () => void; danger?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ ...itemBase, background: hov ? 'var(--bg-input)' : 'none', color: danger ? '#ef4444' : 'var(--text-primary)' }}
    >
      <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export function WpOptionsMenu({ onEndSession, onShowHistory }: Props) {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [btnHov, setBtnHov] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        onMouseEnter={() => setBtnHov(true)}
        onMouseLeave={() => setBtnHov(false)}
        title="Opciones"
        style={{
          background: open || btnHov ? 'var(--bg-input)' : 'transparent',
          border: '1px solid var(--border)',
          borderRadius: 8, color: 'var(--text-primary)',
          cursor: 'pointer', padding: '6px 10px', lineHeight: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="2.5" r="1.4"/>
          <circle cx="8" cy="8" r="1.4"/>
          <circle cx="8" cy="13.5" r="1.4"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 500,
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: 10, boxShadow: '0 8px 28px rgba(0,0,0,0.35)',
          minWidth: 210, overflow: 'hidden', padding: '4px 0',
        }}>
          <MenuItem
            icon="📺"
            label="Ver historial"
            onClick={() => { setOpen(false); onShowHistory(); }}
          />
          <MenuItem
            icon={theme === 'dark' ? '☀️' : '🌙'}
            label={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            onClick={() => { toggleTheme(); setOpen(false); }}
          />
          {onEndSession && (
            <>
              <div style={{ height: 1, background: 'var(--border)', margin: '3px 0' }} />
              <MenuItem
                icon="⏹"
                label="Finalizar sesión"
                onClick={() => { setOpen(false); onEndSession(); }}
                danger
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
