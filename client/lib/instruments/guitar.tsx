'use client';

import { useState } from 'react';
import * as Tone from 'tone';

// Standard tuning, high string drawn on top (matches how tab is usually read).
const STRINGS = [
  { note: 'E4', strokeWidth: 1 },
  { note: 'B3', strokeWidth: 1.3 },
  { note: 'G3', strokeWidth: 1.6 },
  { note: 'D3', strokeWidth: 2.2 },
  { note: 'A2', strokeWidth: 2.8 },
  { note: 'E2', strokeWidth: 3.4 },
];

const VB_W = 900;
const VB_H = 220;
const NECK_X1 = 230;
const NUT_X = 34;
const BRIDGE_X = 760;
const STRING_TOP_Y = 88;
const STRING_BOTTOM_Y = 132;
const HOLE_CX = 500;
const HOLE_CY = 110;
const HOLE_R = 52;
// Strings are only pluckable where they cross the body, over the sound hole.
const PLUCK_X0 = 360;
const PLUCK_X1 = 740;

const BODY_PATH = `
  M${NECK_X1},60
  C300,18 385,8 435,28
  C485,6 565,2 615,32
  C705,50 765,108 742,152
  C722,196 642,218 560,206
  C498,222 438,222 378,206
  C298,216 233,190 218,150
  C203,113 198,84 ${NECK_X1},60
  Z
`;

function stringY(index: number) {
  const t = index / (STRINGS.length - 1);
  return STRING_TOP_Y + t * (STRING_BOTTOM_Y - STRING_TOP_Y);
}

function pct(value: number, total: number) {
  return `${(value / total) * 100}%`;
}

function GuitarString({
  index,
  note,
  pluck,
}: {
  index: number;
  note: string;
  pluck: (index: number, note: string) => void;
}) {
  const rowHeight = (STRING_BOTTOM_Y - STRING_TOP_Y) / (STRINGS.length - 1);
  const y = stringY(index);

  return (
    <button
      onMouseDown={() => pluck(index, note)}
      aria-label={`${note} string`}
      className="absolute cursor-pointer transition-colors hover:bg-amber-100/10 active:bg-amber-100/20"
      style={{
        left: pct(PLUCK_X0, VB_W),
        width: pct(PLUCK_X1 - PLUCK_X0, VB_W),
        top: pct(y - rowHeight / 2, VB_H),
        height: pct(rowHeight, VB_H),
      }}
    />
  );
}

export function Guitar() {
  const [plucks] = useState(() => STRINGS.map(() => new Tone.PluckSynth().toDestination()));

  const pluck = (index: number, note: string) => {
    plucks[index]?.triggerAttack(note);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-10">
      <div className="relative h-44" style={{ width: '45rem' }}>
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="guitarWood" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d9a15c" />
              <stop offset="55%" stopColor="#b3763a" />
              <stop offset="100%" stopColor="#8a5726" />
            </linearGradient>
          </defs>

          {/* neck + headstock */}
          <rect x={0} y={96} width={NECK_X1} height={28} fill="#5b3a1e" />
          <rect x={0} y={70} width={40} height={80} rx={10} fill="#4a2f18" />
          {STRINGS.map((_, i) => (
            <circle key={i} cx={16} cy={80 + i * 14} r={4.5} fill="#d4d4d8" stroke="#3f3f46" strokeWidth={1} />
          ))}

          {/* body */}
          <path d={BODY_PATH} fill="url(#guitarWood)" stroke="#5c3a1c" strokeWidth={2} strokeLinejoin="round" />
          <circle cx={HOLE_CX} cy={HOLE_CY} r={HOLE_R} fill="#1c1207" />
          <circle cx={HOLE_CX} cy={HOLE_CY} r={HOLE_R + 6} fill="none" stroke="#3f2711" strokeWidth={3} />

          {/* bridge */}
          <rect x={BRIDGE_X} y={STRING_TOP_Y - 6} width={14} height={STRING_BOTTOM_Y - STRING_TOP_Y + 12} rx={3} fill="#2a1a0d" />

          {/* strings */}
          {STRINGS.map((s, i) => (
            <line
              key={s.note}
              x1={NUT_X}
              y1={stringY(i)}
              x2={BRIDGE_X}
              y2={stringY(i)}
              stroke="#e4e4e7"
              strokeWidth={s.strokeWidth}
              opacity={0.9}
            />
          ))}
        </svg>

        {STRINGS.map((s, i) => (
          <GuitarString key={s.note} index={i} note={s.note} pluck={pluck} />
        ))}
      </div>
      <p className="max-w-md text-center text-sm text-zinc-500">
        Click a string over the sound hole to pluck it. Standard tuning, top to bottom: E4, B3, G3, D3, A2, E2.
      </p>
    </div>
  );
}
