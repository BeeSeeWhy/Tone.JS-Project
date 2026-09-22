import type P5 from 'p5';
import type { VisualizerDraw } from './registry';

const NOTE_GLYPHS = ['♪', '♫', '♬', '♩'];
const SPAWN_THRESHOLD = 0.12;
const MAX_PARTICLES = 60;
const LIFESPAN_FRAMES = 50;

interface NoteParticle {
  x: number;
  y: number;
  vy: number;
  glyph: string;
  hue: number;
  size: number;
  age: number;
}

// p5 re-uses the same instance across frames, so particles live on the
// instance itself rather than module scope — keeps state scoped to this one
// visualizer mount instead of leaking across remounts.
function getParticles(p5: P5): NoteParticle[] {
  const withState = p5 as P5 & { __noteParticles?: NoteParticle[] };
  if (!withState.__noteParticles) withState.__noteParticles = [];
  return withState.__noteParticles;
}

export const notesDraw: VisualizerDraw = (p5, analyzer) => {
  const particles = getParticles(p5);
  const width = p5.width;
  const height = p5.height;

  // Fully clear each frame — no alpha-trail buildup — individual particles
  // own their fade instead.
  p5.background(9, 9, 11);
  p5.colorMode(p5.HSB, 360, 100, 100, 255);
  p5.noStroke();
  p5.textAlign(p5.CENTER, p5.CENTER);
  p5.textStyle(p5.BOLD);
  p5.frameRate(30);

  const values = analyzer.getValue();
  let peak = 0;
  for (let i = 0; i < values.length; i++) {
    const magnitude = Math.abs(values[i] as number);
    if (magnitude > peak) peak = magnitude;
  }

  if (peak > SPAWN_THRESHOLD && particles.length < MAX_PARTICLES) {
    particles.push({
      x: p5.random(width * 0.1, width * 0.9),
      y: height + 20,
      vy: -(1 + peak * 3),
      glyph: NOTE_GLYPHS[Math.floor(p5.random(NOTE_GLYPHS.length))],
      hue: p5.random(360),
      size: 16 + peak * 70,
      age: 0,
    });
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    particle.age++;
    particle.y += particle.vy;
    if (particle.age > LIFESPAN_FRAMES || particle.y < -40) {
      particles.splice(i, 1);
      continue;
    }
    const alpha = 255 * (1 - particle.age / LIFESPAN_FRAMES);
    p5.fill(particle.hue, 75, 100, alpha);
    p5.textSize(particle.size);
    p5.text(particle.glyph, particle.x, particle.y);
  }
};
