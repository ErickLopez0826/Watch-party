import type { User } from '../../domain/types';

interface Props {
  user: User;
  size?: number;
  showStatus?: boolean;
  isSharing?: boolean;
}

export function WpAvatar({ user, size = 36, showStatus = true, isSharing = false }: Props) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: user.color, display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: Math.round(size * 0.37), fontWeight: 700,
      color: '#fff', position: 'relative', flexShrink: 0, letterSpacing: '-0.02em',
      boxShadow: `0 0 0 2px var(--bg-base), 0 0 0 3.5px ${user.color}55`,
    }}>
      {user.initials}
      {showStatus && (
        <span style={{
          position: 'absolute', bottom: -1, right: -1,
          width: Math.round(size * 0.3), height: Math.round(size * 0.3),
          borderRadius: '50%',
          background: isSharing ? 'var(--accent)' : '#46d369',
          border: '2px solid var(--bg-base)',
        }} />
      )}
    </div>
  );
}
