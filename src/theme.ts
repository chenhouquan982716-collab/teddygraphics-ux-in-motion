// Design tokens distilled from the reference reel.
export const W = 1920;
export const H = 1080;
export const FPS = 24;
export const DURATION = 371; // 15.458s

export const C = {
  ink: '#17181C',
  inkSoft: '#1B1D21',
  inkLine: '#2B2D32',
  paper: '#F2F0EB',
  paperDim: '#E4E2DB',
  mint: '#3BF08C',
  mintDeep: '#17C46C',
  green: '#0E7A41',
  greenDark: '#0A6B39',
  vivid: '#00E96E',
  blue: '#0A1FE0',
  pink: '#F51152',
  gray: '#8B8E90',
} as const;

export const F = {
  sans: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
  serif: '"Instrument Serif", "Times New Roman", Georgia, serif',
  mono: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
} as const;

// 1920x1080 design units for the payment-terminal layout.
export const LAYOUT = {
  textLeft: 152,
  textBaseline: 700,
  phone: {left: 1010, top: 470, width: 400, height: 640},
} as const;
