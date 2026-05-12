import type { WatchSession, SessionFormData } from '../../domain/types';

const ORIGIN = (import.meta.env.VITE_API_URL as string | undefined) ?? '';
const BASE = `${ORIGIN}/api/sessions`;

export async function finishSession(
  sessionId: string,
  data: SessionFormData
): Promise<WatchSession> {
  const res = await fetch(`${BASE}/${sessionId}/finish`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Error al guardar la sesión');
  }
  return res.json();
}

export async function updateSession(
  sessionId: string,
  data: SessionFormData
): Promise<WatchSession> {
  const res = await fetch(`${BASE}/${sessionId}/update`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Error al guardar la calificación');
  }
  return res.json();
}

export async function getHistory(): Promise<WatchSession[]> {
  const res = await fetch(`${BASE}/history`);
  if (!res.ok) throw new Error('Error al cargar historial');
  return res.json();
}
