'use strict';

import gulp from 'gulp';

import webp from 'gulp-webp';

import { outputPath, path } from './_config.mjs'


export const imageWebp_task = function(done) {
  gulp.src(path.image, {
      since: gulp.lastRun(imageWebp_task)
    })
    .pipe(webp())
    .pipe(gulp.dest(outputPath + '/images'));
  done();
}

// TODO: to webp, only product version

