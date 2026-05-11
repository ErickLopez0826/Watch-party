import { WpRoomHeader } from '../components/WpRoomHeader';
import { WpUserList } from '../components/WpUserList';
import { WpChat } from '../components/WpChat';
import { WpBtn } from '../components/WpBtn';
import { useAppStore } from '../../application/store/useAppStore';
import { useRoom } from '../../application/hooks/useRoom';
import { USER_PALETTE } from '../constants/users';

export function WaitingRoomScreen() {
  const { room, setScreen } = useAppStore();
  const { handleLeave, handleStartShare } = useRoom();

  if (!room) return null;

  const users = room.users.map((name, i) => ({
    key: name,
    name,
    color: room.userColors?.[name] ?? USER_PALETTE[i]?.color ?? '#555',
    initials: name.slice(0, 2).toUpperCase(),
  }));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <WpRoomHeader roomCode={room.code} onBack={handleLeave} userCount={room.users.length} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 'var(--density-padding)', gap: 16, overflow: 'hidden' }}>
          <div style={{
            flex: 1, borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-card)', border: '1.5px dashed var(--border)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14,
          }}>
            <div style={{ fontSize: 56, opacity: 0.2 }}>📡</div>
            <div style={{ fontSize: 17, color: 'var(--text-secondary)', fontWeight: 500 }}>Esperando stream...</div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'center', maxWidth: 280 }}>
              Cuando alguien comparta pantalla, el video aparecerá aquí
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            <WpBtn variant="primary" onClick={handleStartShare} style={{ flex: 1, padding: '13px', fontSize: 14 }}>
              🎥 Compartir mi pantalla
            </WpBtn>
            <WpBtn variant="ghost" onClick={() => setScreen('history')} style={{ padding: '13px 18px', fontSize: 13 }}>
              Historial →
            </WpBtn>
          </div>
        </div>

        <div style={{ width: 272, display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border)', flexShrink: 0 }}>
          <WpUserList users={users} sharingUserName={room.sharingUser} />
          <WpChat users={users} style={{ flex: 1, borderLeft: 'none', minHeight: 0 }} />
        </div>
      </div>
    </div>
  );
}
