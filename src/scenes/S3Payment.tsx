import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../theme';
import {Grain, Vignette} from '../components/Primitives';
import {Phone, PhoneStep, Receipt} from '../components/Phone';

type Step = {
  at: number;
  word: string;
  step: number;
  screen: PhoneStep;
  green?: boolean;
};

const STEPS: Step[] = [
  {at: 0, word: 'Amount', step: 1, screen: 'amount'},
  {at: 21, word: 'Tap.', step: 2, screen: 'tap'},
  {at: 33, word: 'PIN.', step: 3, screen: 'pin'},
  {at: 57, word: 'Approved.', step: 4, screen: 'approved', green: true},
  {at: 69, word: 'Printed.', step: 5, screen: 'printed'},
];

const PARTICLES = Array.from({length: 34}).map((_, i) => {
  const a = -Math.PI * 0.92 + (i / 34) * Math.PI * 1.1 + (i % 3) * 0.12;
  return {
    a,
    v: 210 + ((i * 97) % 320),
    size: 4 + ((i * 37) % 7),
    spin: ((i * 53) % 720) - 360,
    color: [C.mint, '#1B4BFF', '#FFFFFF', C.vivid, '#B9FFD9'][i % 5],
    delay: (i % 6) * 0.35,
  };
});

const Confetti: React.FC<{t: number}> = ({t}) => (
  <>
    {PARTICLES.map((p, i) => {
      const life = Math.max(0, t - p.delay);
      const dx = Math.cos(p.a) * p.v * life * 0.055;
      const dy = Math.sin(p.a) * p.v * life * 0.055 + 9 * life * life;
      const op = interpolate(life, [0, 2, 24], [0, 1, 0], {extrapolateRight: 'clamp'});
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 1210 + dx,
            top: 470 + dy,
            width: p.size,
            height: p.size * 1.6,
            borderRadius: 1.5,
            background: p.color,
            opacity: op,
            transform: `rotate(${p.spin * life * 0.12}deg)`,
          }}
        />
      );
    })}
  </>
);

const Headline: React.FC<{step: Step; dur: number; t: number; progress: number}> = ({step, dur, t, progress}) => {
  const {fps} = useVideoConfig();
  const rise = spring({frame: t, fps, config: {damping: 24, stiffness: 240, mass: 0.7}});
  const exit = interpolate(t, [dur - 4, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const y = (1 - rise) * 70 - exit * 90;
  const blur = (1 - rise) * 8 + exit * 8;

  return (
    <div style={{position: 'absolute', left: 152, top: 462, width: 820}}>
      <div style={{fontFamily: F.mono, fontSize: 21, letterSpacing: '0.22em', color: 'rgba(242,240,235,0.42)', fontWeight: 500}}>
        STEP {String(step.step).padStart(2, '0')} / 05
      </div>
      <div
        style={{
          fontFamily: F.serif,
          fontSize: 186,
          lineHeight: 0.94,
          marginTop: 30,
          color: step.green ? C.mint : C.paper,
          letterSpacing: '-0.014em',
          transform: `translateY(${y}px)`,
          filter: `blur(${blur}px)`,
          opacity: Math.min(1, rise * 1.5) * (1 - exit),
          textShadow: step.green ? `0 0 60px ${C.mint}55` : undefined,
          WebkitTextStroke: `${186 * 0.013}px ${step.green ? C.mint : C.paper}`,
          whiteSpace: 'nowrap',
        }}
      >
        {step.word}
      </div>
      <div style={{position: 'relative', width: 620, height: 2, marginTop: 16, background: 'rgba(242,240,235,0.16)'}}>
        <div style={{position: 'absolute', left: 0, top: 0, height: 2, width: 620 * progress, background: C.mint, boxShadow: `0 0 18px ${C.mint}88`}} />
      </div>
    </div>
  );
};

/** 88 - 177f: the payment-terminal run-through, five steps. */
export const S3Payment: React.FC = () => {
  const frame = useCurrentFrame();
  const stepIndex = (() => {
    let i = 0;
    STEPS.forEach((s, k) => {
      if (frame >= s.at) i = k;
    });
    return i;
  })();
  const step = STEPS[stepIndex];
  const dur = (STEPS[stepIndex + 1]?.at ?? 89) - step.at;
  const t = frame - step.at;

  const amount = interpolate(t, [2, 18], [0, 11.1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const pinDigits = Math.min(4, Math.floor(interpolate(t, [6, 22], [0, 4.2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})));
  const receiptOut = interpolate(frame, [70, 79], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const receiptLift = interpolate(frame, [79, 85], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <div style={{position: 'absolute', inset: 0, background: C.ink, overflow: 'hidden'}}>
      <Vignette color={C.mint} strength={0.055} />
      <div
        style={{
          position: 'absolute',
          left: 900,
          top: 240,
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${step.green ? 'rgba(63,240,140,0.10)' : 'rgba(63,240,140,0.05)'} 0%, rgba(0,0,0,0) 62%)`,
        }}
      />

      <Headline step={step} dur={dur} t={t} progress={(frame + 4) / 89} />

      {/* receipt stack */}
      <div style={{position: 'absolute', left: 1210, top: 300, width: 240, height: 170, transform: 'translateX(-50%)', zIndex: 3}}>
        {(stepIndex >= 4 ? [2, 1, 0] : []).map((k) => {
          const hh = Math.max(0, receiptOut * 152 - k * 9);
          if (hh < 4) return null;
          return (
            <div key={k} style={{position: 'absolute', bottom: 0, left: '50%', transform: `translate(-50%, ${-receiptLift * 26}px)`, opacity: k === 0 ? 1 : 0.92}}>
              <Receipt width={240} height={hh} index={k} />
            </div>
          );
        })}
      </div>

      <div style={{position: 'absolute', left: 1010, top: 470}}>
        <Phone
          width={400}
          step={step.screen}
          amount={amount}
          pinDigits={pinDigits}
          pinPressed={pinDigits > 0 && pinDigits < 4}
        />
      </div>

      {stepIndex === 3 && <Confetti t={t} />}

      <Grain opacity={0.055} frame={frame} />
    </div>
  );
};

