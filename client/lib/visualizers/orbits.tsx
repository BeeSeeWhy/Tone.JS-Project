import type { VisualizerDraw } from './registry';

export const orbitsDraw: VisualizerDraw = (p5, analyzer) => {
  const width = p5.width;
  const height = p5.height;

  p5.background(0, 0, 0, 40);
  p5.angleMode('radians');
  p5.noFill();
  p5.frameRate(30);

  const values = analyzer.getValue();
  for (let i = 0; i < values.length; i++) {
    const value = values[i] as number;
    p5.strokeWeight(Math.abs(value) * 20);
    p5.stroke(p5.random(150, 255), p5.random(80, 200), p5.random(200, 255), 180);
    p5.circle(p5.random(width), p5.random(height), Math.abs(value) * 400);
  }
};
