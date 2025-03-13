'use strict';

import gulpMode from 'gulp-mode';


export const mode = gulpMode({
  modes: ['product', 'develop'],
  default: 'develop',
  verbose: false
});

export const outputPath = mode.product() ? './_product' : './_develop';

export const path = {
  'stylesheet': {
    'source': [
      './source/assets/styles/main.scss',
      './source/assets/styles/noscript.scss',
    ],
    'watch': './source/assets/styles/**/*.{scss,sass}',
  },
  'javascript': [
    './source/assets/scripts/main.js',
    './source/assets/scripts/util.js',
  ],
  'image': [
    './source/assets/images/**/*.{jpg,png,webp}',
    './source/images/**/*.{jpg,png,webp}',
    './source/contents/**/*.{jpg,png,webp}',
  ],
};
