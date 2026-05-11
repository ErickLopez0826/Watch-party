import type { User } from '../../domain/types';
import { WpAvatar } from './WpAvatar';

interface Props {
  users: User[];
  sharingUserName?: string | null;
}

export function WpUserList({ users, sharingUserName = null }: Props) {
  return (
    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-secondary)', marginBottom: 12 }}>
        CONECTADOS
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {users.map(u => (
          <div key={u.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <WpAvatar user={u} size={34} isSharing={sharingUserName === u.name} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: u.color }}>{u.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                {sharingUserName === u.name ? '📡 Compartiendo' : sharingUserName ? '👁 Viendo' : '● En línea'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
