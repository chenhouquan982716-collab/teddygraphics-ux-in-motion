import React from 'react';
import {Composition} from 'remotion';
import {Reel} from './Reel';
import {DURATION, FPS, H, W} from './theme';
import './fonts';

export const Root: React.FC = () => (
  <Composition id="UIMotionReel" component={Reel} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
);
