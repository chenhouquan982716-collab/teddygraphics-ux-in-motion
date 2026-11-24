// Synthesises the UI sound kit used by the reel.
// Deterministic: no samples, no network — just a tiny DSP kit.
// Run: node scripts/make-sfx.mjs  ->  public/sfx/*.wav
import fs from 'node:fs';
import path from 'node:path';

const SR = 48000;
const OUT = path.resolve('public/sfx');
fs.mkdirSync(OUT, { recursive: true });

// ---------- helpers ----------
const mulberry32 = (a) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const buf = (sec) => new Float32Array(Math.max(1, Math.floor(sec * SR)));
const T = (b) => Array.from({ length: b.length }, (_, i) => i / SR);

const env = (t, a = 0.002, d = 0.12, curve = 3) => {
  if (t < 0) return 0;
  if (t < a) return t / a;
  return Math.pow(1 - Math.min(1, (t - a) / d), curve);
};

function onePole(b, cutoff, hp = false) {
  const dt = 1 / SR;
  const rc = 1 / (2 * Math.PI * cutoff);
  const alpha = dt / (rc + dt);
  let prev = 0;
  let prevOut = 0;
  for (let i = 0; i < b.length; i++) {
    prev = prev + alpha * (b[i] - prev);
    b[i] = hp ? alpha * (prevOut + b[i] - prev) : prev;
    prevOut = b[i];
  }
  return b;
}

function normalize(b, peak = 0.9) {
  let m = 0;
  for (const v of b) m = Math.max(m, Math.abs(v));
  if (m === 0) return b;
  const k = peak / m;
  for (let i = 0; i < b.length; i++) b[i] *= k;
  return b;
}

function fadeTail(b, ms = 8) {
  const n = Math.floor((ms / 1000) * SR);
  for (let i = 0; i < n; i++) b[b.length - 1 - i] *= i / n;
  return b;
}

function write(name, b) {
  const n = b.length;
  const out = Buffer.alloc(44 + n * 2);
  out.write('RIFF', 0);
  out.writeUInt32LE(36 + n * 2, 4);
  out.write('WAVE', 8);
  out.write('fmt ', 12);
  out.writeUInt32LE(16, 16);
  out.writeUInt16LE(1, 20);
  out.writeUInt16LE(1, 22);
  out.writeUInt32LE(SR, 24);
  out.writeUInt32LE(SR * 2, 28);
  out.writeUInt16LE(2, 32);
  out.writeUInt16LE(16, 34);
  out.write('data', 36);
  out.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const v = Math.max(-1, Math.min(1, b[i]));
    out.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  fs.writeFileSync(path.join(OUT, name), out);
  console.log(name.padEnd(16), (n / SR).toFixed(2) + 's', (out.length / 1024).toFixed(0) + 'kb');
}

// ---------- kit ----------
const rnd = mulberry32(20261124);

// 1. tick — 6ms digital tick
{
  const b = buf(0.05);
  const t = T(b);
  for (let i = 0; i < b.length; i++) {
    const n = rnd() * 2 - 1;
    b[i] = n * env(t[i], 0.0004, 0.012, 2) * 0.8 + Math.sin(2 * Math.PI * 3200 * t[i]) * env(t[i], 0.0002, 0.006, 2) * 0.4;
  }
  onePole(b, 9000);
  write('tick.wav', normalize(fadeTail(b), 0.55));
}

// 2. click — softer UI click with body
{
  const b = buf(0.09);
  const t = T(b);
  for (let i = 0; i < b.length; i++) {
    const n = rnd() * 2 - 1;
    b[i] =
      n * env(t[i], 0.0006, 0.02, 2.4) * 0.9 +
      Math.sin(2 * Math.PI * 1500 * t[i]) * env(t[i], 0.0004, 0.03, 3) * 0.5 +
      Math.sin(2 * Math.PI * 220 * t[i]) * env(t[i], 0.001, 0.06, 2) * 0.35;
  }
  onePole(b, 7000);
  write('click.wav', normalize(fadeTail(b), 0.75));
}

// 3. switch — two-part mechanical toggle, pitch up
{
  const b = buf(0.3);
  const t = T(b);
  for (let i = 0; i < b.length; i++) {
    const tt = t[i];
    const a = env(tt, 0.0008, 0.018, 2.5);
    const bb = env(tt - 0.055, 0.0008, 0.03, 2.2);
    b[i] =
      (rnd() * 2 - 1) * a * 0.7 +
      Math.sin(2 * Math.PI * 1900 * tt) * a * 0.3 +
      (rnd() * 2 - 1) * bb * 0.5 +
      Math.sin(2 * Math.PI * 130 * (tt - 0.055)) * bb * 0.5;
  }
  onePole(b, 6500);
  write('switch.wav', normalize(fadeTail(b), 0.8));
}

// 4. pop — pitch drop blip
{
  const b = buf(0.22);
  const t = T(b);
  let ph = 0;
  for (let i = 0; i < b.length; i++) {
    const tt = t[i];
    const f = 1000 * Math.exp(-tt * 14) + 180;
    ph += (2 * Math.PI * f) / SR;
    b[i] = Math.tanh(Math.sin(ph) * 1.6) * env(tt, 0.001, 0.16, 2.2);
  }
  write('pop.wav', normalize(fadeTail(b), 0.8));
}

// 5. whoosh — filtered noise swell (transition)
{
  const b = buf(0.55);
  const t = T(b);
  for (let i = 0; i < b.length; i++) b[i] = (rnd() * 2 - 1) * 0.6;
  // time varying lowpass via blockwise one-pole
  const blocks = 64;
  const seg = Math.floor(b.length / blocks);
  let prev = 0;
  for (let k = 0; k < blocks; k++) {
    const x = k / blocks;
    const cut = 300 + 5200 * Math.sin(Math.PI * Math.min(1, x * 1.15));
    const rc = 1 / (2 * Math.PI * cut);
    const al = 1 / SR / (rc + 1 / SR);
    for (let i = k * seg; i < Math.min(b.length, (k + 1) * seg); i++) {
      prev += al * (b[i] - prev);
      b[i] = prev;
    }
  }
  for (let i = 0; i < b.length; i++) b[i] *= Math.sin(Math.PI * (i / b.length)) ** 1.4;
  write('whoosh.wav', normalize(fadeTail(b), 0.6));
}

// 6. swipe — short card swipe
{
  const b = buf(0.34);
  let prev = 0;
  for (let i = 0; i < b.length; i++) {
    const x = i / b.length;
    const cut = 700 + 3000 * x;
    const al = 1 / SR / (1 / (2 * Math.PI * cut) + 1 / SR);
    prev += al * ((rnd() * 2 - 1) - prev);
    b[i] = prev * Math.sin(Math.PI * x) ** 0.8;
  }
  write('swipe.wav', normalize(fadeTail(b), 0.6));
}

// 7. chime — approved bell
{
  const b = buf(1.1);
  const t = T(b);
  const partials = [
    [1, 0.5, 1.0],
    [2.01, 0.25, 0.7],
    [2.98, 0.16, 0.5],
    [4.2, 0.08, 0.32],
  ];
  for (let i = 0; i < b.length; i++) {
    const tt = t[i];
    let v = 0;
    for (const [m, a, d] of partials) v += Math.sin(2 * Math.PI * 784 * m * tt) * a * Math.exp(-tt / d);
    b[i] = v * env(tt, 0.002, 0.9, 1.6);
  }
  write('chime.wav', normalize(fadeTail(b, 40), 0.5));
}

// 8. success — three rising blips
{
  const b = buf(0.5);
  const t = T(b);
  const notes = [659.25, 880, 1318.5];
  for (let i = 0; i < b.length; i++) {
    const tt = t[i];
    let v = 0;
    notes.forEach((f, k) => {
      const s = k * 0.06;
      const e = env(tt - s, 0.002, 0.16, 2.4);
      v += Math.sin(2 * Math.PI * f * tt) * e + Math.sin(2 * Math.PI * f * 2 * tt) * e * 0.2;
    });
    b[i] = v;
  }
  write('success.wav', normalize(fadeTail(b), 0.5));
}

// 9. error — two damped buzzes
{
  const b = buf(0.42);
  const t = T(b);
  for (let i = 0; i < b.length; i++) {
    const tt = t[i];
    const e1 = env(tt, 0.004, 0.13, 1.6);
    const e2 = env(tt - 0.16, 0.004, 0.16, 1.6);
    const sq = (f) => Math.sign(Math.sin(2 * Math.PI * f * tt));
    b[i] = (sq(138) * e1 * 0.5 + Math.sin(2 * Math.PI * 276 * tt) * e1 * 0.25) + (sq(138) * e2 * 0.5 + Math.sin(2 * Math.PI * 276 * tt) * e2 * 0.25);
  }
  onePole(b, 2600);
  write('error.wav', normalize(fadeTail(b), 0.55));
}

// 10. print — receipt printer motor + paper
{
  const b = buf(0.95);
  const t = T(b);
  let prev = 0;
  for (let i = 0; i < b.length; i++) {
    const tt = t[i];
    const gate = tt > 0.05 && tt < 0.8 ? 1 : 0;
    const am = 0.55 + 0.45 * Math.sin(2 * Math.PI * 27 * tt);
    const n = rnd() * 2 - 1;
    const al = 1 / SR / (1 / (2 * Math.PI * 2200) + 1 / SR);
    prev += al * (n - prev);
    b[i] = prev * am * gate * 0.7 + Math.sin(2 * Math.PI * 96 * tt) * 0.18 * gate;
  }
  // paper tear at the end
  for (let i = Math.floor(0.8 * SR); i < b.length; i++) {
    const tt = i / SR - 0.8;
    b[i] += (rnd() * 2 - 1) * env(tt, 0.001, 0.05, 2) * 0.5;
  }
  write('print.wav', normalize(fadeTail(b), 0.55));
}

// 11. thump — sub hit for cuts
{
  const b = buf(0.4);
  const t = T(b);
  let ph = 0;
  for (let i = 0; i < b.length; i++) {
    const tt = t[i];
    const f = 58 * Math.exp(-tt * 5) + 34;
    ph += (2 * Math.PI * f) / SR;
    b[i] = Math.tanh(Math.sin(ph) * 2.2) * Math.exp(-tt / 0.16);
  }
  write('thump.wav', normalize(b, 0.7));
}

// 12. rise — long upward noise sweep for the collage
{
  const b = buf(1.6);
  const t = T(b);
  let prev = 0;
  for (let i = 0; i < b.length; i++) {
    const x = i / b.length;
    const cut = 200 * Math.pow(30, x);
    const al = 1 / SR / (1 / (2 * Math.PI * cut) + 1 / SR);
    prev += al * ((rnd() * 2 - 1) - prev);
    b[i] = prev * (0.2 + 0.8 * x);
  }
  write('rise.wav', normalize(fadeTail(b), 0.45));
}

// 13. type — single keystroke, very soft
{
  const b = buf(0.07);
  const t = T(b);
  for (let i = 0; i < b.length; i++) {
    const n = rnd() * 2 - 1;
    b[i] = n * env(t[i], 0.0005, 0.012, 2.2) * 0.8 + Math.sin(2 * Math.PI * 2400 * t[i]) * env(t[i], 0.0003, 0.008, 2) * 0.3;
  }
  onePole(b, 8000);
  write('type.wav', normalize(fadeTail(b, 4), 0.35));
}

// 14. pad — soft airy bed loop (4s, seamless-ish)
{
  const len = 4;
  const b = buf(len);
  const t = T(b);
  const chord = [110, 164.81, 220, 329.63];
  for (let i = 0; i < b.length; i++) {
    const tt = t[i];
    let v = 0;
    chord.forEach((f, k) => {
      const det = 1 + 0.0025 * Math.sin(2 * Math.PI * (0.11 + k * 0.07) * tt);
      v += Math.sin(2 * Math.PI * f * det * tt) * (0.22 / (1 + k * 0.4));
    });
    const lfo = 0.65 + 0.35 * Math.sin(2 * Math.PI * 0.25 * tt);
    b[i] = v * lfo * 0.5;
  }
  onePole(b, 1200);
  // crossfade the loop seam
  const xf = Math.floor(0.35 * SR);
  for (let i = 0; i < xf; i++) {
    const k = i / xf;
    b[i] = b[i] * k + b[b.length - xf + i] * (1 - k);
  }
  write('pad.wav', normalize(b, 0.28));
}

console.log('\nkit written to', OUT);
