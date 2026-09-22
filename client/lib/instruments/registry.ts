import type { ComponentType } from 'react';
import type * as Tone from 'tone';

export interface InstrumentComponentProps {
  synth: Tone.Synth;
  setSynth: (updater: (oldSynth: Tone.Synth) => Tone.Synth) => void;
}

export interface Instrument {
  id: string;
  name: string;
  // Theme color used to tint instrument-aware visualizers.
  color: string;
  Component: ComponentType<InstrumentComponentProps>;
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
