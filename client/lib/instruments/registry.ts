import type { ComponentType } from 'react';
import type * as Tone from 'tone';

export interface InstrumentComponentProps {
  synth: Tone.Synth;
  setSynth: (updater: (oldSynth: Tone.Synth) => Tone.Synth) => void;
}

export interface Instrument {
  id: string;
  name: string;
  Component: ComponentType<InstrumentComponentProps>;
}

import { Piano } from './piano';
import { Saw } from './saw';

export const instruments: Instrument[] = [
  { id: 'piano', name: 'Piano', Component: Piano },
  { id: 'saw', name: 'Saw', Component: Saw },
];
