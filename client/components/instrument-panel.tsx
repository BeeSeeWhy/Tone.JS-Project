'use client';

import type { Instrument } from '@/lib/instruments/registry';

export function InstrumentPanel({ instrument }: { instrument: Instrument }) {
  const InstrumentComponent = instrument.Component;

  return (
    <div className="border-b border-white/10 bg-zinc-950">
      <div className="flex h-16 items-center px-6 text-lg font-medium text-zinc-100">{instrument.name}</div>
      <InstrumentComponent />
    </div>
  );
}
