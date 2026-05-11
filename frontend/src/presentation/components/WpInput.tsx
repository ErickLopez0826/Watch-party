import { useState, type CSSProperties } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  style?: CSSProperties;
  multiline?: boolean;
}

export function WpInput({ value, onChange, placeholder, style, multiline }: Props) {
  const [focused, setFocused] = useState(false);

  const shared: CSSProperties = {
    width: '100%', padding: '11px 14px',
    background: 'var(--bg-input)', border: '1.5px solid',
    borderColor: focused ? 'var(--accent)' : 'var(--border)',
    borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused ? '0 0 0 3px var(--accent-glow)' : 'none',
    boxSizing: 'border-box', ...style,
  };

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ ...shared, minHeight: 88, resize: 'vertical', lineHeight: 1.5 }}
      />
    );
  }

  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={shared}
    />
  );
}
