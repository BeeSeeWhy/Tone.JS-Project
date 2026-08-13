'use client';

import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react';
import { initializeSocket, send, type Socket } from './socket';

export interface Song {
  id: number;
  songTitle: string;
  artist: string;
  year: number;
  notes: string;
}

interface AppState {
  socket: Socket | null;
  songs: Song[];
  playingNotes: string | null;
}

type Action =
  | { type: 'SET_SOCKET'; socket: Socket }
  | { type: 'DELETE_SOCKET' }
  | { type: 'SET_SONGS'; songs: Song[] }
  | { type: 'PLAY_SONG'; id: number }
  | { type: 'STOP_SONG' };

const initialState: AppState = {
  socket: null,
  songs: [],
  playingNotes: null,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_SOCKET': {
      state.socket?.close();
      return { ...state, socket: action.socket };
    }
    case 'DELETE_SOCKET': {
      return { ...state, socket: null };
    }
    case 'SET_SONGS': {
      return { ...state, songs: action.songs };
    }
    case 'PLAY_SONG': {
      const song = state.songs.find(s => s.id === action.id);
      return { ...state, playingNotes: song?.notes ?? null };
    }
    case 'STOP_SONG': {
      return { ...state, playingNotes: null };
    }
    default:
      return state;
  }
}

const StateContext = createContext<AppState>(initialState);
const DispatchContext = createContext<Dispatch<Action>>(() => {});

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const socket = initializeSocket(
      async connectedSocket => {
        dispatch({ type: 'SET_SOCKET', socket: connectedSocket });
        const { songs } = await send<{ songs: Song[] }>(connectedSocket, 'get_songs', {});
        dispatch({ type: 'SET_SONGS', songs });
      },
      () => dispatch({ type: 'DELETE_SOCKET' }),
    );

    return () => {
      socket.close();
    };
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export function useAppState() {
  return useContext(StateContext);
}

export function useAppDispatch() {
  return useContext(DispatchContext);
}
