import type {Cue} from './Reel';

/**
 * Sound design cue sheet. Every hit is a synthesised UI sound from
 * scripts/make-sfx.mjs, placed on the frame where the visual lands.
 */
export const CUES: Cue[] = [
  // 01 — intro: dot, toggle, radial wipe
  {at: 3, src: 'sfx/pop.wav', volume: 0.45},
  {at: 12, src: 'sfx/whoosh.wav', volume: 0.3},
  {at: 21, src: 'sfx/switch.wav', volume: 0.55},
  {at: 32, src: 'sfx/rise.wav', volume: 0.3},
  {at: 36, src: 'sfx/thump.wav', volume: 0.5},

  // 02 — kinetic type
  {at: 39, src: 'sfx/type.wav', volume: 0.5},
  {at: 41, src: 'sfx/type.wav', volume: 0.45},
  {at: 58, src: 'sfx/whoosh.wav', volume: 0.25},
  {at: 59, src: 'sfx/type.wav', volume: 0.55},
  {at: 61, src: 'sfx/type.wav', volume: 0.5},
  {at: 70, src: 'sfx/whoosh.wav', volume: 0.28},
  {at: 71, src: 'sfx/type.wav', volume: 0.4},
  {at: 72.5, src: 'sfx/type.wav', volume: 0.4},
  {at: 74, src: 'sfx/type.wav', volume: 0.4},
  {at: 75.5, src: 'sfx/type.wav', volume: 0.4},
  {at: 77, src: 'sfx/type.wav', volume: 0.4},
  {at: 78.5, src: 'sfx/type.wav', volume: 0.4},
  {at: 80, src: 'sfx/pop.wav', volume: 0.28, rate: 1.4},
  {at: 86, src: 'sfx/thump.wav', volume: 0.35},

  // 03 — payment terminal
  {at: 88, src: 'sfx/click.wav', volume: 0.5},
  {at: 90, src: 'sfx/type.wav', volume: 0.35},
  {at: 92, src: 'sfx/type.wav', volume: 0.35},
  {at: 94, src: 'sfx/type.wav', volume: 0.35},
  {at: 96, src: 'sfx/type.wav', volume: 0.35},
  {at: 98, src: 'sfx/type.wav', volume: 0.35},
  {at: 100, src: 'sfx/type.wav', volume: 0.35},
  {at: 110, src: 'sfx/click.wav', volume: 0.5},
  {at: 113, src: 'sfx/swipe.wav', volume: 0.45},
  {at: 131, src: 'sfx/click.wav', volume: 0.5},
  {at: 133, src: 'sfx/tick.wav', volume: 0.5},
  {at: 135, src: 'sfx/tick.wav', volume: 0.5},
  {at: 137, src: 'sfx/tick.wav', volume: 0.5},
  {at: 139, src: 'sfx/tick.wav', volume: 0.5},
  {at: 141, src: 'sfx/tick.wav', volume: 0.5},
  {at: 145, src: 'sfx/chime.wav', volume: 0.5},
  {at: 145, src: 'sfx/success.wav', volume: 0.3},
  {at: 158, src: 'sfx/print.wav', volume: 0.5},
  {at: 170, src: 'sfx/pop.wav', volume: 0.3},

  // 04 — micro-interactions
  {at: 177, src: 'sfx/click.wav', volume: 0.45},
  {at: 180, src: 'sfx/swipe.wav', volume: 0.35},
  {at: 189, src: 'sfx/click.wav', volume: 0.45},
  {at: 196, src: 'sfx/pop.wav', volume: 0.35},
  {at: 200, src: 'sfx/click.wav', volume: 0.45},
  {at: 202, src: 'sfx/tick.wav', volume: 0.45},
  {at: 203.5, src: 'sfx/tick.wav', volume: 0.45},
  {at: 205, src: 'sfx/tick.wav', volume: 0.45},
  {at: 206.5, src: 'sfx/tick.wav', volume: 0.45},
  {at: 208, src: 'sfx/tick.wav', volume: 0.45},
  {at: 209.5, src: 'sfx/tick.wav', volume: 0.45},
  {at: 212, src: 'sfx/swipe.wav', volume: 0.5},
  {at: 224, src: 'sfx/switch.wav', volume: 0.4},
  {at: 236, src: 'sfx/error.wav', volume: 0.55},
  {at: 248, src: 'sfx/pop.wav', volume: 0.45},
  {at: 251, src: 'sfx/pop.wav', volume: 0.3, rate: 1.2},
  {at: 259, src: 'sfx/click.wav', volume: 0.4},
  {at: 265, src: 'sfx/tick.wav', volume: 0.3},

  // 05 — collage
  {at: 271, src: 'sfx/rise.wav', volume: 0.5},
  {at: 272, src: 'sfx/thump.wav', volume: 0.5},
  {at: 300, src: 'sfx/whoosh.wav', volume: 0.3},
  {at: 322, src: 'sfx/thump.wav', volume: 0.35},

  // 06 — outro
  {at: 325, src: 'sfx/rise.wav', volume: 0.3},
  {at: 337, src: 'sfx/chime.wav', volume: 0.45},
  {at: 355, src: 'sfx/pop.wav', volume: 0.3},
  {at: 362, src: 'sfx/whoosh.wav', volume: 0.22},
];
