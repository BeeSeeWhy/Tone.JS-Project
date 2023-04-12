import * as Tone from 'tone';
import classNames from 'classnames';
import { List, Range } from 'immutable';
import { Instrument, InstrumentProps } from '../Instruments';
import { useState } from 'react'; 
import blade from "../img/sawblade.jpg"
import handle from '../img/newhandle.jpg'

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

                                  const sawImage = {
                                    width: "100px",
                                    height: "415px"
                                  };

                                  
    return (
        <div
            onMouseDown={() => sawSample(`${note}`)} 
            onMouseUp={() => synth?.triggerRelease('+0.25')}
            className={classNames('bt bb pointer absolute dim', {
            })}
            style={{
              // CSS
              top: 0 ,
              left: `${index * 6}rem`,
              width: '3rem',
              marginLeft:'0.25rem',
            }}
          >
            <img src={ blade } style={sawImage} alt="saw blade "/>
          </div>
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
        { note: 'F', idx: 2.5},
        { note: 'Gb', idx: 3},
        { note: 'G', idx: 3.5},
        { note: 'Ab', idx: 4},
        { note: 'A', idx: 4.5},
        { note: 'Bb', idx: 5},
        { note: 'B', idx: 5.5}
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
    ]) as List<OscillatorType>;


    return (
        <div className="pv4">
            <div className="relative dib h4  w-100 ml4">
                <img src={ handle } alt="clown saw" height="500px" width="300px" />
                {Range(3, 7).map(octave =>
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
                                index={(octave - 2) * 3.1 + key.idx}
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



export const SawInstrument2 = new Instrument("BeeSeeWhy - Saw2", Saw);