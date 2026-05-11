import { WpRoomHeader } from '../components/WpRoomHeader';
import { WpUserList } from '../components/WpUserList';
import { WpChat } from '../components/WpChat';
import { WpBtn } from '../components/WpBtn';
import { useAppStore } from '../../application/store/useAppStore';
import { useRoom } from '../../application/hooks/useRoom';
import { USER_PALETTE } from '../constants/users';

export function LiveRoomScreen() {
  const { room, setScreen } = useAppStore();
  const { handleLeave, handleStopShare } = useRoom();

  if (!room) return null;

  const users = room.users.map((name, i) => USER_PALETTE[i] ? { ...USER_PALETTE[i], name } : { key: name, name, color: '#555', initials: name.slice(0, 2).toUpperCase() });

  const onEndSession = () => {
    handleStopShare();
    setScreen('form');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <WpRoomHeader roomCode={room.code} onBack={handleLeave} isLive userCount={room.users.length} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 'var(--density-padding)', gap: 14, overflow: 'hidden' }}>
          <div style={{
            flex: 1, borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, #0d0d1a 0%, #12183a 40%, #0e2860 70%, #0d0d1a 100%)',
            backgroundSize: '300% 300%',
            animation: 'wp-stream 9s ease-in-out infinite',
            border: '1.5px solid rgba(229,9,20,0.2)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)' }} />
            {room.sharingUser && (
              <div style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', animation: 'wp-pulse 1.5s infinite', display: 'inline-block' }} />
                <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>Compartido por {room.sharingUser}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
            <WpBtn variant="danger" onClick={handleStopShare} style={{ padding: '11px 18px', fontSize: 13 }}>⏹ Detener</WpBtn>
            <WpBtn variant="outline" style={{ padding: '11px 16px', fontSize: 13 }}>🔊 Audio</WpBtn>
            <div style={{ flex: 1 }} />
            <WpBtn variant="primary" onClick={onEndSession} style={{ padding: '11px 22px', fontSize: 14 }}>
              ✅ Terminar sesión
            </WpBtn>
          </div>
        </div>

        <div style={{ width: 290, display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border)', flexShrink: 0 }}>
          <WpUserList users={users} sharingUserName={room.sharingUser} />
          <WpChat users={users} style={{ flex: 1, borderLeft: 'none', minHeight: 0 }} />
        </div>
      </div>
    </div>
  );
}
