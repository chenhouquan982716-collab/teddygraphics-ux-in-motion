import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../theme';
import {Grain} from '../components/Primitives';

const WORDS: {from: number; word: string; size: number; serif: boolean; ls: number; stretch?: number; dy?: number}[] = [
  {from: 0, word: 'UX', size: 680, serif: false, ls: -0.035, dy: 58},
  {from: 19, word: 'IN', size: 560, serif: true, ls: -0.01, dy: 58},
  {from: 31, word: 'MOTION', size: 400, serif: false, ls: 0.004, stretch: 1.03, dy: 10},
];

const O_SCALE = 1;

const GreenO: React.FC<{size: number}> = ({size}) => {
  const d = size * 0.665;
  return (
    <span
      style={{
        display: 'inline-block',
        width: d,
        height: d,
        margin: `0 ${size * 0.03}px`,
        verticalAlign: 'baseline',
        transform: `translateY(${size * 0.005}px) scale(${O_SCALE})`,
        position: 'relative',
      }}
    >
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `conic-gradient(from 118deg, ${C.vivid} 0deg, ${C.vivid} 292deg, #D9D7CF 292deg 360deg)`,
        }}
      />
      <span
        style={{
          position: 'absolute',
          left: '35%',
          top: '35%',
          width: '30%',
          height: '30%',
          borderRadius: '50%',
          background: C.paper,
        }}
      />
    </span>
  );
};

const MaskedWord: React.FC<{word: string; size: number; serif: boolean; ls: number; stretch?: number; dy?: number; start: number; end: number}> = ({
  word,
  size,
  serif,
  ls,
  stretch = 1,
  dy = 0,
  start,
  end,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const chars = word.split('');

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: serif ? F.serif : F.sans,
        fontWeight: serif ? 700 : 900,
        fontSize: size,
        letterSpacing: `${ls}em`,
        lineHeight: 0.86,
        color: C.ink,
        transform: `translateY(${dy}px) scaleX(${stretch})`,
        WebkitTextStroke: serif ? `${size * 0.017}px ${C.ink}` : undefined,
      }}
    >
      {chars.map((ch, i) => {
        const inAt = start + i * 0.7;
        const outAt = end - 6 + i * 0.7;
        const rise = spring({frame: frame - inAt, fps, config: {damping: 24, stiffness: 260, mass: 0.75}});
        const exit = interpolate(frame, [outAt, outAt + 5], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.5, 0, 0.75, 0),
        });
        const y = (1 - rise) * 118 - exit * 128;
        const blur = (1 - rise) * 14 + exit * 10;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              lineHeight: 1,
              paddingBottom: '0.12em',
              marginBottom: '-0.12em',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                transform: `translateY(${y}%)`,
                filter: `blur(${blur}px)`,
                opacity: Math.min(1, rise * 1.6) * (1 - exit * 0.9),
              }}
            >
              {ch === 'O' && word === 'MOTION' ? <GreenO size={size} /> : ch === ' ' ? '\u00A0' : ch}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** 38 – 88f: kinetic type, three words rolling through a mask. */
export const S2Type: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', inset: 0, background: C.paper, overflow: 'hidden'}}>
      {WORDS.map((w, i) => {
        const end = i < WORDS.length - 1 ? WORDS[i + 1].from : 50;
        if (frame < w.from - 2 || frame > end + 2) return null;
        return <MaskedWord key={w.word} {...w} start={w.from} end={end} />;
      })}
      <Grain opacity={0.05} frame={frame} />
    </div>
  );
};
