// 3rd party library imports
import P5 from 'p5';
import * as Tone from 'tone';


// project imports
import { Visualizer } from '../Visualizers';


export const BeeSeeWhyVisualizer = new Visualizer(
    'BeeSeeWhy Visualizer',
    (p5: P5, analyzer: Tone.Analyser) => {
      const width = window.innerWidth;
      const height = window.innerHeight/2;

      p5.background(0);
      p5.stroke(255, 255, 255, 255);
      p5.angleMode('radians');
      p5.noFill();
      p5.frameRate(30);
      const values = analyzer.getValue();
      p5.beginShape();

      for (let i = 0; i < values.length; i++) {
        const value = values[i] as number;
        p5.strokeWeight(value * 200);
        p5.stroke(p5.random(255), p5.random(255), p5.random(255), p5.random(255));
        p5.ellipse(p5.random(width), p5.random(height), 25*(value * 100));
      }

      p5.endShape();

    },
);
