import type {ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, H, W} from '../theme';

/**
 * The viewfinder HUD that sits on top of every shot: corner brackets,
 * brand block, 60fps timecode, shot label and the 8-bar progress.
 */

export type HudShot = {
  /** first frame (inclusive) where this label is active */
  from: number;
  /** section name, e.g. "02 — PAYMENT TERMINAL" */
  section: string;
  /** micro label, e.g. "PIN ENTRY" */
  label: string;
  /** bar number 1..8 */
  bar: number;
};

export const HUD_SHOTS: HudShot[] = [
  {from: 0, section: '01 — INTRO', label: 'RADIAL REVEAL', bar: 1},
  {from: 10, section: '01 — INTRO', label: 'DOT IGNITION', bar: 1},
  {from: 20, section: '01 — INTRO', label: 'SQUASH & STRETCH', bar: 1},
  {from: 32, section: '01 — INTRO', label: 'RADIAL REVEAL', bar: 2},
  {from: 38, section: '01 — INTRO', label: 'KINETIC TYPE · MASKED STAGGER', bar: 2},
  {from: 58, section: '01 — INTRO', label: 'WORD STACK · MASK', bar: 2},
  {from: 70, section: '01 — INTRO', label: 'GLYPH · COUNT', bar: 2},
  {from: 88, section: '02 — PAYMENT TERMINAL', label: 'SPRING ENTRANCE · ODOMETER DIGITS', bar: 3},
  {from: 110, section: '02 — PAYMENT TERMINAL', label: 'CONTACTLESS TAP', bar: 3},
  {from: 131, section: '02 — PAYMENT TERMINAL', label: 'PIN ENTRY', bar: 3},
  {from: 145, section: '02 — PAYMENT TERMINAL', label: 'APPROVED · PARTICLE BURST', bar: 4},
  {from: 158, section: '02 — PAYMENT TERMINAL', label: 'RECEIPT PRINT', bar: 4},
  {from: 177, section: '03 — MICRO-INTERACTIONS', label: 'SLIDER · FOLLOW-THROUGH', bar: 5},
  {from: 189, section: '03 — MICRO-INTERACTIONS', label: 'BUTTON · LOADER · DONE', bar: 5},
  {from: 200, section: '03 — MICRO-INTERACTIONS', label: 'DATA · STAGGERED GROWTH', bar: 5},
  {from: 212, section: '03 — MICRO-INTERACTIONS', label: 'CARD STACK · SWIPE', bar: 5},
  {from: 224, section: '03 — MICRO-INTERACTIONS', label: 'LTR ↔ RTL MIRROR', bar: 6},
  {from: 236, section: '03 — MICRO-INTERACTIONS', label: 'ERROR · DAMPED SHAKE', bar: 6},
  {from: 248, section: '03 — MICRO-INTERACTIONS', label: 'ACCESSIBILITY · 200% TEXT', bar: 6},
  {from: 259, section: '03 — MICRO-INTERACTIONS', label: 'KIOSK · ORDER', bar: 6},
  {from: 271, section: '04 — SYSTEMS', label: 'COLLAGE · ZOOM OUT', bar: 7},
  {from: 325, section: '04 — SYSTEMS', label: 'MARK · ASSEMBLE', bar: 8},
  {from: 345, section: '04 — SYSTEMS', label: 'WORDMARK', bar: 8},
  {from: 355, section: '04 — SYSTEMS', label: 'LOCKUP', bar: 8},
];

export const shotAt = (frame: number): HudShot => {
  let out = HUD_SHOTS[0];
  for (const s of HUD_SHOTS) {
    if (frame >= s.from) out = s;
  }
  return out;
};

export const timecode = (frame: number) => {
  // the reference HUD counts at 60fps while the file is 24fps
  const n = Math.floor((frame / 24) * 60);
  const ff = n % 60;
  const ss = Math.floor(n / 60) % 60;
  const mm = Math.floor(n / 3600) % 60;
  const hh = Math.floor(n / 216000);
  const p = (v: number) => String(v).padStart(2, '0');
  return `${p(hh)}:${p(mm)}:${p(ss)}:${p(ff)}`;
};

const Bracket = ({cx, cy, sx, sy, color}: {cx: number; cy: number; sx: number; sy: number; color: string}) => (
  <div
    style={{
      position: 'absolute',
      left: cx,
      top: cy,
      width: 52,
      height: 52,
      borderColor: color,
      borderStyle: 'solid',
      borderWidth: 0,
      borderLeftWidth: sx > 0 ? 2 : 0,
      borderRightWidth: sx < 0 ? 2 : 0,
      borderTopWidth: sy > 0 ? 2 : 0,
      borderBottomWidth: sy < 0 ? 2 : 0,
      transform: 'translate(-50%,-50%)',
    }}
  />
);

export const Hud: React.FC<{frame: number; light: boolean; opacity: number; children?: ReactNode}> = ({
  frame,
  light,
  opacity,
  children,
}) => {
  const shot = shotAt(frame);
  const fg = light ? 'rgba(20,21,24,0.92)' : 'rgba(242,240,235,0.95)';
  const sub = light ? 'rgba(20,21,24,0.45)' : 'rgba(242,240,235,0.45)';
  const line = light ? 'rgba(20,21,24,0.38)' : 'rgba(255,255,255,0.42)';
  const inset = 54;
  const filled = Math.min(4, Math.ceil(shot.bar / 2));

  return (
    <div style={{position: 'absolute', inset: 0, opacity, fontFamily: F.mono, color: fg}}>
      <Bracket cx={inset} cy={inset} sx={1} sy={1} color={line} />
      <Bracket cx={W - inset} cy={inset} sx={-1} sy={1} color={line} />
      <Bracket cx={inset} cy={H - inset} sx={1} sy={-1} color={line} />
      <Bracket cx={W - inset} cy={H - inset} sx={-1} sy={-1} color={line} />

      {/* top left */}
      <div style={{position: 'absolute', left: inset + 22, top: inset + 6}}>
        <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 19, letterSpacing: '0.16em'}}>TEDDYGRAPHICS</div>
        <div style={{marginTop: 7, fontSize: 12, letterSpacing: '0.20em', color: sub}}>UI MOTION REEL · 2026</div>
      </div>

      {/* top right */}
      <div style={{position: 'absolute', right: inset + 22, top: inset + 8, textAlign: 'right'}}>
        <div style={{fontSize: 16, letterSpacing: '0.06em', fontWeight: 500}}>{timecode(frame)}</div>
        <div style={{marginTop: 7, fontSize: 11, letterSpacing: '0.13em', color: sub}}>1920×1080 · 60 FPS</div>
      </div>

      {/* bottom left */}
      <div style={{position: 'absolute', left: inset + 22, bottom: inset + 10}}>
        <div style={{fontFamily: F.sans, fontWeight: 700, fontSize: 17, letterSpacing: '0.10em'}}>{shot.section}</div>
        <div style={{marginTop: 7, fontSize: 12, letterSpacing: '0.17em', color: sub}}>{shot.label}</div>
      </div>

      {/* bottom right */}
      <div style={{position: 'absolute', right: inset + 22, bottom: inset + 10, textAlign: 'right'}}>
        <div style={{display: 'flex', gap: 6, justifyContent: 'flex-end'}}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: 11,
                height: 11,
                borderRadius: 2,
                background: i <= filled ? fg : 'transparent',
                border: `1.5px solid ${line}`,
              }}
            />
          ))}
        </div>
        <div style={{marginTop: 9, fontSize: 11, letterSpacing: '0.13em', color: sub}}>
          BAR {String(shot.bar).padStart(2, '0')} / 08
        </div>
      </div>

      {/* optional centre-bottom note (outro) */}
      {children}
    </div>
  );
};

export const hudBackgroundIsLight = (frame: number) => {
  if (frame >= 38 && frame < 88) return true;
  if (frame >= 177 && frame < 271) {
    return frame < 189 || (frame >= 200 && frame < 212) || (frame >= 224 && frame < 236);
  }
  return false;
};

export {C};
