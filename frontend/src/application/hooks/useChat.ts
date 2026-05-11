import { useCallback } from 'react';
import { getSocket } from '../../infrastructure/socket/socketClient';
import { useAppStore } from '../store/useAppStore';

export function useChat() {
  const { messages } = useAppStore();

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    getSocket().emit('chat:message', { text });
  }, []);

  return { messages, sendMessage };
}
