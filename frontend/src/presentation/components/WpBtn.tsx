import { useState, type ReactNode, type CSSProperties } from 'react';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger';

interface Props {
  children: ReactNode;
  variant?: Variant;
  onClick?: () => void;
  style?: CSSProperties;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function WpBtn({ children, variant = 'primary', onClick, style, disabled, type = 'button' }: Props) {
  const [hov, setHov] = useState(false);

  const base: CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, padding: '12px 22px', borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer', border: 'none',
    transition: 'all 0.15s ease', opacity: disabled ? 0.45 : 1,
    letterSpacing: '0.01em', userSelect: 'none',
  };

  const variants: Record<Variant, CSSProperties> = {
    primary: {
      background: hov ? 'var(--accent-hover)' : 'var(--accent)',
      color: '#fff',
      boxShadow: hov ? '0 0 24px var(--accent-glow)' : '0 2px 8px var(--accent-glow)',
    },
    outline: {
      background: hov ? 'rgba(255,255,255,0.05)' : 'transparent',
      color: hov ? 'var(--text-primary)' : 'var(--text-secondary)',
      border: `1.5px solid ${hov ? 'var(--border-bright)' : 'var(--border)'}`,
    },
    ghost: {
      background: hov ? 'var(--bg-card)' : 'transparent',
      color: hov ? 'var(--text-primary)' : 'var(--text-secondary)',
    },
    danger: {
      background: hov ? '#991b1b' : 'rgba(153,27,27,0.5)',
      color: '#fca5a5',
      border: '1.5px solid #7f1d1d',
    },
  };

  return (
    <button
      type={type}
      style={{ ...base, ...variants[variant], ...style }}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </button>
  );
}
