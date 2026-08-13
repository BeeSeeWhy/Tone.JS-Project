'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { Circle, CircleDot } from 'lucide-react';

export function NavItem({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      scroll={false}
      className={clsx(
        'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
        active ? 'font-medium text-violet-300' : 'text-zinc-400 hover:text-zinc-100',
      )}
    >
      {active ? <CircleDot className="size-4 shrink-0" /> : <Circle className="size-4 shrink-0" />}
      <span className="truncate">{label}</span>
    </Link>
  );
}
