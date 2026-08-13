import type { ReactNode } from 'react';

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex h-1/3 flex-col border-b border-white/10 p-4">
      <div className="mb-2 text-xs font-semibold tracking-wide text-zinc-500 uppercase">{title}</div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
