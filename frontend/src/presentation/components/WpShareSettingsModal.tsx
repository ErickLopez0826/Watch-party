import { useState } from 'react';
import { WpBtn } from './WpBtn';

export type ShareResolution = '1080p' | '720p';
export type ShareFps = 24 | 30 | 60;

export interface ShareSettings {
  resolution: ShareResolution;
  fps: ShareFps;
}

interface Props {
  onConfirm: (settings: ShareSettings) => void;
  onCancel: () => void;
}

const RESOLUTIONS: { label: string; value: ShareResolution }[] = [
  { label: '1080p', value: '1080p' },
  { label: '720p', value: '720p' },
];

const FPS_OPTIONS: { label: string; value: ShareFps }[] = [
  { label: '24 fps', value: 24 },
  { label: '30 fps', value: 30 },
  { label: '60 fps', value: 60 },
];

const optionStyle = (selected: boolean): React.CSSProperties => ({
  flex: 1,
  padding: '10px 0',
  borderRadius: 8,
  border: `1.5px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
  background: selected ? 'rgba(139,92,246,0.15)' : 'var(--bg-card)',
  color: selected ? 'var(--accent)' : 'var(--text-secondary)',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: selected ? 700 : 500,
  textAlign: 'center',
  transition: 'all 0.15s',
  fontFamily: 'var(--font-body)',
});

export function WpShareSettingsModal({ onConfirm, onCancel }: Props) {
  const [resolution, setResolution] = useState<ShareResolution>('1080p');
  const [fps, setFps] = useState<ShareFps>(30);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
    }}>
      <div style={{
        background: 'var(--bg-elevated)',
        border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 28px 24px',
        width: 340,
        boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
          Configurar pantalla compartida
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-secondary)', marginBottom: 8 }}>
            RESOLUCIÓN
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {RESOLUTIONS.map(r => (
              <button key={r.value} style={optionStyle(resolution === r.value)} onClick={() => setResolution(r.value)}>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-secondary)', marginBottom: 8 }}>
            FOTOGRAMAS POR SEGUNDO
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {FPS_OPTIONS.map(f => (
              <button key={f.value} style={optionStyle(fps === f.value)} onClick={() => setFps(f.value)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <WpBtn variant="outline" onClick={onCancel} style={{ flex: 1, padding: '11px' }}>
            Cancelar
          </WpBtn>
          <WpBtn variant="primary" onClick={() => onConfirm({ resolution, fps })} style={{ flex: 2, padding: '11px' }}>
            🎥 Compartir
          </WpBtn>
        </div>
      </div>
    </div>
  );
}
