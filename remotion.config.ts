import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
// Renders at 1920x1080; set the scale to 0.5 for quick previews:
//   npx remotion render UIMotionReel out/preview.mp4 --scale=0.5
