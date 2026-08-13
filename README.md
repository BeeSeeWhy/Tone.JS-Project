# Band Camp

A musical jam application. Play instruments, watch the audio visualized live, and pull up a shared playlist.

## Client

The client is a [Next.js](https://nextjs.org) (App Router) + [Tailwind CSS](https://tailwindcss.com) app, using [Tone.js](https://tonejs.github.io/) for sound and [p5.js](https://p5js.org/) for the audio visualizers.

In the `client` directory, you can run:

### `npm run dev`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000). The page hot-reloads as you edit.

### `npm run build`

Builds an optimized production build.

### `npm start`

Serves the production build (run `npm run build` first).

### `npm run lint`

Runs ESLint.

The client talks to the server over a socket.io connection, configured via `NEXT_PUBLIC_SOCKET_URL` in `client/.env.local` (defaults to `ws://localhost:3001`).

## Server

The server is the backend: an Express-free `http` server running `socket.io`, backed by a SQLite database (via `better-sqlite3`) for the song playlist.

In the `server` directory, you can run:

### `npm start`

Runs the server in development mode (auto-restarts on file changes) at `ws://localhost:3001`.

## Running locally

You'll need both processes running at once, in two terminals:

```bash
cd server && npm install && npm start
cd client && npm install && npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).
