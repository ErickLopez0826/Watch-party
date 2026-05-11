import { create } from 'zustand';
import type { Room, ChatMessage, WatchSession, Screen } from '../../domain/types';

interface AppState {
  screen: Screen;
  userName: string;
  userColor: string;
  room: Room | null;
  messages: ChatMessage[];
  activeSessionId: string | null;
  sessionStartedAt: Date | null;
  history: WatchSession[];

  setScreen: (screen: Screen) => void;
  setUserName: (name: string) => void;
  setUserColor: (color: string) => void;
  setRoom: (room: Room | null) => void;
  addMessage: (msg: ChatMessage) => void;
  setActiveSessionId: (id: string | null) => void;
  setSessionStartedAt: (date: Date | null) => void;
  setHistory: (sessions: WatchSession[]) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  screen: 'home',
  userName: '',
  userColor: '#E50914',
  room: null,
  messages: [],
  activeSessionId: null,
  sessionStartedAt: null,
  history: [],

  setScreen: (screen) => set({ screen }),
  setUserName: (name) => set({ userName: name }),
  setUserColor: (color) => set({ userColor: color }),
  setRoom: (room) => set({ room }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setActiveSessionId: (id) => set({ activeSessionId: id }),
  setSessionStartedAt: (date) => set({ sessionStartedAt: date }),
  setHistory: (sessions) => set({ history: sessions }),
  reset: () => set({ room: null, messages: [], activeSessionId: null, sessionStartedAt: null }),
}));
