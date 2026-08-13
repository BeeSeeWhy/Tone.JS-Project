import type { VisualizerDraw } from './registry';

export const waveformDraw: VisualizerDraw = (p5, analyzer) => {
  const width = p5.width;
  const height = p5.height;
  const dim = Math.min(width, height);

  p5.background(9, 9, 11);
  p5.strokeWeight(dim * 0.01);
  p5.stroke(167, 139, 250);
  p5.noFill();

  const values = analyzer.getValue();
  p5.beginShape();
  for (let i = 0; i < values.length; i++) {
    const amplitude = values[i] as number;
    const x = p5.map(i, 0, values.length - 1, 0, width);
    const y = height / 2 + amplitude * height;
    p5.vertex(x, y);
  }
  p5.endShape();
};
