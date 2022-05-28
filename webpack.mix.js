//
// Laravel Mix
//   path through Javascript
//   Sass/Scss compile
//

let mix = require('laravel-mix');
// let path = require('path');
let productionSourceMaps = mix.inProduction() ? false : true;
let outputPath = mix.inProduction() ? './_production' : './_develop';

//
mix
    //
    .js('./source/static/assets/scripts/main.js', './assets/scripts/main.js')
    .js('./source/static/assets/scripts/util.js', './assets/scripts/util.js')
    //
    .webpackConfig({
        stats: {
            children: true,
        },
    })
    .sass('./source/assets/styles/noscript.scss', './assets/styles/noscript.css')
    .sass('./source/assets/styles/main.scss', './assets/styles/main.css')
    .sourceMaps(productionSourceMaps, 'inline-source-map')
    .options({
        processCssUrls: false
    })
    .setPublicPath(outputPath);
