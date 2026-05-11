import { useRef, useEffect, useState } from 'react';
import type { ChatMessage, User } from '../../domain/types';
import { useChat } from '../../application/hooks/useChat';

const REACTIONS = ['😍', '😂', '🤔', '👍', '🔥'];

interface Props {
  users: User[];
  style?: React.CSSProperties;
}

export function WpChat({ users, style }: Props) {
  const { messages, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text: string) => {
    sendMessage(text);
    setInput('');
  };

  const getUser = (userName: string): User =>
    users.find(u => u.name === userName) ?? { key: '', name: userName, color: '#666', initials: '?' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border)', background: 'var(--bg-base)', ...style }}>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-secondary)' }}>
          CHAT
        </span>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((msg: ChatMessage, i: number) => {
          const u = getUser(msg.userName);
          return (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: u.color, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0,
              }}>
                {u.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', marginBottom: 2 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: u.color }}>{u.name}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{msg.time}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.45, wordBreak: 'break-word' }}>
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '7px 12px', borderTop: '1px solid var(--border)', display: 'flex', gap: 5, flexShrink: 0 }}>
        {REACTIONS.map(e => (
          <button key={e} onClick={() => handleSend(e)} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 6, padding: '4px 7px', cursor: 'pointer', fontSize: 14,
          }}>{e}</button>
        ))}
      </div>

      <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, flexShrink: 0 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend(input)}
          placeholder="Escribe aquí..."
          style={{
            flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '8px 11px', color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none',
          }}
        />
        <button
          onClick={() => handleSend(input)}
          style={{
            background: 'var(--accent)', border: 'none', borderRadius: 8,
            padding: '8px 13px', cursor: 'pointer', color: '#fff', fontSize: 15, flexShrink: 0,
          }}
        >→</button>
      </div>
    </div>
  );
}
