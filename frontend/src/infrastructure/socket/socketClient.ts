import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    // Use VITE_API_URL if explicitly set; otherwise use the same origin as the page
    // so the connection goes through Vite's proxy in dev and the real server in prod.
    const url = import.meta.env.VITE_API_URL ?? window.location.origin;
    socket = io(url, { autoConnect: false });
  }
  return socket;
}

export function connectSocket() {
  getSocket().connect();
}

export function disconnectSocket() {
  socket?.disconnect();
}
