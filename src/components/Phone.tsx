import React from 'react';
import {C, F} from '../theme';

export type PhoneStep = 'amount' | 'tap' | 'pin' | 'approved' | 'printed';

const Signal: React.FC<{color: string}> = ({color}) => (
  <svg width="50" height="13" viewBox="0 0 50 13" fill="none">
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={i * 5.6} y={9 - i * 3} width="3.2" height={4 + i * 3} rx="1" fill={color} />
    ))}
    <path d="M27 4.8c2.2-2 5.6-2 7.8 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M29.3 7.4c1-.9 2.6-.9 3.6 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="31.1" cy="10" r="0.9" fill={color} />
    <rect x="38" y="2.6" width="10" height="7.4" rx="2" stroke={color} strokeWidth="1.3" />
    <rect x="39.8" y="4.4" width="6.4" height="3.8" rx="1" fill={color} />
  </svg>
);

const Contactless: React.FC = () => (
  <svg width="180" height="128" viewBox="0 0 210 150" fill="none">
    <ellipse cx="88" cy="86" rx="62" ry="42" stroke={C.ink} strokeWidth="3.4" transform="rotate(-14 88 86)" />
    {[0, 1, 2].map((i) => (
      <path
        key={i}
        d={`M${70 + i * 16} ${70 - i * 9}c${9 + i * 3} ${11 + i * 2} ${9 + i * 3} ${21 + i * 2} 0 ${31 + i * 2}`}
        stroke={i === 1 ? '#0E7A41' : C.ink}
        strokeWidth="5.5"
        strokeLinecap="round"
      />
    ))}
    <g transform="rotate(14 150 70)">
      <rect x="124" y="36" width="52" height="34" rx="5" stroke={C.ink} strokeWidth="3.4" fill={C.paper} />
      <rect x="131" y="44" width="19" height="4" rx="2" fill={C.ink} opacity="0.3" />
    </g>
    <path
      d="M118 98c14 5 34 9 46 3 8-4 10-11 6-15-3-3-8-2-12 2-6 6-10 13-6 19 5 8 20 9 34 5"
      stroke={C.ink}
      strokeWidth="3.6"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const Keypad: React.FC<{pressed: boolean}> = ({pressed}) => (
  <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7, marginTop: 12}}>
    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', ''].map((k, i) => (
      <div
        key={i}
        style={{
          height: 40,
          borderRadius: 10,
          background: i === 3 && pressed ? C.vivid : k === '' ? 'transparent' : '#FFFFFF',
          border: k && !(i === 3 && pressed) ? '1px solid rgba(20,21,24,0.05)' : 'none',
          boxShadow: i === 3 && pressed ? `0 0 20px ${C.vivid}88` : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: F.sans,
          fontSize: 19,
          fontWeight: 500,
          color: C.ink,
        }}
      >
        {k}
      </div>
    ))}
  </div>
);

/** Digits land on a counter with tabular figures; a touch of blur while the value rolls. */
const Odometer: React.FC<{value: number}> = ({value}) => {
  const settled = Math.abs(value - 11.1) < 0.02;
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: F.serif,
        fontSize: 74,
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.005em',
        filter: settled ? undefined : 'blur(1.1px)',
      }}
    >
      €{value.toFixed(2)}
    </span>
  );
};

export const Phone: React.FC<{
  step: PhoneStep;
  width?: number;
  children?: React.ReactNode;
  pinDigits?: number;
  pinPressed?: boolean;
  amount?: number;
}> = ({step, width = 400, children, pinDigits = 0, pinPressed = false, amount = 11.1}) => {
  const s = width / 400;
  const bodyH = 590 * s;
  const screenH = 344 * s;
  const green = step === 'approved' || step === 'printed';
  const screenBg = green ? C.green : '#FFFFFF';
  const ink = green ? '#FFFFFF' : C.ink;

  return (
    <div
      style={{
        width,
        height: bodyH,
        borderRadius: 58 * s,
        background: 'linear-gradient(168deg,#33363C 0%,#24262B 38%,#181A1E 100%)',
        boxShadow: `0 ${26 * s}px ${58 * s}px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10)`,
        padding: 12 * s,
        position: 'relative',
        fontFamily: F.sans,
      }}
    >
      <div
        style={{
          height: screenH,
          borderRadius: 46 * s,
          background: screenBg,
          overflow: 'hidden',
          position: 'relative',
          color: ink,
        }}
      >
        <div
          style={{
            height: 42 * s,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `0 ${20 * s}px`,
            fontSize: 15 * s,
            fontWeight: 600,
            opacity: green ? 0.9 : 0.88,
          }}
        >
          <span>12:48</span>
          <Signal color={ink} />
        </div>

        <div style={{padding: `0 ${22 * s}px`, height: '100%'}}>
          {step === 'amount' && (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 62 * s}}>
              <div style={{fontSize: 12 * s, letterSpacing: '0.22em', opacity: 0.5, fontWeight: 600}}>TOTAL</div>
              <div style={{marginTop: 10 * s}}>
                <Odometer value={amount} />
              </div>
              <div style={{fontSize: 13 * s, opacity: 0.4, marginTop: 22 * s}}>Card reader ready</div>
            </div>
          )}

          {step === 'tap' && (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 6 * s}}>
              <Contactless />
              <div style={{fontSize: 25 * s, fontWeight: 700, marginTop: 8 * s, letterSpacing: '-0.01em'}}>Tap card</div>
              <div style={{fontSize: 14 * s, opacity: 0.5, marginTop: 4 * s}}>or insert chip</div>
            </div>
          )}

          {step === 'pin' && (
            <div style={{paddingTop: 2 * s}}>
              <div style={{fontSize: 20 * s, fontWeight: 600, textAlign: 'center', letterSpacing: '-0.01em'}}>Enter PIN</div>
              <div style={{display: 'flex', gap: 12, justifyContent: 'center', marginTop: 12 * s}}>
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 15 * s,
                      height: 15 * s,
                      borderRadius: '50%',
                      border: `2px solid ${i < pinDigits ? C.ink : 'rgba(20,21,24,0.22)'}`,
                      background: i < pinDigits ? C.ink : 'transparent',
                    }}
                  />
                ))}
              </div>
              <Keypad pressed={pinPressed} />
            </div>
          )}

          {green && (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 12 * s}}>
              <svg width={130 * s} height={130 * s} viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="52" stroke="#FFFFFF" strokeWidth="5" />
                <path d="M38 62l15 15 30-32" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{fontSize: 30 * s, fontWeight: 700, marginTop: 22 * s, letterSpacing: '-0.015em'}}>Approved</div>
              <div style={{fontSize: 15 * s, opacity: 0.8, marginTop: 7 * s, letterSpacing: '0.02em'}}>€24.90 · •••• 4821</div>
              {step === 'printed' && <div style={{fontSize: 17 * s, marginTop: 34 * s, opacity: 0.95}}>Thank you</div>}
            </div>
          )}
        </div>
      </div>

      {/* physical buttons */}
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 34 * s, height: 92 * s}}>
        <div
          style={{
            width: 80 * s,
            height: 30 * s,
            borderRadius: 99,
            background: C.pink,
            boxShadow: `0 4px 14px ${C.pink}66, inset 0 1px 0 rgba(255,255,255,0.25)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: 14 * s,
          }}
        >
          <span style={{position: 'relative', width: 13 * s, height: 13 * s, display: 'block'}}>
            <span style={{position: 'absolute', left: 0, top: '45%', width: '100%', height: 2 * s, background: '#fff', transform: 'rotate(45deg)'}} />
            <span style={{position: 'absolute', left: 0, top: '45%', width: '100%', height: 2 * s, background: '#fff', transform: 'rotate(-45deg)'}} />
          </span>
        </div>
        <div
          style={{
            width: 80 * s,
            height: 30 * s,
            borderRadius: 99,
            background: '#D6D7D9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#3A3C40',
            fontSize: 19 * s,
            fontWeight: 600,
          }}
        >
          ‹
        </div>
        <div
          style={{
            width: 80 * s,
            height: 30 * s,
            borderRadius: 99,
            background: '#25C463',
            boxShadow: `0 4px 14px #25C46355, inset 0 1px 0 rgba(255,255,255,0.25)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#08361A',
            fontSize: 14 * s,
            fontWeight: 700,
          }}
        >
          <span style={{width: 12 * s, height: 12 * s, borderRadius: '50%', border: `${2.2 * s}px solid #08361A`, display: 'block'}} />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 46 * s,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 168 * s,
          height: 5 * s,
          borderRadius: 3,
          background: '#0C0D10',
        }}
      />
      {children}
    </div>
  );
};

export const Receipt: React.FC<{width?: number; height: number; index?: number}> = ({width = 240, height, index = 0}) => {
  const zig = 9;
  const n = Math.floor(width / zig);
  const clip = `polygon(${Array.from({length: n})
    .map((_, i) => {
      const x = i * zig;
      return `${x}px ${i % 2 === 0 ? 0 : 7}px, ${x + zig / 2}px ${i % 2 === 0 ? 7 : 0}px`;
    })
    .join(', ')}, 100% 0, 100% 100%, 0 100%)`;
  return (
    <div
      style={{
        width,
        height,
        background: '#FBFAF6',
        clipPath: clip,
        WebkitClipPath: clip,
        boxShadow: '0 -6px 24px rgba(0,0,0,0.35)',
        transform: `rotate(${index * 1.1}deg) translateX(${index * 5}px)`,
        padding: '18px 18px',
        fontFamily: F.sans,
        color: C.ink,
        overflow: 'hidden',
      }}
    >
      <div style={{fontFamily: F.mono, fontSize: 9, letterSpacing: '0.3em', textAlign: 'center', opacity: 0.4}}>RECEIPT</div>
      <div style={{height: 1, background: 'rgba(20,21,24,0.12)', margin: '9px 0'}} />
      <div style={{fontSize: 34, fontWeight: 700, letterSpacing: '-0.02em'}}>€24.90</div>
      <div style={{marginTop: 10, background: '#DCDAD3', height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, letterSpacing: '0.22em', fontWeight: 600, color: '#6D6F70'}}>
        APPROVED
      </div>
    </div>
  );
};

