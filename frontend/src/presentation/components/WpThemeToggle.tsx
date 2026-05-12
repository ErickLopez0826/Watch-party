import { useTheme } from '../hooks/useTheme';

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="8" cy="8" r="3" />
    <line x1="8" y1="1" x2="8" y2="2.5" />
    <line x1="8" y1="13.5" x2="8" y2="15" />
    <line x1="1" y1="8" x2="2.5" y2="8" />
    <line x1="13.5" y1="8" x2="15" y2="8" />
    <line x1="3.05" y1="3.05" x2="4.1" y2="4.1" />
    <line x1="11.9" y1="11.9" x2="12.95" y2="12.95" />
    <line x1="12.95" y1="3.05" x2="11.9" y2="4.1" />
    <line x1="4.1" y1="11.9" x2="3.05" y2="12.95" />
  </svg>
);

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

interface Props {
  /** When true, renders as an inline flex item (inside a header). Default: fixed overlay. */
  inline?: boolean;
}

export function WpThemeToggle({ inline = false }: Props) {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      style={{
        ...(inline ? {} : {
          position: 'fixed',
          top: 11,
          right: 16,
          zIndex: 999,
        }),
        width: 34,
        height: 34,
        borderRadius: 8,
        border: '1.5px solid var(--border-bright)',
        background: 'var(--bg-card)',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'background 0.15s, color 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-bright)';
        (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-input)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-bright)';
        (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-card)';
      }}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
