import { useState } from 'react';

interface Props {
  value: number;
  onChange?: (n: number) => void;
  size?: number;
  readonly?: boolean;
}

export function WpStars({ value, onChange, size = 28, readonly }: Props) {
  const [hov, setHov] = useState(0);
  const display = hov || value;

  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          onClick={() => !readonly && onChange?.(n)}
          onMouseEnter={() => !readonly && setHov(n)}
          onMouseLeave={() => !readonly && setHov(0)}
          style={{
            fontSize: size, cursor: readonly ? 'default' : 'pointer',
            color: n <= display ? '#FBBF24' : 'var(--text-dim)',
            transition: 'color 0.1s, transform 0.1s',
            transform: n <= display ? 'scale(1.15)' : 'scale(1)',
            display: 'inline-block', lineHeight: 1,
          }}
        >★</span>
      ))}
    </div>
  );
}
