'use strict';

import gulp from 'gulp';

import terser from 'gulp-terser';
import sourcemaps from 'gulp-sourcemaps';
import gulpif from 'gulp-if';

import { mode, outputPath, path } from './_config.mjs'


export const javaScript_task = function() {
    return gulp.src(path.javascript)
        .pipe(mode.develop(sourcemaps.init()))
        .pipe(gulpif(mode.product() ? true: false,
            terser({
                compress: {
                    drop_console: true,
                },
                mangle: true,
        })))
        .pipe(mode.develop(sourcemaps.write()))
        .pipe(gulp.dest(outputPath + '/assets/scripts'));
}
