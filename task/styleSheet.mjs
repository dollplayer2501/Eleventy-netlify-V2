'use strict';

import gulp from 'gulp';

import sass from 'gulp-dart-sass';
import sourcemaps from 'gulp-sourcemaps';

import { mode, outputPath, path } from './_config.mjs'


export const styleSheet_task = function() {
    return gulp.src(path.stylesheet.source)
        .pipe(mode.develop(sourcemaps.init()))
        .pipe(sass({
            includePaths: [
                // 'node_modules',
            ],
            outputStyle: mode.product() ? 'compressed' : 'expanded',
        }).on('error', sass.logError))
        .pipe(mode.develop(sourcemaps.write()))
        .pipe(gulp.dest(outputPath + '/assets/styles'));
}
