import { type ReactNode } from 'react';
import { useAppStore } from '../../application/store/useAppStore';

interface Props {
  children: ReactNode;
}

export function AppLayout({ children }: Props) {
  const { screen } = useAppStore();
  // waiting and live are the same component — avoid remounting to preserve WebRTC refs
  const animKey = (screen === 'waiting' || screen === 'live') ? 'room' : screen;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div key={animKey} className="wp-screen-enter" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}
