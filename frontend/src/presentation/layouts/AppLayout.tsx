import { type ReactNode } from 'react';
import { useAppStore } from '../../application/store/useAppStore';
import { WpThemeToggle } from '../components/WpThemeToggle';
import { useTheme } from '../hooks/useTheme';

interface Props {
  children: ReactNode;
}

export function AppLayout({ children }: Props) {
  const { screen } = useAppStore();
  useTheme(); // initializes theme from localStorage and applies to <html>

  // waiting and live are the same component — avoid remounting to preserve WebRTC refs
  const animKey = (screen === 'waiting' || screen === 'live') ? 'room' : screen;

  // Room screens embed the toggle inside WpRoomHeader to avoid overlap
  const showFloatingToggle = screen !== 'waiting' && screen !== 'live';

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {showFloatingToggle && <WpThemeToggle />}
      <div key={animKey} className="wp-screen-enter" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}
