//
// Gulp
//   Only image optimize function
//
'use strict';

//
const { src, dest, series, watch } = require('gulp');
const mode = require('gulp-mode')();
const changed = require('gulp-changed');
const squoosh = require('gulp-libsquoosh');

//
const inputPath = [
    'source/assets/images/**/*.{jpg,png,webp}',
    'source/contents-images/**/*.{jpg,png,webp}'
];
const outputPath = mode.production() ? '_production/images' : '_develop/images';

//
function images_opt(done) {
    src(inputPath)
        .pipe(changed(outputPath))
        .pipe(squoosh())
        .pipe(dest(outputPath));
    done();
}

//
function watchTask(done) {
    watch(inputPath, series(images_opt));
    done();
}

//
exports.images = series(images_opt);
exports.watch = series(watchTask);
