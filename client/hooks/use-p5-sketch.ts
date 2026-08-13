'use client';

import { useEffect, useRef } from 'react';
import P5 from 'p5';

export type P5SetupFn = (p5: P5, container: HTMLDivElement) => void;
export type P5DrawFn = (p5: P5) => void;
export type P5ResizeFn = (p5: P5, container: HTMLDivElement) => void;

/**
 * Creates and tears down a p5 instance (instance mode) bound to a ref'd div.
 * Replaces react-p5, which is unmaintained and doesn't play well with
 * Next.js's client/server module split.
 */
export function useP5Sketch(setup: P5SetupFn, draw: P5DrawFn, onResize?: P5ResizeFn) {
  const containerRef = useRef<HTMLDivElement>(null);
  const callbacksRef = useRef({ setup, draw, onResize });

  useEffect(() => {
    callbacksRef.current = { setup, draw, onResize };
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sketch = (p5: P5) => {
      p5.setup = () => callbacksRef.current.setup(p5, container);
      p5.draw = () => callbacksRef.current.draw(p5);
      p5.windowResized = () => callbacksRef.current.onResize?.(p5, container);
    };

    const instance = new P5(sketch, container);

    return () => {
      instance.remove();
    };
  }, []);

  return containerRef;
}
