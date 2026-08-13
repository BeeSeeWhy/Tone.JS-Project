import type P5 from 'p5';
import type * as Tone from 'tone';

export type VisualizerDraw = (p5: P5, analyzer: Tone.Analyser) => void;

export interface Visualizer {
  id: string;
  name: string;
  draw: VisualizerDraw;
}

import { waveformDraw } from './waveform';
import { orbitsDraw } from './orbits';

export const visualizers: Visualizer[] = [
  { id: 'waveform', name: 'Waveform', draw: waveformDraw },
  { id: 'orbits', name: 'Orbits', draw: orbitsDraw },
];
