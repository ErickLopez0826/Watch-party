import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { createRoom, joinRoom } from '../../infrastructure/api/roomApi';
import { getSocket, connectSocket } from '../../infrastructure/socket/socketClient';
import type { Room, ChatMessage } from '../../domain/types';

export function useRoom() {
  const { setRoom, setScreen, setActiveSessionId, setSessionStartedAt, addMessage, userColor } = useAppStore();

  const setupSocketListeners = useCallback(() => {
    const socket = getSocket();

    // Remove stale listeners to prevent duplicates on second room creation
    socket.off('room:updated');
    socket.off('session:started');
    socket.off('session:ended');
    socket.off('chat:message');
    socket.off('error');
    socket.io.off('reconnect');

    socket.on('room:updated', (room: Room) => setRoom(room));
    socket.on('session:started', ({ sessionId }: { sessionId: string }) => {
      setActiveSessionId(sessionId);
      setSessionStartedAt(new Date());
      setScreen('live');
    });
    socket.on('session:ended', () => setScreen('form'));
    socket.on('chat:message', (msg: ChatMessage) => addMessage(msg));
    socket.on('error', ({ message }: { message: string }) => console.error('[socket]', message));

    // Re-join the room after reconnect (e.g. backend restart in dev causes ECONNRESET)
    socket.io.on('reconnect', () => {
      const { room, userName, userColor: color } = useAppStore.getState();
      if (room && userName) {
        socket.emit('room:join', { code: room.code, userName, userColor: color });
      }
    });
  }, [setRoom, setScreen, setActiveSessionId, setSessionStartedAt, addMessage]);

  const handleCreateRoom = useCallback(async (name: string) => {
    const room = await createRoom(name);
    setRoom(room);
    connectSocket();
    setupSocketListeners();
    getSocket().emit('room:join', { code: room.code, userName: name, userColor });
    setScreen('waiting');
  }, [setRoom, setScreen, setupSocketListeners, userColor]);

  const handleJoinRoom = useCallback(async (code: string, name: string) => {
    const room = await joinRoom(code, name);
    setRoom(room);
    connectSocket();
    setupSocketListeners();
    getSocket().emit('room:join', { code, userName: name, userColor });
    setScreen('waiting');
  }, [setRoom, setScreen, setupSocketListeners, userColor]);

  const handleLeave = useCallback(() => {
    getSocket().emit('room:leave');
    setRoom(null);
    setScreen('home');
  }, [setRoom, setScreen]);

  const handleStartShare = useCallback(() => {
    getSocket().emit('share:start');
  }, []);

  const handleStopShare = useCallback(() => {
    getSocket().emit('share:stop');
    // room:updated will flip room.state back to 'waiting' — no navigation needed
  }, []);

  const handleEndSession = useCallback(() => {
    getSocket().emit('session:end');
  }, []);

  return { handleCreateRoom, handleJoinRoom, handleLeave, handleStartShare, handleStopShare, handleEndSession };
}
