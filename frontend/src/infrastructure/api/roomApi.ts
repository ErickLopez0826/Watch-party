import type { Room } from '../../domain/types';

const BASE = '/api/rooms';

export async function createRoom(userName: string): Promise<Room> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Error al crear sala');
  }
  return res.json();
}

export async function joinRoom(code: string, userName: string): Promise<Room> {
  const res = await fetch(`${BASE}/${code}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Error al unirse a la sala');
  }
  return res.json();
}
