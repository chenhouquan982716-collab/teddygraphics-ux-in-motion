import React from 'react';
import {Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../theme';
import {Ghost, Grain, Pill} from '../components/Primitives';

/** Every micro-interaction is a hard cut: background + ghost word + one demo. */
const Micro: React.FC<{bg: string; word: string; stroke: string; children: React.ReactNode}> = ({bg, word, stroke, children}) => {
  const frame = useCurrentFrame();
  const inScale = interpolate(frame, [0, 3], [1.06, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', inset: 0, background: bg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${inScale})`}}>
        <Ghost word={word} color={stroke} size={340} top={330} letterSpacing="-0.01em" />
        {children}
      </div>
      <Grain opacity={0.05} frame={frame} />
    </div>
  );
};

const Slider: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = spring({frame, fps, config: {damping: 16, stiffness: 90, mass: 1}});
  const x = 120 + k * 640;
  return (
    <Micro bg={C.green} word="SLIDER" stroke="rgba(255,255,255,0.14)">
      <div style={{position: 'absolute', left: 420, top: 560, width: 1060, height: 2, background: 'rgba(255,255,255,0.85)'}} />
      <div style={{position: 'absolute', left: 420, top: 570, width: 1060, display: 'flex', justifyContent: 'space-between'}}>
        {Array.from({length: 18}).map((_, i) => (
          <div key={i} style={{width: 1.5, height: i % 5 === 0 ? 14 : 8, background: 'rgba(255,255,255,0.35)'}} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 412, top: 606, fontFamily: F.mono, fontSize: 22, color: 'rgba(255,255,255,0.6)'}}>0</div>
      <div style={{position: 'absolute', left: 1432, top: 606, fontFamily: F.mono, fontSize: 22, color: 'rgba(255,255,255,0.6)'}}>100</div>

      <div style={{position: 'absolute', left: 420 + x, top: 561, transform: 'translate(-50%,-50%)'}}>
        <div style={{width: 58, height: 58, borderRadius: '50%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 40px rgba(255,255,255,0.25)`}}>
          <div style={{width: 20, height: 20, borderRadius: '50%', background: C.green}} />
        </div>
        <div style={{position: 'absolute', left: '50%', top: -84, transform: 'translateX(-50%)', background: '#FFF', color: C.ink, borderRadius: 16, padding: '10px 20px', fontFamily: F.sans, fontWeight: 700, fontSize: 30, letterSpacing: '-0.02em'}}>
          {Math.round(k * 86)}
          <div style={{position: 'absolute', left: '50%', bottom: -7, width: 14, height: 14, background: '#FFF', transform: 'translateX(-50%) rotate(45deg)', borderRadius: 3}} />
        </div>
      </div>
    </Micro>
  );
};

const Process: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 7], [0, 1], {extrapolateRight: 'clamp'});
  const done = frame >= 8;
  return (
    <Micro bg={C.ink} word="PROCESS" stroke="rgba(255,255,255,0.07)">
      <div style={{position: 'absolute', left: 960, top: 560, transform: 'translate(-50%,-50%)', width: 190, height: 190}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: `radial-gradient(circle, ${C.mint}44 0%, transparent 68%)`}} />
        <svg width="190" height="190" viewBox="0 0 190 190" style={{position: 'absolute', inset: 0}}>
          <circle cx="95" cy="95" r="66" stroke="rgba(255,255,255,0.10)" strokeWidth="6" fill="none" />
          <circle
            cx="95"
            cy="95"
            r="66"
            stroke={C.mint}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={414}
            strokeDashoffset={414 * (1 - p)}
            transform="rotate(-90 95 95)"
          />
        </svg>
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: C.mint, fontFamily: F.sans, fontWeight: 600, fontSize: 26, opacity: done ? 1 : 0.9}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 12.5l5 5L20 6.5" stroke={C.mint} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Done
        </div>
      </div>
    </Micro>
  );
};

const BARS = [92, 148, 132, 196, 172, 244, 214, 300];
const Growth: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Micro bg={C.paper} word="GROWTH" stroke="rgba(20,21,24,0.055)">
      <div style={{position: 'absolute', left: 470, top: 780, width: 1000, height: 1, background: 'rgba(20,21,24,0.25)'}} />
      <div style={{position: 'absolute', left: 470, top: 470, width: 1000, height: 310, display: 'flex', alignItems: 'flex-end', gap: 26}}>
        {BARS.map((h, i) => {
          const k = spring({frame: frame + 4 - i * 0.55, fps: 24, config: {damping: 22, stiffness: 260, mass: 0.6}});
          const last = i === BARS.length - 1;
          return <div key={i} style={{flex: 1, height: Math.max(6, h * k), background: last ? C.green : C.ink, borderRadius: '4px 4px 0 0'}} />;
        })}
      </div>
      <svg style={{position: 'absolute', left: 470, top: 400, overflow: 'visible'}} width="1000" height="400" viewBox="0 0 1000 400" fill="none">
        <path
          d="M20 210 L160 150 L300 190 L440 120 L580 150 L720 70 L860 100 L970 30"
          stroke={C.green}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={2000}
          strokeDashoffset={2000 * (1 - interpolate(frame, [1, 10], [0, 1], {extrapolateRight: 'clamp'}))}
        />
        {[[20, 210], [160, 150], [300, 190], [440, 120], [580, 150], [720, 70], [860, 100], [970, 30]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="6" fill={C.paper} stroke={C.green} strokeWidth="3" opacity={frame > i * 0.8 + 2 ? 1 : 0} />
        ))}
      </svg>
      <div style={{position: 'absolute', left: 1240, top: 400, fontFamily: F.sans, fontWeight: 700, fontSize: 56, letterSpacing: '-0.02em', color: C.ink}}>€ 48.2k</div>
    </Micro>
  );
};

const Swipe: React.FC = () => {
  const frame = useCurrentFrame();
  const k = spring({frame, fps: 24, config: {damping: 15, stiffness: 110, mass: 0.9}});
  return (
    <Micro bg={C.blue} word="SWIPE" stroke="rgba(255,255,255,0.16)">
      <div style={{position: 'absolute', left: 960, top: 600, transform: 'translate(-50%,-50%)'}}>
        {[2, 1].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: -180 + i * 34,
              top: -110 - i * 16,
              width: 430,
              height: 270,
              borderRadius: 26,
              background: i === 2 ? '#101114' : C.greenDark,
              transform: `rotate(${i * -5}deg)`,
              boxShadow: '0 30px 60px rgba(0,0,0,0.35)',
            }}
          />
        ))}
        <div
          style={{
            position: 'relative',
            width: 430,
            height: 270,
            borderRadius: 26,
            background: `linear-gradient(160deg, #12A957 0%, ${C.green} 60%, #0A5E33 100%)`,
            transform: `translate(${(1 - k) * 260}px, ${(1 - k) * 40}px) rotate(${(1 - k) * 14 - 2}deg)`,
            boxShadow: '0 34px 70px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.25)',
            padding: 30,
            color: '#fff',
          }}
        >
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              {[0, 1, 2].map((i) => (
                <path key={i} d={`M${10 + i * 7} ${16 - i * 3}a12 12 0 0 1 0 ${16 + i * 3}`} stroke="#fff" strokeWidth="3" strokeLinecap="round" />
              ))}
            </svg>
          </div>
          <div style={{width: 62, height: 46, borderRadius: 8, background: 'rgba(255,255,255,0.85)', marginTop: 40}} />
          <div style={{position: 'absolute', left: 30, bottom: 34, fontFamily: F.mono, fontSize: 26, letterSpacing: '0.14em'}}>•••• 1907</div>
        </div>
      </div>
    </Micro>
  );
};

const Mirror: React.FC = () => {
  const frame = useCurrentFrame();
  const k = spring({frame, fps: 24, config: {damping: 16, stiffness: 100, mass: 0.9}});
  const dir = k > 0.5;
  return (
    <Micro bg={C.paper} word="MIRROR" stroke="rgba(20,21,24,0.05)">
      <div style={{position: 'absolute', left: 960, top: 400, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 16}}>
        <div style={{width: 46, height: 1.5, background: 'rgba(20,21,24,0.3)'}} />
        <Pill bg={C.ink} color={C.paper} height={54} fontSize={20} padding="0 26px" style={{letterSpacing: '0.12em'}}>
          {dir ? 'RTL' : 'LTR'}
        </Pill>
        <div style={{width: 46, height: 1.5, background: 'rgba(20,21,24,0.3)'}} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 600,
          transform: `translate(-50%,-50%) scaleX(${1 - (1 - k) * 0.02})`,
          width: 1000,
          height: 180,
          background: '#fff',
          borderRadius: 30,
          boxShadow: '0 30px 60px rgba(20,21,24,0.10)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 38px',
          gap: 26,
          direction: dir ? 'rtl' : 'ltr',
        }}
      >
        <div style={{fontSize: 34, color: C.ink, opacity: 0.6, transform: dir ? 'rotate(180deg)' : undefined}}>‹</div>
        <div style={{background: C.vivid, color: C.ink, borderRadius: 999, padding: '8px 18px', fontFamily: F.sans, fontWeight: 700, fontSize: 24}}>€24.90</div>
        <div style={{flex: 1, height: 12, borderRadius: 6, background: C.ink, position: 'relative'}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 26, height: 12, borderRadius: 6, background: 'rgba(20,21,24,0.12)'}} />
        </div>
        <div style={{width: 76, height: 76, borderRadius: '50%', background: C.vivid, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.sans, fontWeight: 800, fontSize: 26, color: C.ink, direction: 'ltr'}}>
          TG
        </div>
      </div>
    </Micro>
  );
};

const ErrorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const shake = Math.sin(frame * 1.9) * 14 * Math.exp(-frame / 5);
  return (
    <Micro bg={C.ink} word="ERROR" stroke="rgba(255,255,255,0.06)">
      <div style={{position: 'absolute', left: 960, top: 560, transform: `translate(-50%,-50%) translateX(${shake}px)`, width: 420}}>
        <div style={{width: 62, height: 62, borderRadius: '50%', background: C.pink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.sans, fontWeight: 800, fontSize: 34, margin: '0 auto'}}>
          !
        </div>
        <div style={{marginTop: 40, height: 92, border: `2px solid ${C.pink}`, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, background: 'rgba(245,17,82,0.06)'}}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: 23,
                height: 23,
                borderRadius: '50%',
                background: C.pink,
                transform: `scale(${frame > 1 + i * 0.8 ? 1 : 0.3})`,
                opacity: frame > 1 + i * 0.8 ? 1 : 0.4,
              }}
            />
          ))}
        </div>
        <div style={{marginTop: 28, textAlign: 'center', color: '#fff', fontFamily: F.sans, fontWeight: 600, fontSize: 40, letterSpacing: '-0.01em'}}>Incorrect PIN</div>
        <div style={{marginTop: 10, textAlign: 'center', color: 'rgba(255,255,255,0.55)', fontFamily: F.sans, fontSize: 24}}>2 attempts left</div>
      </div>
    </Micro>
  );
};

const Access: React.FC = () => {
  const frame = useCurrentFrame();
  const k = spring({frame, fps: 24, config: {damping: 17, stiffness: 120, mass: 0.8}});
  const pct = Math.round(interpolate(frame, [0, 3], [120, 200], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
  const lift = interpolate(frame, [7, 12], [0, 8], {extrapolateRight: 'clamp'});
  return (
    <Micro bg={C.vivid} word="ACCESSIBLE" stroke="rgba(20,21,24,0.07)">
      <div style={{position: 'absolute', left: 200, top: 400, fontFamily: F.sans, fontWeight: 700, fontSize: 300, lineHeight: 1, color: C.ink, letterSpacing: '-0.045em', transform: `scale(${0.92 + k * 0.08})`, transformOrigin: 'left center'}}>
        Aa
      </div>
      <div style={{position: 'absolute', left: 1080, top: 420}}>
        <div style={{fontFamily: F.sans, fontWeight: 700, fontSize: 62, color: C.ink, letterSpacing: '-0.02em'}}>{pct}%</div>
        <div style={{fontFamily: F.mono, fontSize: 20, color: 'rgba(20,21,24,0.62)', letterSpacing: '0.2em', marginTop: 8}}>TEXT SIZE</div>
        <div style={{marginTop: 26}}>
          <Pill bg={C.ink} color={C.vivid} height={54} fontSize={20} padding="0 24px" style={{letterSpacing: '0.06em', fontWeight: 600}}>
            10:1 AAA
          </Pill>
        </div>
        <div style={{marginTop: 74}}>
          <Pill bg="#FFFFFF" color={C.ink} border={`2px solid ${C.ink}`} height={78} fontSize={28} padding="0 44px" style={{transform: `translateY(${-lift}px)`, boxShadow: '0 10px 30px rgba(0,0,0,0.18)'}}>
            Continue
          </Pill>
        </div>
      </div>
    </Micro>
  );
};

const Order: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Micro bg={C.ink} word="ORDER" stroke="rgba(255,255,255,0.05)">
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 570,
          transform: 'translate(-50%,-50%)',
          width: 400,
          height: 620,
          borderRadius: 46,
          background: '#26282D',
          padding: 16,
          boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{background: '#F7F6F2', height: '100%', borderRadius: 32, padding: 30, color: C.ink, position: 'relative'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div>
              <div style={{fontFamily: F.sans, fontWeight: 700, fontSize: 34}}>Order</div>
              <div style={{fontFamily: F.sans, fontSize: 17, opacity: 0.5, marginTop: 4}}>Pick your favourites</div>
            </div>
            <div style={{width: 34, height: 34, borderRadius: 8, border: '2px solid rgba(20,21,24,0.35)'}} />
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 34}}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{background: '#EDEBE5', borderRadius: 16, height: 150, position: 'relative', opacity: frame > i * 1.2 ? 1 : 0.2, transform: `translateY(${frame > i * 1.2 ? 0 : 14}px)`}}>
                <div style={{position: 'absolute', left: '50%', top: 26, transform: 'translateX(-50%)', width: 56, height: 56, borderRadius: '50%', background: '#9AA0A6'}} />
                <div style={{position: 'absolute', left: 24, bottom: 46, width: 110, height: 7, borderRadius: 4, background: '#B9BDC0'}} />
                <div style={{position: 'absolute', left: 24, bottom: 26, width: 72, height: 7, borderRadius: 4, background: '#CBCED1'}} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Micro>
  );
};

export const MICRO_SCENES = [
  {at: 0, dur: 15, C: Slider},
  {at: 15, dur: 11, C: Process},
  {at: 26, dur: 11, C: Growth},
  {at: 37, dur: 11, C: Swipe},
  {at: 48, dur: 12, C: Mirror},
  {at: 60, dur: 11, C: ErrorScene},
  {at: 71, dur: 11, C: Access},
  {at: 82, dur: 12, C: Order},
];

/** 177 – 271f: eight half-second micro-interaction cuts. */
export const S4Micro: React.FC = () => (
  <>
    {MICRO_SCENES.map(({at, dur, C: Scene}) => (
      <Sequence key={at} from={at} durationInFrames={dur}>
        <Scene />
      </Sequence>
    ))}
  </>
);
