'use strict';

//
// npx gulp foo               # default
// npx gulp foo --develop
//
// npx gulp foo --production
//
// 出力先の削除はdelで上手く行かなさそうな気がするので、
// （削除と生成のタイミングがずれている疑惑）
// npmスクリプト側で対応
//

const { src, dest, series, parallel, watch } = require('gulp');
//
var mode = require('gulp-mode')({
    modes: ['production', 'develop'],
    default: 'develop',
    verbose: false
});
const outputPath = mode.production() ? './_production' : './_develop';

//
const rename = require('gulp-rename');
const changed = require('gulp-changed');

//
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
//
const uglify = require('gulp-uglify');
//
const squoosh = require('gulp-libsquoosh');

//
const path = {
    'scss': {
        'source': [
            './source/assets/styles/main.scss',
            './source/assets/styles/noscript.scss',
        ],
        'watch': './source/assets/styles/**/*.{scss,sass}',
    },
    'javascript': [
        './source/static/assets/scripts/main.js',
        './source/static/assets/scripts/util.js',
    ],
    'image': [
        './source/assets/images/**/*.{jpg,png,webp}',
        './source/images/**/*.{jpg,png,webp}',
        './source/contents/**/*.{jpg,png,webp}',
    ],
};

//
//
//
function dummy(done) {
    console.log('[00:00:00] This is dummy!');
    console.log('[00:00:00] Output path? ' + outputPath);
    console.log(path);
    done();
}

//
//
//
function scss(done) {
    console.log('[00:00:00] Sass/SCSS');

    src(path.scss.source)
        .pipe(mode.develop(sourcemaps.init()))
        .pipe(sass({
            outputStyle: mode.production() ? 'compressed' : 'expanded'
        }))
        .pipe(mode.develop(sourcemaps.write()))
        .pipe(dest(outputPath + '/assets/styles'));
    done();
};

//
//
//
function javascript(done) {
    console.log('[00:00:00] JavaScript');

    src(path.javascript)
        .pipe(mode.production(uglify({
            output:{
              comments: /^!/
            }
          })))
        .pipe(dest(outputPath + '/assets/scripts'));
    done();
}

//
//
//
function image(done) {
    console.log('[00:00:00] Images');

    //
    // 画像は各種ディレクトリに散らばっているが、全て`./images`に格納
    // 本番時のみ圧縮を行う
    //
    // .pipe(mode.production(squoosh()))
    //    の場合、npmスクリプトから`npm-run-all --parallel/--sequential`で
    //    `--production`を付与しているスクリプトを起動しても`squoosh`しないので
    //    敢えて下記の様にしている
    //    理由不明
    //

    if (mode.production()) {
        src(path.image)
        .pipe(rename(function (path) {
            path.dirname = '/images';
        }))
        .pipe(squoosh())
        .pipe(dest(outputPath));
    } else {
        src(path.image)
        .pipe(rename(function (path) {
            path.dirname = '/images';
        }))
        .pipe(dest(outputPath));
    }
    done();
}

//
//
//
function watching(done) {
    watch(path.scss.watch, series(scss));
    watch(path.javascript, series(javascript));
    watch(path.image, series(image));
    done();
}

//
//
//
exports.default = series(dummy);
//
exports.css = series(scss);
exports.js = series(javascript);
exports.image = series(image);
//
// npmスクリプトからwatchする場合、事前にbuildするよ
exports.build = series(image, scss, javascript);
exports.watch = series(watching);

//
