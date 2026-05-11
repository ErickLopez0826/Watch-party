import { useState, useEffect } from 'react';
import { WpInput } from '../components/WpInput';
import { WpBtn } from '../components/WpBtn';
import { WpStars } from '../components/WpStars';
import { useAppStore } from '../../application/store/useAppStore';
import { getHistory } from '../../infrastructure/api/sessionApi';
import type { WatchSession } from '../../domain/types';

const CARD_COLORS = ['#8B5CF6', '#F59E0B', '#3B82F6', '#10B981', '#a078ff'];

export function HistoryScreen() {
  const { setScreen, history, setHistory } = useAppStore();
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getHistory().then(sessions => {
      setHistory(sessions);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [setHistory]);

  const filtered = history.filter((s: WatchSession) =>
    s.title?.toLowerCase().includes(search.toLowerCase())
  );

  const totalMins = history.reduce((acc: number, s: WatchSession) => acc + (s.durationMinutes ?? 0), 0);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px var(--density-padding)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginBottom: 24 }}>
          <WpBtn variant="ghost" onClick={() => setScreen('home')} style={{ padding: '7px 13px', flexShrink: 0, marginBottom: 4 }}>← Inicio</WpBtn>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, lineHeight: 1 }}>HISTORIAL</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 5 }}>
              {history.length} sesiones · {Math.floor(totalMins / 60)}h {totalMins % 60}min en total
            </div>
          </div>
        </div>

        <WpInput value={search} onChange={setSearch} placeholder="🔍 Buscar por título..." style={{ marginBottom: 18 }} />

        {loading && <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 40 }}>Cargando...</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((item: WatchSession, idx: number) => {
            const color = CARD_COLORS[idx % CARD_COLORS.length];
            return (
              <div key={item.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderLeft: `3px solid ${color}`, borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div onClick={() => setExpanded(expanded === item.id ? null : item.id)} style={{ padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, flexShrink: 0 }}>
                    {item.type === 'serie' ? '📺' : '🎬'}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 15, fontWeight: 700 }}>{item.title}</span>
                      {item.chapters && (
                        <span style={{ fontSize: 10, fontWeight: 700, color, background: color + '20', borderRadius: 4, padding: '2px 7px', letterSpacing: '0.05em' }}>
                          {item.chapters}
                        </span>
                      )}
                    </div>
                    <WpStars value={item.rating ?? 0} size={13} readonly />
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {item.endedAt ? new Date(item.endedAt).toLocaleDateString('es') : '—'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>
                      {item.durationMinutes ? `${Math.floor(item.durationMinutes / 60)}h ${item.durationMinutes % 60}min` : '—'}
                    </div>
                  </div>

                  <div style={{ color: 'var(--text-dim)', fontSize: 12, flexShrink: 0, marginLeft: 4 }}>
                    {expanded === item.id ? '▲' : '▼'}
                  </div>
                </div>

                {expanded === item.id && (
                  <div style={{ padding: '14px 18px 18px', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--text-secondary)', marginBottom: 4 }}>PARÓ EN</div>
                      <div style={{ fontSize: 13 }}>{item.stopAt || '—'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--text-secondary)', marginBottom: 4 }}>CON</div>
                      <div style={{ fontSize: 13 }}>{item.usersPresent.join(', ')}</div>
                    </div>
                    {item.notes && (
                      <div style={{ gridColumn: '1/-1' }}>
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--text-secondary)', marginBottom: 4 }}>NOTAS</div>
                        <div style={{ fontSize: 13, lineHeight: 1.55, fontStyle: 'italic' }}>{item.notes}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {history.length > 0 && (
          <div style={{ marginTop: 24, padding: '20px 24px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {[
              { label: 'Sesiones', value: history.length },
              { label: 'Horas juntos', value: `${Math.floor(totalMins / 60)}h ${totalMins % 60}m` },
              { label: 'Rating prom.', value: history.length ? (history.reduce((a: number, s: WatchSession) => a + (s.rating ?? 0), 0) / history.length).toFixed(1) + ' ⭐' : '—' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
