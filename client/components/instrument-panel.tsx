'use client';

import { useEffect, useState } from 'react';
import * as Tone from 'tone';
import type { Instrument } from '@/lib/instruments/registry';
import { useAppState, useAppDispatch } from '@/lib/app-state';

export function InstrumentPanel({ instrument }: { instrument: Instrument }) {
  const { playingNotes } = useAppState();
  const dispatch = useAppDispatch();

  const [synth, setSynth] = useState(
    () => new Tone.Synth({ oscillator: { type: 'sine' } as Tone.OmniOscillatorOptions }).toDestination(),
  );

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
      if (value.idx === eachNote.length - 1) {
        dispatch({ type: 'STOP_SONG' });
      }
    }, noteObjs).start(0);

    Tone.Transport.start();

    return () => {
      Tone.Transport.cancel();
    };
  }, [playingNotes, synth, dispatch]);

  const InstrumentComponent = instrument.Component;

  return (
    <div className="border-b border-white/10 bg-zinc-950">
      <div className="flex h-16 items-center px-6 text-lg font-medium text-zinc-100">{instrument.name}</div>
      <InstrumentComponent synth={synth} setSynth={setSynth} />
    </div>
  );
}
