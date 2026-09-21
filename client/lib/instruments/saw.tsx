'use client';

import { useState } from 'react';
import * as Tone from 'tone';

const NOTE_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const NOTES_PER_OCTAVE = NOTE_NAMES.length;
const OCTAVES = [3, 4, 5, 6];
const KEY_WIDTH_REM = 6.5;

function SawKey({ note, sampler }: { note: string; sampler: Tone.Sampler }) {
  return (
    <button
      onMouseDown={() => sampler.triggerAttackRelease([note], 1)}
      className="absolute top-0 h-full w-25 cursor-pointer border-r border-black/10 transition-colors hover:bg-white/10 active:bg-white/20"
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
      <div className="flex items-end gap-6 overflow-x-auto px-6">
        <div className="w-40 shrink-0 rounded-sm border border-black/10 bg-zinc-100 p-3 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/newhandle.jpg" alt="saw handle" className="w-full object-contain" />
        </div>
        <div
          className="relative h-104 shrink-0 overflow-hidden rounded-sm border-y border-black/30"
          style={{
            width: `${OCTAVES.length * NOTES_PER_OCTAVE * KEY_WIDTH_REM}rem`,
            backgroundImage: 'url(/saw-blade-texture.jpg)',
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 100%',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/saw-blade-badge.jpg"
            alt=""
            className="pointer-events-none absolute top-1/2 left-6 h-48 w-auto -translate-y-1/2 opacity-80"
            style={{
              maskImage: 'radial-gradient(ellipse 55% 55% at center, black 45%, transparent 90%)',
              WebkitMaskImage: 'radial-gradient(ellipse 55% 55% at center, black 45%, transparent 90%)',
            }}
          />
          {OCTAVES.map(octave =>
            NOTE_NAMES.map((note, i) => {
              const globalIndex = (octave - OCTAVES[0]) * NOTES_PER_OCTAVE + i;
              return (
                <div
                  key={`${note}${octave}`}
                  className="absolute top-0 h-full"
                  style={{ left: `${globalIndex * KEY_WIDTH_REM}rem` }}
                >
                  <SawKey note={`${note}${octave}`} sampler={sampler} />
                </div>
              );
            }),
          )}
        </div>
      </div>
      <p className="max-w-md text-center text-sm text-zinc-500">
        Click along the blade to bow the saw. Every key plays the same sampled tone, pitch-shifted.
      </p>
      <p className="max-w-md text-center text-xs text-zinc-700">
        Blade photo by Sägenprofi, Wikimedia Commons (CC BY-SA 3.0).
      </p>
    </div>
  );
}
