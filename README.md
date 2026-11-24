# UX in Motion — a Remotion recreation

A frame-accurate reconstruction of the **TeddyGraphix "UX in Motion"** UI reel as a
component-based [Remotion](https://remotion.dev) project: 15.46 s, 1920×1080, 24 fps,
eight bars, one payment-terminal story, eight micro-interactions and a vector-traced
outro mark.

Everything you see is code — no video assets, no stock footage, no image files.
The only binaries in the repo are the self-hosted woff2 fonts and the synthesised
`.wav` UI-sound kit.

```
npm install
npm run dev        # Remotion Studio, scrubbable timeline
npm run render     # -> out/ui-motion-reel.mp4 (h264 + aac)
```

---

## 1. What the reference does

The source clip is a 736×414 / 24 fps screen recording of a *fake product* motion
reel. Its whole joke is that the UI is the hero: a card reader, a slider, a toggle,
a PIN pad, a chart — each one gets half a second and a hard cut.

Measured off the reference (frame numbers at 24 fps):

| Bars | Frames | Section | Content |
| --- | --- | --- | --- |
| 01–02 | 0–87 | `01 — INTRO` | radial reveal → dot ignition → toggle switches on → white wipe into kinetic type (`UX` / `IN` / `MOTION`) |
| 03–04 | 88–176 | `02 — PAYMENT TERMINAL` | five steps: `Amount` (counting) → `Tap.` → `PIN.` → `Approved.` → `Printed.` with a receipt printing out of the device |
| 05–06 | 177–270 | `03 — MICRO-INTERACTIONS` | eight half-second cuts: slider / loader / growth chart / card swipe / LTR↔RTL mirror / incorrect PIN / 200 % text / kiosk order |
| 07 | 271–324 | `04 — SYSTEMS` | the whole design system collapses into one tilted, zooming tile wall |
| 08 | 325–371 | `04 — SYSTEMS` | the mark assembles, the tagline lands, fade to black |

### The house style, transcribed

* **Palette** — ink `#17181C`, paper `#F2F0EB`, mint `#3BF08C`, deep green `#0E7A41`,
  vivid green `#00E96E`, electric blue `#0A1FE0`, hot pink `#F51152`.
* **Type** — a heavy neo-grotesque for the display words (Inter 900, tight tracking),
  a high-contrast serif for the payment copy (Instrument Serif), a monospace for the
  viewfinder HUD (IBM Plex Mono).
* **HUD** — corner brackets, `TEDDYGRAPHICS / UI MOTION REEL · 2026`, a running
  `00:00:SS:FF` timecode *counting at 60 fps even though the file is 24 fps*, a
  `1920×1080 · 60 FPS` caption, the shot label and a four-square `BAR 0X / 08`
  progress meter. It flips to dark ink whenever the shot is paper-coloured.
* **Rhythm** — hard cuts every 11–12 frames in the micro section, one white radial
  wipe at 1.5 s, and a black-cut every time the story changes set.

---

## 2. How it is built

```
src/
  index.ts            registerRoot
  Root.tsx            the single <Composition>
  Reel.tsx            master timeline: six <Sequence>s + HUD + soundtrack
  theme.ts            colour / font / layout tokens
  audio.ts            sound-design cue sheet (frame → sample → gain)
  logo-path.ts        vector trace of the outro mark (auto-generated)
  fonts.generated.ts  self-hosted font manifest (auto-generated)
  components/
    Hud.tsx           viewfinder overlay, timecode, bar progress
    Phone.tsx         the card-reader device + receipt printer + odometer digits
    Primitives.tsx    ghost words, film grain, vignette, rings, pills
  scenes/
    S1Intro.tsx       0–37     dot → toggle → wipe
    S2Type.tsx        38–87    masked per-letter kinetic type, custom green "O"
    S3Payment.tsx     88–176   five-step terminal story
    S4Micro.tsx       177–270  eight micro-interaction cuts
    S5Collage.tsx     271–324  tilted tile wall
    S6Outro.tsx       325–370  mark assembly + lockup
public/
  fonts/*.woff2       Inter, Instrument Serif, IBM Plex Mono (latin subset, ~233 kB)
  sfx/*.wav           synthesised UI kit (~1 MB)
scripts/
  make-sfx.mjs        deterministic DSP: clicks, whooshes, chime, printer, error
  copy-fonts.mjs      pulls the woff2 files out of @fontsource
tools/
  trace-logo.py       OpenCV trace of the outro mark → src/logo-path.ts
```

### Motion primitives

* **Masked type** — every letter sits in its own `overflow:hidden` window and is
  driven by a `spring()` from `translateY(118%) → 0`, with the blur ramping out.
  Exits run the same trick upward, so the words look like they roll behind a slot.
* **The green O** — no glyph: a `conic-gradient` disc with a paper-coloured hole,
  sized to the cap height of `MOTION`.
* **Toggle** — one div whose width/height/radius are interpolated from the ignition
  dot, with a spring-driven knob and a blurred motion-trail ghost.
* **Payment device** — a 400×590 chassis, 344 px screen, three physical buttons;
  the receipt is a `clip-path` zig-zag strip whose height grows out of the top of
  the device.
* **Micro cuts** — each is its own component mounted in a `<Sequence>`; the whole
  shot scales `1.06 → 1` in three frames so the cut bites.
* **Collage** — 28 mini-UI tiles in a `rotate(-9deg)` grid, `scale 0.04 → 1.34`
  with a `blur(26px) → 0` ramp; each tile is a different micro-UI from the reel.
* **Outro mark** — the bear is a real Bézier path traced from the reference frame
  (`tools/trace-logo.py`), rendered as a single even-odd `<path>`, with five
  offset echoes converging during assembly.

### Sound design

The reference is an *audio-first* reel: the spectrogram is almost entirely
percussive transients plus a low rumble — UI sounds, not music. So the project
synthesises its own kit with a tiny DSP script and places every hit on the frame
where the visual lands (`src/audio.ts`):

`tick` · `click` · `switch` · `pop` · `whoosh` · `swipe` · `chime` · `success` ·
`error` · `print` · `thump` · `rise` · `type` · a 4 s `pad` bed.

Regenerate at any time — output is deterministic:

```
npm run sfx
```

---

## 3. Commands

| command | what it does |
| --- | --- |
| `npm run dev` | Remotion Studio at `localhost:3000` |
| `npm run render` | full render → `out/ui-motion-reel.mp4` |
| `npm run still -- out/f150.png --frame=150` | single frame PNG |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run sfx` | rebuild the sound kit |
| `npx remotion render src/index.ts UIMotionReel out/preview.mp4 --scale=0.5` | half-res preview |

If Remotion cannot find a browser on your machine, point it at one:

```
npx remotion render src/index.ts UIMotionReel out/ui-motion-reel.mp4 \
  --browser-executable="/path/to/chrome"
```

## 4. Notes

* Rendering is deterministic — no `Math.random()`, no `Date.now()`, all noise is a
  seeded PRNG or a static SVG turbulence tile.
* Fonts are self-hosted (SIL OFL) so the render never touches a CDN.
* The remake is a study of the original design; all UI copy, colours and the mark
  belong to TeddyGraphix.
