import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../theme';
import {Grain, Rings} from '../components/Primitives';
import {LOGO} from '../logo-path';

const LogoMark: React.FC<{size: number; color?: string; glow?: boolean; opacity?: number}> = ({size, color = C.paper, glow = false, opacity = 1}) => {
  const h = (size * LOGO.height) / LOGO.width;
  return (
    <svg
      width={size}
      height={h}
      viewBox={`0 0 ${LOGO.width} ${LOGO.height}`}
      style={{display: 'block', opacity, filter: glow ? `drop-shadow(0 0 40px ${C.mint}44)` : undefined}}
    >
      <path d={LOGO.detail} fill={color} fillRule="evenodd" />
    </svg>
  );
};

/** 325 – 371f: mark assembly, wordmark, tagline, fade. */
export const S6Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const assemble = spring({frame: frame - 2, fps, config: {damping: 15, stiffness: 90, mass: 0.9}});
  const settle = interpolate(frame, [0, 12], [1, 0], {extrapolateRight: 'clamp'});
  const scale = interpolate(assemble, [0, 1], [0.55, 1]);
  const tagline = interpolate(frame, [26, 34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const fadeOut = interpolate(frame, [42, 47], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rings = interpolate(frame, [0, 16], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <div style={{position: 'absolute', inset: 0, background: C.ink, overflow: 'hidden', opacity: 1 - fadeOut}}>
      <Rings cx={960} cy={490} opacity={0.12 * rings} from={90} to={520} scale={interpolate(frame, [0, 46], [0.85, 1.06])} />
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 46%, ${C.mint}09 0%, transparent 52%)`, opacity: rings}} />

      {/* assembling mark: a few offset echoes converge onto the final lockup */}
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 486,
          width: 680,
          height: (680 * LOGO.height) / LOGO.width,
          marginLeft: -340,
          marginTop: (-680 * LOGO.height) / LOGO.width / 2,
          transform: `scale(${scale})`,
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => {
          const o = (i + 1) * 22 * settle;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: settle * (0.26 - i * 0.04),
                transform: `translate(${-o}px, ${-o * 0.55}px) rotate(${o * 0.03}deg) scale(${1 + o * 0.0012})`,
              }}
            >
              <LogoMark size={680} />
            </div>
          );
        })}
        <div style={{position: 'relative'}}>
          <LogoMark size={680} />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 828,
          textAlign: 'center',
          fontFamily: F.serif,
          fontSize: 58,
          letterSpacing: '-0.01em',
          opacity: tagline,
          transform: `translateY(${(1 - tagline) * 24}px)`,
        }}
      >
        <span style={{color: C.mint}}>Huggable</span>
        <span style={{color: 'rgba(242,240,235,0.55)'}}> UX for un-huggable systems.</span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 150,
          textAlign: 'center',
          fontFamily: F.mono,
          fontSize: 15,
          letterSpacing: '0.36em',
          color: 'rgba(242,240,235,0.30)',
          opacity: tagline * 0.9,
        }}
      >
        UX MOTION · CRAFTED WITH REMOTION
      </div>

      <Grain opacity={0.05} frame={frame} />
    </div>
  );
};
