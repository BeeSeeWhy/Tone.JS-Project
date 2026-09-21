'use client';

import { useState } from 'react';
import * as Tone from 'tone';

const NOTE_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const NOTES_PER_OCTAVE = NOTE_NAMES.length;
const OCTAVES = [3, 4, 5, 6];
const TOTAL_KEYS = OCTAVES.length * NOTES_PER_OCTAVE;

function SawKey({ note, index, sampler }: { note: string; index: number; sampler: Tone.Sampler }) {
  return (
    <button
      onMouseDown={() => sampler.triggerAttackRelease([note], 1)}
      className="absolute top-0 h-full cursor-pointer border-r border-black/10 transition-colors last:border-r-0 hover:bg-white/15 active:bg-white/25"
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
      <div className="flex items-end gap-4 overflow-x-auto px-6">
        <div className="shrink-0 overflow-hidden rounded-sm border border-black/10 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/saw-handle.jpg" alt="saw handle" className="h-104 w-auto" />
        </div>
        <div className="relative h-104 shrink-0 overflow-hidden rounded-sm border-y border-black/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/saw-blade.jpg" alt="saw blade" className="h-full w-auto select-none" draggable={false} />
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
