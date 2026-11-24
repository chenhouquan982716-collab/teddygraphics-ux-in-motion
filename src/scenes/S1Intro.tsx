import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../theme';
import {Grain, Rings, Vignette} from '../components/Primitives';

/** 0 – 37f: radial reveal, dot ignition, the toggle that switches the reel on. */
export const S1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const dotIn = spring({frame: frame - 4, fps, config: {damping: 12, stiffness: 140, mass: 0.6}});
  const morph = interpolate(frame, [12, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const toggle = spring({frame: frame - 22, fps, config: {damping: 14, stiffness: 150, mass: 0.85}});
  const knobX = interpolate(toggle, [0, 1], [14, 121]);

  const width = interpolate(morph, [0, 1], [16, 203]);
  const height = interpolate(morph, [0, 1], [16, 88]);
  const radius = height / 2;
  const on = frame >= 24;

  const flash = interpolate(frame, [35.8, 38.4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad)});
  const flashR = flash * 1700;

  return (
    <div style={{position: 'absolute', inset: 0, background: C.ink, overflow: 'hidden'}}>
      <Vignette color={C.mint} strength={0.07} />
      <Rings cx={960} cy={540} opacity={0.14} scale={interpolate(frame, [0, 38], [1, 1.35])} />
      <Rings cx={960} cy={540} opacity={0.05} from={480} to={760} scale={interpolate(frame, [0, 38], [1, 1.18])} />

      {/* the toggle */}
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 540,
          width,
          height,
          transform: 'translate(-50%,-50%)',
          borderRadius: radius,
          background: on ? `linear-gradient(180deg, ${C.mint}, ${C.mintDeep})` : '#2B2C31',
          boxShadow: on
            ? `0 0 ${40 + Math.sin(frame / 3) * 12}px ${C.mint}66, inset 0 2px 0 rgba(255,255,255,0.35)`
            : 'inset 0 2px 6px rgba(0,0,0,0.5)',
          opacity: dotIn,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* motion-trail ghost while the knob travels */}
        {frame > 22 && frame < 34 && (
          <div
            style={{
              position: 'absolute',
              left: knobX - 46,
              top: height / 2 - 30,
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: C.mint,
              opacity: 0.35,
              filter: 'blur(6px)',
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            left: knobX,
            top: height / 2 - height * 0.39,
            width: height * 0.78,
            height: height * 0.78,
            borderRadius: '50%',
            background: '#FFFFFF',
            boxShadow: '0 3px 12px rgba(0,0,0,0.28)',
            transform: `scaleX(${1 + (1 - Math.min(1, Math.abs(toggle - 0.5) * 2)) * 0.06})`,
          }}
        />
      </div>

      {/* the white circle that swallows the shot */}
      <div
        style={{
          position: 'absolute',
          left: 960 - flashR,
          top: 540 - flashR,
          width: flashR * 2,
          height: flashR * 2,
          borderRadius: '50%',
          background: C.paper,
          opacity: flash > 0 ? 1 : 0,
        }}
      />

      <Grain opacity={0.05} frame={frame} />
    </div>
  );
};
