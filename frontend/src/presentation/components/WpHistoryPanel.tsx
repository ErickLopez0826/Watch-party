import { useState, useEffect } from 'react';
import { WpInput } from './WpInput';
import { WpStars } from './WpStars';
import { getHistory } from '../../infrastructure/api/sessionApi';
import type { WatchSession } from '../../domain/types';

const CARD_COLORS = ['#8B5CF6', '#F59E0B', '#3B82F6', '#10B981', '#a078ff'];

interface Props {
  onClose: () => void;
}

export function WpHistoryPanel({ onClose }: Props) {
  const [sessions, setSessions] = useState<WatchSession[]>([]);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory()
      .then(data => { setSessions(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = sessions.filter(s =>
    !search || s.title?.toLowerCase().includes(search.toLowerCase())
  );

  const totalMins = sessions.reduce((acc, s) => acc + (s.durationMinutes ?? 0), 0);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 900,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          width: '100%', maxWidth: 700, maxHeight: '85vh',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px 14px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, lineHeight: 1 }}>HISTORIAL</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
              {sessions.length} sesiones · {Math.floor(totalMins / 60)}h {totalMins % 60}min en total
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-secondary)', fontSize: 18, padding: '4px 8px',
              lineHeight: 1, borderRadius: 6,
            }}
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '12px 24px 4px', flexShrink: 0 }}>
          <WpInput value={search} onChange={setSearch} placeholder="🔍 Buscar por título..." />
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 24px 20px' }}>
          {loading && (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 40 }}>Cargando...</div>
          )}

          {!loading && sessions.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 40, fontSize: 14 }}>
              No hay sesiones registradas aún.
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((item, idx) => {
              const color = CARD_COLORS[idx % CARD_COLORS.length];
              const isOpen = expanded === item.id;
              return (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderLeft: `3px solid ${color}`, borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    onClick={() => setExpanded(isOpen ? null : item.id)}
                    style={{ padding: '13px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: 8,
                      background: color + '20', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 17, flexShrink: 0,
                    }}>
                      {item.type === 'serie' ? '📺' : '🎬'}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{item.title || '—'}</span>
                        {item.chapters && (
                          <span style={{
                            fontSize: 10, fontWeight: 700, color,
                            background: color + '20', borderRadius: 4,
                            padding: '2px 6px', letterSpacing: '0.05em',
                          }}>
                            {item.chapters}
                          </span>
                        )}
                      </div>
                      <WpStars value={item.rating ?? 0} size={12} readonly />
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {item.endedAt ? new Date(item.endedAt).toLocaleDateString('es') : '—'}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>
                        {item.durationMinutes
                          ? `${Math.floor(item.durationMinutes / 60)}h ${item.durationMinutes % 60}min`
                          : '—'}
                      </div>
                    </div>

                    <div style={{ color: 'var(--text-dim)', fontSize: 10, flexShrink: 0, marginLeft: 4 }}>
                      {isOpen ? '▲' : '▼'}
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{
                      padding: '12px 16px 16px', borderTop: '1px solid var(--border)',
                      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
                    }}>
                      <div>
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--text-secondary)', marginBottom: 3 }}>PARÓ EN</div>
                        <div style={{ fontSize: 13 }}>{item.stopAt || '—'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--text-secondary)', marginBottom: 3 }}>CON</div>
                        <div style={{ fontSize: 13 }}>{item.usersPresent.join(', ')}</div>
                      </div>
                      {item.notes && (
                        <div style={{ gridColumn: '1/-1' }}>
                          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--text-secondary)', marginBottom: 3 }}>NOTAS</div>
                          <div style={{ fontSize: 13, lineHeight: 1.55, fontStyle: 'italic' }}>{item.notes}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats footer */}
        {sessions.length > 0 && (
          <div style={{
            padding: '12px 24px 16px', borderTop: '1px solid var(--border)',
            flexShrink: 0, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8,
          }}>
            {[
              { label: 'Sesiones', value: sessions.length },
              { label: 'Horas juntos', value: `${Math.floor(totalMins / 60)}h ${totalMins % 60}m` },
              { label: 'Rating prom.', value: (sessions.reduce((a, s) => a + (s.rating ?? 0), 0) / sessions.length).toFixed(1) + ' ⭐' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
