//
// Laravel Mix
//   path through Javascript
//   Sass/Scss compile
//

let mix = require('laravel-mix');
let path = require('path');
let productionSourceMaps = mix.inProduction() ? false : true;
let outputPath = mix.inProduction() ? '_production' : '_develop';

//
mix
    //
    .js('source/static/assets/scripts/main.js', 'assets/scripts/main.js')
    .js('source/static/assets/scripts/util.js', 'assets/scripts/util.js')
    //
    .sass('source/assets/styles/noscript.scss', 'assets/styles/noscript.css')
    .sass('source/assets/styles/main.scss', 'assets/styles/main.css')
    .sourceMaps(productionSourceMaps, 'inline-source-map')
    .options({
        processCssUrls: false
    })
    .setPublicPath(outputPath)
    //
    .copyDirectory('source/static/assets/webfonts', path.join(outputPath, 'assets/webfonts'))
    .copyDirectory('source/static/assets/styles/images', path.join(outputPath, 'assets/styles/images'))
    //
    .copy('source/static/assets/styles/fontawesome-all.min.css', path.join(outputPath, 'assets/styles/fontawesome-all.min.css'))
    //
    .copy('source/static/assets/scripts/breakpoints.min.js', path.join(outputPath, 'assets/scripts/breakpoints.min.js'))
    .copy('source/static/assets/scripts/browser.min.js', path.join(outputPath, 'assets/scripts/browser.min.js'))
    .copy('source/static/assets/scripts/jquery.min.js', path.join(outputPath, 'assets/scripts/jquery.min.js'))
    .copy('source/static/assets/scripts/jquery.scrollex.min.js', path.join(outputPath, 'assets/scripts/jquery.scrollex.min.js'))
    //
    .copy('source/static/meta/**', outputPath);
//
