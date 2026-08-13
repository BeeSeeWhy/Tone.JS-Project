'use client';

import { useCallback, useEffect, useMemo } from 'react';
import * as Tone from 'tone';
import type P5 from 'p5';
import type { Visualizer } from '@/lib/visualizers/registry';
import { useP5Sketch } from '@/hooks/use-p5-sketch';

export function VisualizerPanel({ visualizer }: { visualizer: Visualizer }) {
  const analyzer = useMemo(() => new Tone.Analyser('waveform', 256), []);

  useEffect(() => {
    Tone.getDestination().volume.value = -5;
    Tone.getDestination().connect(analyzer);
    return () => {
      Tone.getDestination().disconnect(analyzer);
      analyzer.dispose();
    };
  }, [analyzer]);

  const setup = useCallback((p5: P5, container: HTMLDivElement) => {
    p5.createCanvas(container.clientWidth, container.clientHeight);
  }, []);

  const draw = useCallback((p5: P5) => visualizer.draw(p5, analyzer), [visualizer, analyzer]);

  const onResize = useCallback((p5: P5, container: HTMLDivElement) => {
    p5.resizeCanvas(container.clientWidth, container.clientHeight);
  }, []);

  const containerRef = useP5Sketch(setup, draw, onResize);

  return (
    <div className="relative flex-1 bg-black">
      <div className="absolute top-0 left-0 z-10 p-4 text-sm font-medium text-white/80">{visualizer.name}</div>
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
