import { Server, Socket } from 'socket.io';
import http from 'http';
import { MessageHandler } from './MessageHandler';
import { GetSongsHandler } from './handlers/GetSongsHandler';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const HOST = process.env.HOST ?? '0.0.0.0';
const VALID_ORIGINS = process.env.VALID_ORIGINS
   ? process.env.VALID_ORIGINS.split(',')
   : ['http://localhost:3000'];
const PING_TIMEOUT_MS = 10000;
const PING_INTERVAL_MS = 10000;
const WS_PATH = '/ws';

// Add messages you'd like to support here
export const validMessages: MessageHandler[] = [GetSongsHandler];

function disconnectHandler(socket: Socket): (reason: string) => void {
   return reason => {
      console.debug(`disconnect[${socket.id}]: ${reason}`);
   };
}

/**
 * Install our message handlers on the given socket.
 * 
 * @param socket the socket
 */
function connectHandler(socket: Socket) {
   socket.once('disconnect', disconnectHandler(socket));
   socket.onAny((event, msg) =>
      console.debug(`${event}[${socket.id}]: ${JSON.stringify(msg)}`),
   );
   validMessages.forEach(handler => handler.attach(socket));
}

export async function initServer(): Promise<Server> {
   const httpServer = http.createServer();

   httpServer.listen(PORT, HOST);

   const server = new Server({
      path: WS_PATH,
      serveClient: false,
      pingTimeout: PING_TIMEOUT_MS,
      pingInterval: PING_INTERVAL_MS,
      cors: {
         origin: VALID_ORIGINS,
      },
      transports: ['websocket'],
   });

   console.debug(`opening socket on port ${PORT}`);

   server.on('connection', connectHandler);
   server.attach(httpServer);

   return server;
}
