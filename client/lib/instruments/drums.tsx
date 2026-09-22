'use client';

import { useState } from 'react';
import * as Tone from 'tone';

const VB_W = 800;
const VB_H = 460;

function createKit() {
  const kick = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 6,
    envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 },
  }).toDestination();

  const tom = new Tone.MembraneSynth({
    pitchDecay: 0.03,
    octaves: 4,
    envelope: { attack: 0.001, decay: 0.3, sustain: 0.02, release: 0.8 },
  }).toDestination();

  const snareFilter = new Tone.Filter(1500, 'highpass').toDestination();
  const snareNoise = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.18, sustain: 0 },
  }).connect(snareFilter);
  const snareBody = new Tone.MembraneSynth({
    pitchDecay: 0.02,
    octaves: 2,
    envelope: { attack: 0.001, decay: 0.12, sustain: 0 },
  }).toDestination();

  const hihat = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.12, release: 0.02 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5,
  }).toDestination();

  const crash = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 1.2, release: 2.5 },
    harmonicity: 5.1,
    modulationIndex: 64,
    resonance: 3000,
    octaves: 1.5,
  }).toDestination();

  return {
    kick: () => kick.triggerAttackRelease('C1', '8n'),
    tom: () => tom.triggerAttackRelease('G2', '8n'),
    snare: () => {
      snareNoise.triggerAttackRelease('16n');
      snareBody.triggerAttackRelease('G2', '16n');
    },
    hihat: (open: boolean) => hihat.triggerAttackRelease('C5', open ? '4n' : '32n'),
    crash: () => crash.triggerAttackRelease('C4', '2n'),
  };
}

function DrumPad({
  cx,
  cy,
  hitR,
  label,
  onHit,
  children,
}: {
  cx: number;
  cy: number;
  hitR: number;
  label: string;
  onHit: () => void;
  children: React.ReactNode;
}) {
  return (
    <g onMouseDown={onHit} className="group cursor-pointer" role="button" aria-label={label} tabIndex={0}>
      {children}
      <circle
        cx={cx}
        cy={cy}
        r={hitR}
        fill="white"
        opacity={0}
        className="transition-opacity duration-75 group-hover:opacity-10 group-active:opacity-25"
      />
    </g>
  );
}

export function Drums() {
  const [kit] = useState(() => createKit());

  return (
    <div className="flex flex-col items-center gap-8 py-10">
      <div className="relative h-96" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-full w-full" aria-hidden="true">
          <defs>
            <radialGradient id="drumHead" cx="40%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#fafaf9" />
              <stop offset="100%" stopColor="#d6d3d1" />
            </radialGradient>
            <linearGradient id="drumShell" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c2410c" />
              <stop offset="100%" stopColor="#7c2d12" />
            </linearGradient>
            <linearGradient id="cymbalMetal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="50%" stopColor="#d4a94a" />
              <stop offset="100%" stopColor="#92702a" />
            </linearGradient>
          </defs>

          {/* stands */}
          <line x1={130} y1={230} x2={130} y2={420} stroke="#3f3f46" strokeWidth={6} />
          <line x1={650} y1={200} x2={650} y2={420} stroke="#3f3f46" strokeWidth={6} />

          {/* hi-hat */}
          <DrumPad cx={130} cy={195} hitR={95} label="Closed hi-hat" onHit={() => kit.hihat(false)}>
            <ellipse cx={130} cy={205} rx={92} ry={16} fill="url(#cymbalMetal)" stroke="#5c4415" strokeWidth={2} />
            <ellipse cx={130} cy={188} rx={88} ry={15} fill="url(#cymbalMetal)" stroke="#5c4415" strokeWidth={2} />
          </DrumPad>
          <g
            onMouseDown={() => kit.hihat(true)}
            className="group cursor-pointer"
            role="button"
            aria-label="Open hi-hat"
            tabIndex={0}
          >
            <circle
              cx={130}
              cy={140}
              r={26}
              fill="white"
              opacity={0}
              className="transition-opacity duration-75 group-hover:opacity-10 group-active:opacity-25"
            />
            <text x={130} y={146} textAnchor="middle" fontSize={12} fill="#d4d4d8" className="select-none">
              open
            </text>
          </g>

          {/* crash */}
          <DrumPad cx={650} cy={165} hitR={110} label="Crash cymbal" onHit={kit.crash}>
            <ellipse cx={650} cy={165} rx={110} ry={22} fill="url(#cymbalMetal)" stroke="#5c4415" strokeWidth={2} />
            <ellipse cx={650} cy={165} rx={22} ry={6} fill="#7c5e22" />
          </DrumPad>

          {/* rack tom */}
          <DrumPad cx={430} cy={210} hitR={78} label="Tom" onHit={kit.tom}>
            <circle cx={430} cy={210} r={78} fill="url(#drumShell)" stroke="#431407" strokeWidth={3} />
            <circle cx={430} cy={210} r={58} fill="url(#drumHead)" stroke="#a8a29e" strokeWidth={2} />
          </DrumPad>

          {/* snare */}
          <DrumPad cx={225} cy={340} hitR={88} label="Snare drum" onHit={kit.snare}>
            <circle cx={225} cy={340} r={88} fill="#e4e4e7" stroke="#3f3f46" strokeWidth={3} />
            <circle cx={225} cy={340} r={66} fill="url(#drumHead)" stroke="#a8a29e" strokeWidth={2} />
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              return (
                <circle
                  key={i}
                  cx={225 + Math.cos(angle) * 84}
                  cy={340 + Math.sin(angle) * 84}
                  r={5}
                  fill="#a1a1aa"
                  stroke="#3f3f46"
                  strokeWidth={1}
                />
              );
            })}
          </DrumPad>

          {/* kick */}
          <DrumPad cx={470} cy={370} hitR={150} label="Kick drum" onHit={kit.kick}>
            <circle cx={470} cy={370} r={150} fill="url(#drumShell)" stroke="#431407" strokeWidth={4} />
            <circle cx={470} cy={370} r={115} fill="url(#drumHead)" stroke="#a8a29e" strokeWidth={2} />
            <circle cx={510} cy={390} r={20} fill="#78716c" opacity={0.5} />
          </DrumPad>
        </svg>
      </div>
      <p className="max-w-md text-center text-sm text-zinc-500">
        Click a piece to hit it — kick, snare, tom, hi-hat (click &ldquo;open&rdquo; for the open hi-hat), and crash.
      </p>
    </div>
  );
}
