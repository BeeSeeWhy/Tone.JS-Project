'use client';

import { useSearchParams } from 'next/navigation';
import * as Tone from 'tone';
import { Music } from 'lucide-react';
import { SideNav } from './side-nav';
import { InstrumentPanel } from './instrument-panel';
import { VisualizerPanel } from './visualizer-panel';
import { instruments } from '@/lib/instruments/registry';
import { visualizers } from '@/lib/visualizers/registry';
import { DEFAULT_INSTRUMENT_ID, DEFAULT_VISUALIZER_ID } from '@/lib/default-selection';

function WelcomePanel() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
      <Music className="size-10 text-violet-400" />
      <h1 className="text-2xl font-semibold text-zinc-100">Welcome to Tone.js Fun.</h1>
      <p className="max-w-sm text-zinc-500">
        Select an instrument and a visualizer on the left to serve some fresh beats.
      </p>
    </div>
  );
}

export function AppShell() {
  const searchParams = useSearchParams();
  const instrument = instruments.find(
    i => i.id === (searchParams.get('instrument') ?? DEFAULT_INSTRUMENT_ID)
  );
  const visualizer = visualizers.find(
    v => v.id === (searchParams.get('visualizer') ?? DEFAULT_VISUALIZER_ID)
  );

  return (
    <div className="flex min-h-screen bg-zinc-950" onClick={() => void Tone.start()}>
      <SideNav />
      <main className="ml-64 flex flex-1 flex-col">
        {instrument ? (
          <>
            <InstrumentPanel instrument={instrument} />
            {visualizer && <VisualizerPanel visualizer={visualizer} instrumentColor={instrument.color} />}
          </>
        ) : (
          <WelcomePanel />
        )}
      </main>
    </div>
  );
}
