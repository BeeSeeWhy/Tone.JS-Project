'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Music2 } from 'lucide-react';
import { Section } from './ui/section';
import { NavItem } from './ui/nav-item';
import { instruments } from '@/lib/instruments/registry';
import { visualizers } from '@/lib/visualizers/registry';
import { useAppState, useAppDispatch } from '@/lib/app-state';

function withParam(searchParams: URLSearchParams, key: string, value: string): string {
  const params = new URLSearchParams(searchParams);
  params.set(key, value);
  return `/?${params.toString()}`;
}

export function SideNav() {
  const searchParams = useSearchParams();
  const activeInstrument = searchParams.get('instrument');
  const activeVisualizer = searchParams.get('visualizer');

  const { songs } = useAppState();
  const dispatch = useAppDispatch();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex w-64 flex-col border-r border-white/10 bg-zinc-950">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-4">
        <Image src="/logo.svg" alt="" width={28} height={28} />
        <span className="text-lg font-semibold text-zinc-100">Band Camp</span>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Section title="Instruments">
          {instruments.map(i => (
            <NavItem
              key={i.id}
              href={withParam(searchParams, 'instrument', i.id)}
              label={i.name}
              active={i.id === activeInstrument}
            />
          ))}
        </Section>

        <Section title="Visualizers">
          {visualizers.map(v => (
            <NavItem
              key={v.id}
              href={withParam(searchParams, 'visualizer', v.id)}
              label={v.name}
              active={v.id === activeVisualizer}
            />
          ))}
        </Section>

        <Section title="Playlist">
          {songs.length === 0 && <p className="text-sm text-zinc-600 italic">No songs loaded.</p>}
          {songs.map(song => (
            <button
              key={song.id}
              onClick={() => dispatch({ type: 'PLAY_SONG', id: song.id })}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-zinc-400 transition-colors hover:text-zinc-100"
            >
              <Music2 className="size-4 shrink-0" />
              <span className="truncate italic">
                {song.songTitle} by {song.artist} ({song.year})
              </span>
            </button>
          ))}
        </Section>
      </div>
    </aside>
  );
}
