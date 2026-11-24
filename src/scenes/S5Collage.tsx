import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../theme';
import {Grain, Rings} from '../components/Primitives';

const TW = 300;
const TH = 190;

const Tile: React.FC<{kind: number}> = ({kind}) => {
  const base: React.CSSProperties = {width: TW, height: TH, borderRadius: 16, overflow: 'hidden', position: 'relative', fontFamily: F.sans};
  switch (kind % 12) {
    case 0:
      return (
        <div style={{...base, background: C.vivid, padding: 22}}>
          <div style={{fontSize: 74, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, color: C.ink}}>Aa</div>
          <div style={{position: 'absolute', right: 22, top: 34, fontSize: 15, fontWeight: 600, color: C.ink, opacity: 0.8}}>200%</div>
          <div style={{position: 'absolute', right: 22, top: 58, width: 66, height: 20, borderRadius: 10, background: C.ink, color: C.vivid, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600}}>
            10:1 AAA
          </div>
        </div>
      );
    case 1:
      return (
        <div style={{...base, background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 96, height: 150, borderRadius: 14, background: '#2B2D31', padding: 6}}>
            <div style={{background: '#fff', height: 104, borderRadius: 9, padding: 8}}>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 3, marginTop: 14}}>
                {Array.from({length: 9}).map((_, i) => (
                  <div key={i} style={{height: 12, borderRadius: 3, background: i === 3 ? C.vivid : '#EDEBE5'}} />
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    case 2:
      return (
        <div style={{...base, background: C.ink, padding: 26}}>
          <div style={{fontFamily: F.serif, fontSize: 54, color: C.paper, WebkitTextStroke: '0.6px #F2F0EB'}}>PIN.</div>
          <div style={{position: 'absolute', right: 26, bottom: 24, width: 74, height: 110, borderRadius: 11, background: '#2B2D31', padding: 4}}>
            <div style={{background: '#fff', height: '100%', borderRadius: 7}} />
          </div>
        </div>
      );
    case 3:
      return (
        <div style={{...base, background: C.ink, padding: 26}}>
          <div style={{fontFamily: F.serif, fontSize: 46, color: C.paper, WebkitTextStroke: '0.6px #F2F0EB'}}>Printed.</div>
          <div style={{position: 'absolute', right: 26, bottom: 22, width: 62, height: 96, borderRadius: 10, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="17" stroke="#fff" strokeWidth="2.4" />
              <path d="M12 20.5l5.5 5.5L29 14" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      );
    case 4:
      return (
        <div style={{...base, background: C.paper, padding: '34px 26px'}}>
          <div style={{display: 'flex', gap: 9, alignItems: 'flex-end', height: 100}}>
            {[40, 62, 52, 78, 68, 96, 84, 118].map((h, i) => (
              <div key={i} style={{flex: 1, height: h, background: i === 7 ? C.green : C.ink, borderRadius: '3px 3px 0 0'}} />
            ))}
          </div>
          <div style={{fontSize: 13, marginTop: 8, color: C.ink, fontWeight: 600}}>€ 48.2k</div>
        </div>
      );
    case 5:
      return (
        <div style={{...base, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 150, height: 96, borderRadius: 10, background: C.green, boxShadow: '0 16px 30px rgba(0,0,0,0.3)', position: 'relative'}}>
            <div style={{position: 'absolute', left: 16, top: 18, width: 34, height: 24, borderRadius: 4, background: 'rgba(255,255,255,0.8)'}} />
            <div style={{position: 'absolute', left: 16, bottom: 16, fontSize: 11, color: '#fff', letterSpacing: '0.1em'}}>•••• 1907</div>
          </div>
        </div>
      );
    case 6:
      return (
        <div style={{...base, background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 116, height: 50, borderRadius: 25, background: C.mint, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 5, boxShadow: `0 0 30px ${C.mint}55`}}>
            <div style={{width: 40, height: 40, borderRadius: '50%', background: '#fff'}} />
          </div>
        </div>
      );
    case 7:
      return (
        <div style={{...base, background: C.green, padding: '0 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <div style={{height: 6, background: 'rgba(255,255,255,0.9)', borderRadius: 3, position: 'relative'}}>
            <div style={{position: 'absolute', left: 120, top: -11, width: 28, height: 28, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: 10, height: 10, borderRadius: '50%', background: C.green}} />
            </div>
          </div>
          <div style={{marginTop: 22, fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: F.mono}}>86 / 100</div>
        </div>
      );
    case 8:
      return (
        <div style={{...base, background: C.paper, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontSize: 58, fontWeight: 900, letterSpacing: '-0.04em', color: C.ink}}>MOTION</div>
        </div>
      );
    case 9:
      return (
        <div style={{...base, background: C.paper, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontFamily: F.serif, fontSize: 110, color: C.ink, WebkitTextStroke: '1px #141518'}}>IN</div>
        </div>
      );
    case 10:
      return (
        <div style={{...base, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width="76" height="76" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="17" stroke="#fff" strokeWidth="2.2" />
            <path d="M12 20.5l5.5 5.5L29 14" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" />
          </svg>
        </div>
      );
    default:
      return (
        <div style={{...base, background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12}}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{width: 14, height: 14, borderRadius: '50%', background: C.pink, opacity: i < 3 ? 1 : 0.4}} />
          ))}
        </div>
      );
  }
};

const COLS = 7;
const ROWS = 4;
const GAP = 14;

/** 271 – 325f: the whole design system collapses into one tilted wall. */
export const S5Collage: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const grow = spring({frame, fps, config: {damping: 20, stiffness: 90, mass: 1.1}});
  const scale = interpolate(grow, [0, 1], [0.04, 0.92]) + interpolate(frame, [16, 54], [0, 0.42], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const blur = interpolate(frame, [0, 13], [26, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const op = interpolate(frame, [0, 4], [0, 1], {extrapolateRight: 'clamp'});

  const gridW = COLS * TW + (COLS - 1) * GAP;
  const gridH = ROWS * TH + (ROWS - 1) * GAP;

  return (
    <div style={{position: 'absolute', inset: 0, background: C.ink, overflow: 'hidden'}}>
      <Rings cx={960} cy={540} opacity={0.10 * (1 - grow)} from={80} to={420} />
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 540,
          width: gridW,
          height: gridH,
          marginLeft: -gridW / 2,
          marginTop: -gridH / 2,
          transform: `scale(${scale}) rotate(${-9 + frame * 0.06}deg) translate(${interpolate(frame, [0, 54], [60, -140])}px, ${interpolate(frame, [0, 54], [30, -60])}px)`,
          filter: `blur(${blur}px)`,
          opacity: op,
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, ${TW}px)`,
          gridAutoRows: `${TH}px`,
          gap: GAP,
        }}
      >
        {Array.from({length: COLS * ROWS}).map((_, i) => {
          const r = Math.floor(i / COLS);
          const c = i % COLS;
          return <Tile key={i} kind={c + r * 5} />;
        })}
      </div>
      <Grain opacity={0.05} frame={frame} />
    </div>
  );
};
