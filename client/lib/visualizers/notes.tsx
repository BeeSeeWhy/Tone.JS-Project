import type { VisualizerDraw } from './registry';

const NOTE_GLYPHS = ['♪', '♫', '♬', '♩'];
const SAMPLE_STEP = 3;
const SILENCE_THRESHOLD = 0.02;

export const notesDraw: VisualizerDraw = (p5, analyzer) => {
  const width = p5.width;
  const height = p5.height;

  p5.background(9, 9, 11, 60);
  p5.colorMode(p5.HSB, 360, 100, 100, 255);
  p5.noStroke();
  p5.textAlign(p5.CENTER, p5.CENTER);
  p5.textStyle(p5.BOLD);
  p5.frameRate(30);

  const values = analyzer.getValue();
  for (let i = 0; i < values.length; i += SAMPLE_STEP) {
    const amplitude = values[i] as number;
    const magnitude = Math.abs(amplitude);
    if (magnitude < SILENCE_THRESHOLD) continue;

    const hue = (p5.frameCount * 3 + i * 7) % 360;
    p5.fill(hue, 75, 100, 230);
    p5.textSize(12 + magnitude * 110);
    const glyph = NOTE_GLYPHS[i % NOTE_GLYPHS.length];
    p5.text(glyph, p5.random(width), p5.random(height));
  }
};
