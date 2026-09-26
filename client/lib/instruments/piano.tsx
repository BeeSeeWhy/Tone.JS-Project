'use client';

import { useEffect, useState } from 'react';
import * as Tone from 'tone';
import clsx from 'clsx';
import { useAppState, useAppDispatch } from '@/lib/app-state';

// idx is measured in natural-key widths; minor (black) keys sit at the
// half-step between the naturals that flank them (no black key between E/F
// or B/C, so F jumps straight from E's slot to the next whole slot).
const NOTE_LAYOUT = [
  { note: 'C', minor: false, idx: 0 },
  { note: 'Db', minor: true, idx: 0.5 },
  { note: 'D', minor: false, idx: 1 },
  { note: 'Eb', minor: true, idx: 1.5 },
  { note: 'E', minor: false, idx: 2 },
  { note: 'F', minor: false, idx: 3 },
  { note: 'Gb', minor: true, idx: 3.5 },
  { note: 'G', minor: false, idx: 4 },
  { note: 'Ab', minor: true, idx: 4.5 },
  { note: 'A', minor: false, idx: 5 },
  { note: 'Bb', minor: true, idx: 5.5 },
  { note: 'B', minor: false, idx: 6 },
] as const;

const NATURALS_PER_OCTAVE = 7;
const OCTAVES = [2, 3, 4, 5, 6];

// Tone's public types don't expose the AM/FM oscillator union, only the
// runtime accepts these strings via OmniOscillatorOptions.
const OSCILLATORS: string[] = [
  'sine',
  'sawtooth',
  'square',
  'triangle',
  'fmsine',
  'fmsawtooth',
  'fmtriangle',
  'amsine',
  'amsawtooth',
  'amtriangle',
];

function PianoKey({
  note,
  minor,
  index,
  synth,
  active,
}: {
  note: string;
  minor: boolean;
  index: number;
  synth: Tone.Synth;
  active: boolean;
}) {
  return (
    <div
      onMouseDown={() => synth.triggerAttack(note)}
      onMouseUp={() => synth.triggerRelease('+0.25')}
      onMouseLeave={() => synth.triggerRelease('+0.25')}
      className={clsx(
        'absolute top-0 cursor-pointer select-none rounded-b-md border shadow-sm transition-colors active:brightness-90',
        minor ? 'z-10 h-24 w-8' : 'h-36 w-12',
        active
          ? 'border-violet-300 bg-violet-500'
          : minor
            ? 'border-black/20 bg-zinc-900 hover:bg-zinc-800'
            : 'border-black/20 bg-zinc-50 hover:bg-white',
      )}
      style={{ left: `${index * 2}rem`, marginLeft: minor ? '0.25rem' : 0 }}
    />
  );
}

function OscillatorButton({
  title,
  active,
  onClick,
}: {
  title: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'rounded-full border px-3 py-1 text-sm font-medium transition-colors',
        active
          ? 'border-violet-400 bg-violet-500/20 text-violet-200'
          : 'border-white/10 text-zinc-400 hover:border-white/20 hover:text-zinc-200',
      )}
    >
      {title}
    </button>
  );
}

export function Piano() {
  const { playingNotes } = useAppState();
  const dispatch = useAppDispatch();

  const [synth, setSynth] = useState(
    () => new Tone.Synth({ oscillator: { type: 'sine' } as Tone.OmniOscillatorOptions }).toDestination(),
  );
  const [activeMidi, setActiveMidi] = useState<number | null>(null);

  const setOscillator = (type: string) => {
    setSynth(oldSynth => {
      oldSynth.disconnect();
      return new Tone.Synth({
        oscillator: { type } as Tone.OmniOscillatorOptions,
      }).toDestination();
    });
  };

  useEffect(() => {
    if (!playingNotes) return;

    const eachNote = playingNotes.split(' ');
    const noteObjs = eachNote.map((note, idx) => ({
      idx,
      time: `+${idx / 4}`,
      note,
      velocity: 1,
    }));

    new Tone.Part((time, value) => {
      synth.triggerAttackRelease(value.note, '4n', time, value.velocity);
      const midi = Tone.Frequency(value.note).toMidi();
      const releaseAt = time + Tone.Time('4n').toSeconds();
      Tone.Draw.schedule(() => setActiveMidi(midi), time);
      Tone.Draw.schedule(() => setActiveMidi(current => (current === midi ? null : current)), releaseAt);
      if (value.idx === eachNote.length - 1) {
        dispatch({ type: 'STOP_SONG' });
      }
    }, noteObjs).start(0);

    Tone.Transport.start();

    return () => {
      Tone.Transport.cancel();
      setActiveMidi(null);
    };
  }, [playingNotes, synth, dispatch]);

  return (
    <div className="flex flex-col items-center gap-8 py-10">
      <div
        className="relative h-36 overflow-x-auto px-4"
        style={{ width: `${OCTAVES.length * NATURALS_PER_OCTAVE * 2}rem` }}
      >
        {OCTAVES.map(octave =>
          NOTE_LAYOUT.map(key => {
            const fullNote = `${key.note}${octave}`;
            return (
              <PianoKey
                key={fullNote}
                note={fullNote}
                minor={key.minor}
                synth={synth}
                active={activeMidi !== null && Tone.Frequency(fullNote).toMidi() === activeMidi}
                index={(octave - OCTAVES[0]) * NATURALS_PER_OCTAVE + key.idx}
              />
            );
          }),
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-2 px-4">
        {OSCILLATORS.map(o => (
          <OscillatorButton
            key={o}
            title={o}
            active={synth.oscillator.type === o}
            onClick={() => setOscillator(o)}
          />
        ))}
      </div>
    </div>
  );
}
