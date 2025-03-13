'use strict';
//
//
//

import gulp from 'gulp';

import { styleSheet_task } from './task/styleSheet.mjs';
import { javaScript_task } from './task/javaScript.mjs';
import { imageWebp_task } from './task/imageWebp.mjs';

import { path } from './task/_config.mjs';


export { styleSheet_task as stylesheet };
export { javaScript_task as javascript };
export { imageWebp_task as imageWebp };


const building_task = gulp.parallel(styleSheet_task, javaScript_task, imageWebp_task);
export { building_task as build };


const watching_task = function() {
  gulp.watch(path.stylesheet.watch, gulp.series(styleSheet_task));
  gulp.watch(path.javascript, gulp.series(javaScript_task));
  gulp.watch(path.image, gulp.series(imageWebp_task));
}
export { watching_task as watch };
