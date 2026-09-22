'use client';

import { useState } from 'react';
import * as Tone from 'tone';

const NOTE_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const NOTES_PER_OCTAVE = NOTE_NAMES.length;
const OCTAVES = [3, 4, 5, 6];
const TOTAL_KEYS = OCTAVES.length * NOTES_PER_OCTAVE;

// Blade is drawn full-height at the left edge (where the handle attaches)
// tapering to a point at the right edge (the tip), with a row of ripsaw
// teeth along the bottom that grow shallower toward the tip.
const BLADE_VB_W = 1600;
const BLADE_VB_H = 100;
const BLADE_HANDLE_X = 8;
const BLADE_TOP_Y = 6;
const BLADE_BOTTOM_Y = 94;
const BLADE_TIP_X = 1560;
const BLADE_TIP_Y = 50;
const TEETH_COUNT = 56;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function buildBladePath(): string {
  const points: string[] = [];
  for (let i = 0; i <= TEETH_COUNT; i++) {
    const t = i / TEETH_COUNT;
    const x = lerp(BLADE_TIP_X, BLADE_HANDLE_X, t);
    const baseY = lerp(BLADE_TIP_Y, BLADE_BOTTOM_Y, t);
    points.push(`${x.toFixed(1)},${baseY.toFixed(1)}`);
    if (i < TEETH_COUNT) {
      const tTip = (i + 0.7) / TEETH_COUNT;
      const xTip = lerp(BLADE_TIP_X, BLADE_HANDLE_X, tTip);
      const baseYTip = lerp(BLADE_TIP_Y, BLADE_BOTTOM_Y, tTip);
      const depth = lerp(2, 7, tTip);
      points.push(`${xTip.toFixed(1)},${(baseYTip + depth).toFixed(1)}`);
    }
  }
  return [
    `M${BLADE_HANDLE_X},${BLADE_TOP_Y}`,
    `L${BLADE_TIP_X},${BLADE_TIP_Y}`,
    `L${points.join(' L')}`,
    'Z',
  ].join(' ');
}

const BLADE_PATH = buildBladePath();

// A simplified D-grip handle: an outer silhouette with a hand-hole cut out
// via evenodd fill, plus two rivets, sized to attach flush to the blade.
const HANDLE_PATH = `
  M0,28 L28,18 C72,6 128,24 140,68
  C150,98 150,126 138,154
  C124,180 78,192 28,180 L0,168 Z
  M58,66 C90,54 118,70 122,96
  C126,122 104,144 76,140
  C52,136 42,112 48,90
  C51,80 58,66 58,66 Z
`;

function SawKey({ note, index, sampler }: { note: string; index: number; sampler: Tone.Sampler }) {
  return (
    <button
      onMouseDown={() => sampler.triggerAttackRelease([note], 1)}
      className="absolute top-0 h-full cursor-pointer border-r border-black/15 transition-colors last:border-r-0 hover:bg-white/15 active:bg-white/25"
      style={{ left: `${(index * 100) / TOTAL_KEYS}%`, width: `${100 / TOTAL_KEYS}%` }}
      aria-label={note}
    />
  );
}

export function Saw() {
  const [sampler] = useState(
    () => new Tone.Sampler({ urls: { C5: '/musical-saw.wav' } }).toDestination(),
  );

  return (
    <div className="flex flex-col items-center gap-8 py-10">
      <div className="flex items-end gap-0 overflow-x-auto px-6">
        <svg
          viewBox="0 0 150 200"
          className="h-36 w-27 shrink-0"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="sawWood" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c98a4b" />
              <stop offset="45%" stopColor="#a3672f" />
              <stop offset="100%" stopColor="#7c4d21" />
            </linearGradient>
          </defs>
          <path
            d={HANDLE_PATH}
            fill="url(#sawWood)"
            fillRule="evenodd"
            stroke="#4a2f14"
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <circle cx={20} cy={55} r={5} fill="#3f3f46" stroke="#18181b" strokeWidth={1} />
          <circle cx={20} cy={145} r={5} fill="#3f3f46" stroke="#18181b" strokeWidth={1} />
        </svg>
        <div className="relative h-36 shrink-0" style={{ width: `${TOTAL_KEYS * 3}rem` }}>
          <svg
            viewBox={`0 0 ${BLADE_VB_W} ${BLADE_VB_H}`}
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="sawMetal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#71717a" />
                <stop offset="35%" stopColor="#f4f4f5" />
                <stop offset="55%" stopColor="#d4d4d8" />
                <stop offset="100%" stopColor="#52525b" />
              </linearGradient>
            </defs>
            <path d={BLADE_PATH} fill="url(#sawMetal)" stroke="#3f3f46" strokeWidth={1.5} strokeLinejoin="round" />
          </svg>
          {OCTAVES.map(octave =>
            NOTE_NAMES.map((note, i) => {
              const globalIndex = (octave - OCTAVES[0]) * NOTES_PER_OCTAVE + i;
              return (
                <SawKey key={`${note}${octave}`} note={`${note}${octave}`} index={globalIndex} sampler={sampler} />
              );
            }),
          )}
        </div>
      </div>
      <p className="max-w-md text-center text-sm text-zinc-500">
        Click along the blade to bow the saw. Every key plays the same sampled tone, pitch-shifted.
      </p>
    </div>
  );
}
