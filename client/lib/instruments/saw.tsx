'use client';

import { useState } from 'react';
import * as Tone from 'tone';

const NOTE_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const NOTES_PER_OCTAVE = NOTE_NAMES.length;
const OCTAVES = [3, 4, 5, 6];

function SawBlade({ note }: { note: string }) {
  const [sampler] = useState(
    () => new Tone.Sampler({ urls: { C5: '/musical-saw.wav' } }).toDestination(),
  );

  return (
    <button
      onMouseDown={() => sampler.triggerAttackRelease([note], 1)}
      className="absolute top-0 h-104 w-25 cursor-pointer overflow-hidden rounded-sm border-y border-black/30 transition-transform active:translate-y-0.5"
      aria-label={note}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/sawblade.jpg" alt="" className="h-full w-full object-cover" draggable={false} />
    </button>
  );
}

export function Saw() {
  return (
    <div className="flex flex-col items-center gap-8 py-10">
      <div className="flex items-end gap-6 overflow-x-auto px-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/newhandle.jpg" alt="saw handle" className="h-104 w-40 shrink-0 rounded-sm object-cover" />
        <div className="relative h-104" style={{ width: `${OCTAVES.length * NOTES_PER_OCTAVE * 6.5}rem` }}>
          {OCTAVES.map(octave =>
            NOTE_NAMES.map((note, i) => {
              const globalIndex = (octave - OCTAVES[0]) * NOTES_PER_OCTAVE + i;
              return (
                <div key={`${note}${octave}`} className="absolute top-0" style={{ left: `${globalIndex * 6.5}rem` }}>
                  <SawBlade note={`${note}${octave}`} />
                </div>
              );
            }),
          )}
        </div>
      </div>
      <p className="max-w-md text-center text-sm text-zinc-500">
        Click a blade to bow the saw. Every key plays the same sampled tone, pitch-shifted.
      </p>
    </div>
  );
}
