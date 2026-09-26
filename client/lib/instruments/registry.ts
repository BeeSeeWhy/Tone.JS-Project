import type { ComponentType } from 'react';

export interface Instrument {
  id: string;
  name: string;
  // Theme color used to tint instrument-aware visualizers.
  color: string;
  // Each instrument owns its own sound engine and reacts to playlist
  // playback itself (see the `playingNotes` effect in each component).
  Component: ComponentType;
}

import { Piano } from './piano';
import { Saw } from './saw';
import { Guitar } from './guitar';
import { Drums } from './drums';

export const instruments: Instrument[] = [
  { id: 'piano', name: 'Piano', color: '#a78bfa', Component: Piano },
  { id: 'saw', name: 'Saw', color: '#38bdf8', Component: Saw },
  { id: 'guitar', name: 'Guitar', color: '#fbbf24', Component: Guitar },
  { id: 'drums', name: 'Drums', color: '#fb7185', Component: Drums },
];
