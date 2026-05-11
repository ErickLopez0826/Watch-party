import { useState } from 'react';
import { WpInput } from '../components/WpInput';
import { WpBtn } from '../components/WpBtn';
import { WpStars } from '../components/WpStars';
import { useAppStore } from '../../application/store/useAppStore';
import { finishSession } from '../../infrastructure/api/sessionApi';
import type { ContentType } from '../../domain/types';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 'var(--density-gap)' }}>
      <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-secondary)', marginBottom: 7 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function EndSessionScreen() {
  const { setScreen, reset, activeSessionId, room, userName } = useAppStore();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ContentType>('serie');
  const [chapters, setChapters] = useState('');
  const [stopAt, setStopAt] = useState('');
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!activeSessionId || !title.trim()) return;
    setSaving(true);
    try {
      await finishSession(activeSessionId, { title, type, chapters, stopAt, rating, notes });
      setScreen('history');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '36px 20px' }}>
      <div style={{ maxWidth: 540, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--accent)', marginBottom: 6 }}>SESIÓN TERMINADA</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, lineHeight: 1 }}>GUARDAR SESIÓN</div>
          <div style={{ marginTop: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
            Con: {room?.users.join(', ') ?? userName} &nbsp;·&nbsp; {new Date().toLocaleDateString('es')}
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '24px 26px' }}>
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
          </Field>

          <Field label={type === 'serie' ? 'CAPÍTULOS VISTOS' : 'DETALLES'}>
            <WpInput value={chapters} onChange={setChapters} placeholder={type === 'serie' ? 'Ej: S01E01-E03' : 'Película completa'} />
          </Field>

          <Field label="¿DÓNDE PARARON?">
            <WpInput value={stopAt} onChange={setStopAt} placeholder="Ej: S01E03 min 45:30 o Completa" />
          </Field>

          <Field label="RATING">
            <WpStars value={rating} onChange={setRating} size={30} />
          </Field>

          <Field label="NOTAS DEL EQUIPO (OPCIONAL)">
            <WpInput value={notes} onChange={setNotes} placeholder="¿Qué les pareció?" multiline />
          </Field>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <WpBtn variant="ghost" onClick={() => setScreen('live')} style={{ padding: '13px 18px' }}>← Cancelar</WpBtn>
          <WpBtn variant="ghost" onClick={() => { reset(); setScreen('home'); }} style={{ padding: '13px 18px' }}>
            Omitir
          </WpBtn>
          <WpBtn variant="primary" onClick={handleSave} disabled={!title.trim() || saving} style={{ flex: 1, padding: '13px', fontSize: 15 }}>
            {saving ? 'Guardando...' : '✅ Guardar y volver al inicio'}
          </WpBtn>
        </div>
      </div>
    </div>
  );
}
