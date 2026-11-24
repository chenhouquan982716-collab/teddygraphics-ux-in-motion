import React from 'react';
import {C, F, H, W} from '../theme';

/** Big outlined word that sits behind the micro-interaction demos. */
export const Ghost: React.FC<{
  word: string;
  color: string;
  size?: number;
  letterSpacing?: string;
  fontWeight?: number;
  top?: number | string;
  left?: number | string;
  opacity?: number;
}> = ({word, color, size = 300, letterSpacing = '-0.02em', fontWeight = 900, top = 300, left = 0, opacity = 1}) => (
  <div
    style={{
      position: 'absolute',
      top,
      left,
      width: W,
      textAlign: 'center',
      fontFamily: F.sans,
      fontWeight,
      fontSize: size,
      letterSpacing,
      color: 'transparent',
      WebkitTextStroke: `2px ${color}`,
      opacity,
      lineHeight: 1,
      whiteSpace: 'nowrap',
      userSelect: 'none',
    }}
  >
    {word}
  </div>
);

const NOISE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='220' height='220' filter='url(#n)' opacity='0.55'/></svg>`;
const NOISE_URL = `url("data:image/svg+xml;utf8,${encodeURIComponent(NOISE_SVG)}")`;

/** Static film grain — deterministic, cheap, always the same. */
export const Grain: React.FC<{opacity?: number; frame?: number}> = ({opacity = 0.06, frame = 0}) => (
  <div
    style={{
      position: 'absolute',
      inset: -40,
      backgroundImage: NOISE_URL,
      backgroundSize: '220px 220px',
      backgroundPosition: `${(frame * 13) % 220}px ${(frame * 29) % 220}px`,
      opacity,
      pointerEvents: 'none',
      mixBlendMode: 'overlay',
    }}
  />
);

/** Soft radial vignette used on every dark shot. */
export const Vignette: React.FC<{color?: string; strength?: number}> = ({color = '#3BF08C', strength = 0.1}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: `radial-gradient(circle at 50% 48%, ${color}${Math.round(strength * 255)
        .toString(16)
        .padStart(2, '0')} 0%, rgba(0,0,0,0) 46%, rgba(0,0,0,0.35) 100%)`,
    }}
  />
);

export const Rings: React.FC<{cx: number; cy: number; color?: string; count?: number; from?: number; to?: number; opacity?: number; scale?: number}> = ({
  cx,
  cy,
  color = C.mint,
  count = 7,
  from = 60,
  to = 460,
  opacity = 0.12,
  scale = 1,
}) => (
  <div style={{position: 'absolute', left: cx, top: cy, transform: `translate(-50%,-50%) scale(${scale})`, width: 0, height: 0, pointerEvents: 'none'}}>
    {Array.from({length: count}).map((_, i) => {
      const r = from + ((to - from) * i) / Math.max(1, count - 1);
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: -r,
            top: -r,
            width: r * 2,
            height: r * 2,
            borderRadius: '50%',
            border: `1px solid ${color}`,
            opacity: opacity * (1 - i / (count + 2)),
          }}
        />
      );
    })}
  </div>
);

export const Pill: React.FC<{
  children: React.ReactNode;
  bg: string;
  color: string;
  border?: string;
  height?: number;
  padding?: string;
  fontSize?: number;
  weight?: number;
  width?: number | string;
  style?: React.CSSProperties;
}> = ({children, bg, color, border, height = 62, padding = '0 30px', fontSize = 24, weight = 600, width, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      height,
      padding,
      borderRadius: height / 2,
      background: bg,
      color,
      border,
      fontSize,
      fontWeight: weight,
      fontFamily: F.sans,
      letterSpacing: '-0.01em',
      width,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);
