import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
import {FONT_FILES} from './fonts.generated';

// Self-hosted woff2 — the render never depends on a font CDN.
FONT_FILES.forEach((font) => {
  loadFont({
    family: font.family,
    url: staticFile(font.file),
    weight: font.weight,
    style: font.style,
  });
});
