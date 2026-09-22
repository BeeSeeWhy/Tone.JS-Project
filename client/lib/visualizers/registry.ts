import type P5 from 'p5';
import type * as Tone from 'tone';

export interface VisualizerContext {
  // Theme color (hex) of the currently selected instrument.
  instrumentColor: string;
}

export type VisualizerDraw = (p5: P5, analyzer: Tone.Analyser, context: VisualizerContext) => void;

export interface Visualizer {
  id: string;
  name: string;
  draw: VisualizerDraw;
}

import { waveformDraw } from './waveform';
import { orbitsDraw } from './orbits';
import { notesDraw } from './notes';
import { barsDraw } from './bars';

export const visualizers: Visualizer[] = [
  { id: 'waveform', name: 'Waveform', draw: waveformDraw },
  { id: 'orbits', name: 'Orbits', draw: orbitsDraw },
  { id: 'notes', name: 'Notes', draw: notesDraw },
  { id: 'bars', name: 'Bars', draw: barsDraw },
];
