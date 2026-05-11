import { useState } from 'react';
import { WpBtn } from './WpBtn';
import { WpInput } from './WpInput';
import { WpStars } from './WpStars';
import { updateSession } from '../../infrastructure/api/sessionApi';
import type { ContentType } from '../../domain/types';

interface Props {
  activeSessionId: string;
  onClose: () => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        display: 'block', fontSize: 10, fontWeight: 700,
        letterSpacing: '0.12em', color: 'var(--text-secondary)', marginBottom: 7,
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function WpRateModal({ activeSessionId, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ContentType>('serie');
  const [chapters, setChapters] = useState('');
  const [stopAt, setStopAt] = useState('');
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    setError('');
    try {
      await updateSession(activeSessionId, { title, type, chapters, stopAt, rating, notes });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
    }}>
      <div style={{
        background: 'var(--bg-elevated)',
        border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 28px 24px',
        width: 420, maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--accent)', marginBottom: 4 }}>
          CALIFICACIÓN
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, lineHeight: 1, marginBottom: 20 }}>
          ¿QUÉ ESTÁN VIENDO?
        </div>

        <Field label="TÍTULO">
          <WpInput value={title} onChange={setTitle} placeholder="Nombre de la peli o serie" />
        </Field>

        <Field label="TIPO">
          <div style={{ display: 'flex', gap: 8 }}>
            {([{ k: 'serie', label: '📺 Serie' }, { k: 'pelicula', label: '🎬 Película' }] as const).map(opt => (
              <button
                key={opt.k}
                onClick={() => setType(opt.k)}
                style={{
                  flex: 1, padding: '9px', borderRadius: 8, cursor: 'pointer',
                  border: '1.5px solid', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
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
        </Field>

        <Field label={type === 'serie' ? 'CAPÍTULOS VISTOS' : 'DETALLES'}>
          <WpInput value={chapters} onChange={setChapters} placeholder={type === 'serie' ? 'Ej: S01E01-E03' : 'Película completa'} />
        </Field>

        <Field label="¿DÓNDE PARARON?">
          <WpInput value={stopAt} onChange={setStopAt} placeholder="Ej: S01E03 min 45:30 o Completa" />
        </Field>

        <Field label="RATING">
          <WpStars value={rating} onChange={setRating} size={28} />
        </Field>

        <Field label="NOTAS (OPCIONAL)">
          <WpInput value={notes} onChange={setNotes} placeholder="¿Qué les pareció?" multiline />
        </Field>

        {error && (
          <div style={{ fontSize: 12, color: '#f87171', marginBottom: 12 }}>{error}</div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <WpBtn variant="ghost" onClick={onClose} style={{ padding: '11px 16px' }}>
            Cancelar
          </WpBtn>
          <WpBtn
            variant="primary"
            onClick={handleSave}
            disabled={!title.trim() || saving}
            style={{ flex: 1, padding: '11px' }}
          >
            {saving ? 'Guardando...' : '⭐ Guardar calificación'}
          </WpBtn>
        </div>
      </div>
    </div>
  );
}
