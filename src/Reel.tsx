import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {C} from './theme';
import {Hud} from './components/Hud';
import {S1Intro} from './scenes/S1Intro';
import {S2Type} from './scenes/S2Type';
import {S3Payment} from './scenes/S3Payment';
import {S4Micro, MICRO_SCENES} from './scenes/S4Micro';
import {S5Collage} from './scenes/S5Collage';
import {S6Outro} from './scenes/S6Outro';
import {CUES} from './audio';

export type Cue = {at: number; src: string; volume: number; rate?: number};

const lightBackgrounds: [number, number][] = [
  [38, 88], // kinetic type
  [200, 212], // growth chart
  [224, 236], // mirror
  [248, 259], // accessibility
];

const isLight = (frame: number) => lightBackgrounds.some(([a, b]) => frame >= a && frame < b);

/** Master gain for the sound design — the cue sheet is written at unity. */
const MASTER = 2;

const SoundTrack: React.FC = () => (
  <>
    <Audio src={staticFile('sfx/pad.wav')} volume={0.16} loop />
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.round(c.at)} durationInFrames={110} layout="none">
        <Audio src={staticFile(c.src)} volume={Math.min(1, c.volume * MASTER)} playbackRate={c.rate ?? 1} />
      </Sequence>
    ))}
  </>
);

export const Reel: React.FC = () => {
  const frame = useCurrentFrame();
  const hudFade = interpolate(frame, [360, 369], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: C.ink}}>
      <Sequence from={0} durationInFrames={38} name="01 Intro">
        <S1Intro />
      </Sequence>
      <Sequence from={38} durationInFrames={50} name="02 Kinetic type">
        <S2Type />
      </Sequence>
      <Sequence from={88} durationInFrames={89} name="03 Payment terminal">
        <S3Payment />
      </Sequence>
      <Sequence from={177} durationInFrames={94} name="04 Micro interactions">
        <S4Micro />
      </Sequence>
      <Sequence from={271} durationInFrames={54} name="05 Systems collage">
        <S5Collage />
      </Sequence>
      <Sequence from={325} durationInFrames={46} name="06 Outro">
        <S6Outro />
      </Sequence>

      <Hud frame={frame} light={isLight(frame)} opacity={hudFade} />
      <SoundTrack />
    </AbsoluteFill>
  );
};

export {MICRO_SCENES};
