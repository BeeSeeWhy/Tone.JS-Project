import type { VisualizerDraw } from './registry';

const BAR_COUNT = 40;
const GAP_RATIO = 0.25;

function hexToRgb(hex: string): [number, number, number] {
  const num = parseInt(hex.replace('#', ''), 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

// Pill-shaped bars (rounded ends, like the oscillator buttons) reacting to
// the waveform, tinted with the selected instrument's theme color.
export const barsDraw: VisualizerDraw = (p5, analyzer, { instrumentColor }) => {
  const width = p5.width;
  const height = p5.height;
  const [r, g, b] = hexToRgb(instrumentColor);

  p5.background(9, 9, 11);
  p5.noStroke();

  const values = analyzer.getValue();
  const chunkSize = Math.max(1, Math.floor(values.length / BAR_COUNT));
  const slotWidth = width / BAR_COUNT;
  const barWidth = slotWidth * (1 - GAP_RATIO);

  for (let i = 0; i < BAR_COUNT; i++) {
    let sum = 0;
    for (let j = 0; j < chunkSize; j++) {
      sum += Math.abs(values[i * chunkSize + j] as number);
    }
    const avg = sum / chunkSize;
    const barHeight = Math.max(barWidth, avg * height * 3.2);

    const x = i * slotWidth + (slotWidth - barWidth) / 2;
    const y = height - barHeight;

    p5.fill(r, g, b, 235);
    p5.rect(x, y, barWidth, barHeight, barWidth / 2);
  }
};
