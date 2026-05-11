export type RoomState = 'waiting' | 'live' | 'closed';
export type ContentType = 'serie' | 'pelicula';
export type Screen = 'home' | 'waiting' | 'live' | 'form' | 'history';

export interface User {
  key: string;
  name: string;
  color: string;
  initials: string;
}

export interface Room {
  id: string;
  code: string;
  creatorName: string;
  users: string[];
  state: RoomState;
  sharingUser: string | null;
  createdAt: string;
  userColors: Record<string, string>;
}

export interface ChatMessage {
  userName: string;
  text: string;
  time: string;
}

export interface WatchSession {
  id: string;
  roomId: string;
  title: string | null;
  type: ContentType | null;
  chapters: string | null;
  sharedBy: string;
  usersPresent: string[];
  startedAt: string;
  endedAt: string | null;
  durationMinutes: number | null;
  stopAt: string | null;
  rating: number | null;
  notes: string | null;
}

export interface SessionFormData {
  title: string;
  type: ContentType;
  chapters: string;
  stopAt: string;
  rating: number;
  notes: string;
}
