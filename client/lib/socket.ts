import { io, type Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'ws://localhost:3001';

const SOCKET_OPTS = {
  transports: ['websocket'],
  path: '/ws',
  autoConnect: true,
  reconnection: true,
  timeout: 10000,
};

let idCounter = 1;

export type { Socket };

export function send<T = unknown>(socket: Socket, name: string, msg: Record<string, unknown>): Promise<T> {
  const _id = idCounter++;

  return new Promise((resolve, reject) => {
    socket.once(`${name}.${_id}`, resp => {
      const { error, ...success } = resp;
      if (!error) {
        resolve(success as T);
      } else {
        reject(error);
      }
    });
    socket.emit(name, { _id, ...msg });
  });
}

export function initializeSocket(onConnect: (socket: Socket) => void, onDisconnect: () => void): Socket {
  const socket = io(SOCKET_URL, SOCKET_OPTS);

  socket.on('connect', () => onConnect(socket));
  socket.on('disconnect', onDisconnect);

  return socket;
}
