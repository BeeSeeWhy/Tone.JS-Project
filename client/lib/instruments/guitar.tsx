'use client';

import { useState } from 'react';
import * as Tone from 'tone';

// Standard tuning, high string drawn on top (matches how tab is usually read).
const STRINGS = [
  { note: 'E4', strokeWidth: 1.2 },
  { note: 'B3', strokeWidth: 1.6 },
  { note: 'G3', strokeWidth: 2 },
  { note: 'D3', strokeWidth: 2.8 },
  { note: 'A2', strokeWidth: 3.6 },
  { note: 'E2', strokeWidth: 4.4 },
];

const VB_W = 860;
const VB_H = 220;
const CY = 110;
const NECK_X1 = 230;
const NUT_X = 72;
const BRIDGE_X = 758;
const STRING_TOP_Y = 75;
const STRING_BOTTOM_Y = 145;
const HOLE_CX = 518;
const HOLE_R = 56;
// Strings are only pluckable where they cross the body, over the sound hole.
const PLUCK_X0 = 420;
const PLUCK_X1 = 740;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// Body outline as (x, half-height) landmarks, run through a Catmull-Rom-style
// spline (continuous slope at every landmark) so the outline flows smoothly
// through each point instead of easing to a dead stop at each one — that flat
// "shoulder" at every landmark is what read as lumpy with a plain smoothstep.
// First point matches the neck's half-height so the two pieces join with no
// seam; last point rounds the tail off.
const BODY_KEYFRAMES: [number, number][] = [
  [230, 40],
  [300, 68],
  [365, 86],
  [430, 74],
  [500, 62],
  [575, 83],
  [660, 112],
  [740, 96],
  [800, 50],
  [828, 34],
];
const BODY_X0 = BODY_KEYFRAMES[0][0];
const BODY_X1 = BODY_KEYFRAMES[BODY_KEYFRAMES.length - 1][0];
const BODY_SAMPLES = 120;

function keyframeTangent(i: number): number {
  const n = BODY_KEYFRAMES.length;
  const prev = BODY_KEYFRAMES[Math.max(i - 1, 0)];
  const next = BODY_KEYFRAMES[Math.min(i + 1, n - 1)];
  return (next[1] - prev[1]) / (next[0] - prev[0]);
}

// Cubic Hermite interpolation between two keyframes using Catmull-Rom tangents.
function bodyHalfHeight(x: number): number {
  for (let i = 0; i < BODY_KEYFRAMES.length - 1; i++) {
    const [x0, h0] = BODY_KEYFRAMES[i];
    const [x1, h1] = BODY_KEYFRAMES[i + 1];
    if (x >= x0 && x <= x1) {
      const dx = x1 - x0;
      const t = (x - x0) / dx;
      const t2 = t * t;
      const t3 = t2 * t;
      const m0 = keyframeTangent(i) * dx;
      const m1 = keyframeTangent(i + 1) * dx;
      const h00 = 2 * t3 - 3 * t2 + 1;
      const h10 = t3 - 2 * t2 + t;
      const h01 = -2 * t3 + 3 * t2;
      const h11 = t3 - t2;
      return h00 * h0 + h10 * m0 + h01 * h1 + h11 * m1;
    }
  }
  return BODY_KEYFRAMES[BODY_KEYFRAMES.length - 1][1];
}

function buildBodyPath(): string {
  const top: string[] = [];
  const bottom: string[] = [];
  for (let i = 0; i <= BODY_SAMPLES; i++) {
    const x = lerp(BODY_X0, BODY_X1, i / BODY_SAMPLES);
    const h = bodyHalfHeight(x);
    top.push(`${x.toFixed(1)},${(CY - h).toFixed(1)}`);
    bottom.push(`${x.toFixed(1)},${(CY + h).toFixed(1)}`);
  }
  bottom.reverse();
  return `M${top.join(' L')} L${bottom.join(' L')} Z`;
}

const BODY_PATH = buildBodyPath();

const HEADSTOCK_PATH = `
  M0,${CY - 40} C20,${CY - 42} 55,${CY - 58} 68,${CY - 40}
  C78,${CY - 25} 78,${CY + 25} 68,${CY + 40}
  C55,${CY + 58} 20,${CY + 42} 0,${CY + 40} Z
`;

const PICKGUARD_PATH = `
  M598,${CY + 18} C648,${CY + 8} 700,${CY + 24} 706,${CY + 56}
  C710,${CY + 88} 662,${CY + 104} 616,${CY + 92}
  C580,${CY + 82} 575,${CY + 40} 598,${CY + 18} Z
`;

const FRET_XS = [96, 128, 156, 182, 206];
const FRET_MARKERS = [128, 182];

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
  const [plucks] = useState(() => {
    const body = new Tone.Freeverb({ roomSize: 0.7, dampening: 3000, wet: 0.25 }).toDestination();
    return STRINGS.map(
      () => new Tone.PluckSynth({ attackNoise: 0.5, dampening: 7000, resonance: 0.96 }).connect(body),
    );
  });

  const pluck = (index: number, note: string) => {
    plucks[index]?.triggerAttack(note);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-10">
      <div className="relative h-64 shrink-0" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="guitarWood" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#dba565" />
              <stop offset="55%" stopColor="#b3763a" />
              <stop offset="100%" stopColor="#875323" />
            </linearGradient>
            <linearGradient id="guitarNeckWood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6b431f" />
              <stop offset="100%" stopColor="#4f2f16" />
            </linearGradient>
          </defs>

          {/* neck + headstock */}
          <rect
            x={0}
            y={CY - 40}
            width={NECK_X1}
            height={80}
            fill="url(#guitarNeckWood)"
            stroke="#3a2210"
            strokeWidth={1.5}
          />
          {FRET_XS.map(x => (
            <line key={x} x1={x} y1={CY - 40} x2={x} y2={CY + 40} stroke="#d4d4d8" strokeWidth={1.5} opacity={0.55} />
          ))}
          {FRET_MARKERS.map(x => (
            <circle key={x} cx={x} cy={CY} r={4} fill="#e4e4e7" opacity={0.5} />
          ))}
          <path d={HEADSTOCK_PATH} fill="url(#guitarNeckWood)" stroke="#3a2210" strokeWidth={1.5} strokeLinejoin="round" />
          <rect x={NUT_X - 3} y={CY - 40} width={4} height={80} fill="#f3ead9" opacity={0.85} />
          {STRINGS.map((_, i) => (
            <circle
              key={i}
              cx={26 + (i % 2) * 30}
              cy={CY - 34 + i * 13.6}
              r={5}
              fill="#d4d4d8"
              stroke="#27272a"
              strokeWidth={1}
            />
          ))}

          {/* body */}
          <path d={BODY_PATH} fill="url(#guitarWood)" stroke="#5c3a1c" strokeWidth={2.5} strokeLinejoin="round" />
          <path
            d={BODY_PATH}
            fill="none"
            stroke="#f3d9ae"
            strokeWidth={1}
            strokeLinejoin="round"
            opacity={0.35}
            transform="scale(0.985)"
            style={{ transformOrigin: `${(BODY_X0 + BODY_X1) / 2}px ${CY}px` }}
          />
          <path d={PICKGUARD_PATH} fill="#1b1108" opacity={0.55} />
          <circle cx={HOLE_CX} cy={CY} r={HOLE_R} fill="#150d06" />
          <circle cx={HOLE_CX} cy={CY} r={HOLE_R + 7} fill="none" stroke="#3f2711" strokeWidth={4} />
          <circle cx={HOLE_CX} cy={CY} r={HOLE_R + 11} fill="none" stroke="#f3d9ae" strokeWidth={1} opacity={0.4} />

          {/* bridge */}
          <rect
            x={BRIDGE_X}
            y={STRING_TOP_Y - 8}
            width={16}
            height={STRING_BOTTOM_Y - STRING_TOP_Y + 16}
            rx={4}
            fill="#241408"
          />

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
