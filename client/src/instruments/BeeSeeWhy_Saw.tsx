import * as Tone from 'tone';
import classNames from 'classnames';
import { List, Range } from 'immutable';
import { Instrument, InstrumentProps } from '../Instruments';
import React from 'react'
import { useState } from 'react'; 

interface SawNoteProps {
    note: string; // C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, B
    duration?: string;
    synth?: Tone.Synth; // Contains library code for making sound
    minor?: boolean; // True if minor key, false if major key
    octave: number;
    index: number;
}

export function SawNote({ 
                              note,
                              octave,
                              synth,
                              minor,
                              index,}: SawNoteProps): JSX.Element {
                                const [newSample] = useState(
                                    new Tone.Sampler({
                                      urls:{
                                        C5: "musical-saw.wav", //
                                      },
                                    }).toDestination()
                                  );
                                    
                                  const sawSample = (note: string) => {
                                    newSample.triggerAttackRelease([`${note}`], 1);
                                  };

                                  
    return (
        <div
            onMouseDown={() => sawSample(`${note}`)} 
            onMouseUp={() => synth?.triggerRelease('+0.25')}
            className={classNames('ba pointer absolute dim', {
                // 'bg-black black h3': minor, // minor keys are black
                'bg-black white h3': minor, // minor keys are black
                'black bg-white h4': !minor, // major keys are white
              })}
              style={{
                // CSS
                top: 0,
                left: `${index * 2}rem`,
                zIndex: minor ? 1 : 0,
                width: minor ? '1.5rem' : '2rem',
                marginLeft: minor ? '0.25rem' : 0,
              }}
            ></div>
    );
}


function SawType({ title, onClick,active }: any): JSX.Element {
    return (
        <div
            onClick={onClick}
            className={classNames('dim pointer ph2 pv1 ba mr2 br1 fw7 bw1', {
                'b--black black': active,
                'gray b--light-gray': !active,})}
        >
            {title}
        </div>
    );
}

function Saw({ synth, setSynth }: InstrumentProps): JSX.Element {
    const SawList = List([
        { note: 'C', idx: 0},
        { note: 'Db', idx: 0.5},
        { note: 'D', idx: 1},
        { note: 'Eb', idx: 1.5},
        { note: 'E', idx: 2 },
        { note: 'F', idx: 3},
        { note: 'Gb', idx: 3.5},
        { note: 'G', idx: 4},
        { note: 'Ab', idx: 4.5},
        { note: 'A', idx: 5},
        { note: 'Bb', idx: 5.5},
        { note: 'B', idx: 6}
    ]);

    const setOscillator = (newType: Tone.ToneOscillatorType) => {
        setSynth(oldSynth => {
            oldSynth.disconnect();
            return new Tone.Synth({
                oscillator: { type: newType } as Tone.OmniOscillatorOptions,
                
            }).toDestination();
        });
    };

    const oscillators: List<OscillatorType> = List([
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
    ]) as List<OscillatorType>;

    return (
        <div className="pv4">
            <div className="relative dib h4  w-100 ml4">
                {Range(2, 7).map(octave =>
                    SawList.map(key => {
                        const isMinor = key.note.indexOf('b') !== -1;
                        const note = `${key.note}${octave}`;
                        return (
                            <SawNote
                                key={note} //react key
                                note={note}
                                synth={synth}
                                minor={isMinor}
                                octave={octave}
                                index={(octave - 2) * 7 + key.idx}
                            />
                        );
                    }),
                )}

            </div>
            <div className={'pl4 pt4 flex'}>
                {oscillators.map(o => (
                    <SawType
                        key={o}
                        title={o}
                        onClick={() => setOscillator(o)}
                        active={synth?.oscillator.type === o}
                    />
        ))}
      </div>
        
        </div>
    );
}



export const SawInstrument = new Instrument("BeeSeeWhy - Saw", Saw);