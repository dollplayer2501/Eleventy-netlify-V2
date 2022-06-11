//
//
//

//
const directoryOutputPlugin = require('@11ty/eleventy-plugin-directory-output');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const sitemap = require('@quasibit/eleventy-plugin-sitemap');

//
const jsonData = require('./source/_data/site.json');
const shortcodes = require('./source/_config/eleventy.shortcodes.js');
const filters = require('./source/_config/eleventy.filters.js');

//
const markdownIt = require('markdown-it');
const markdownItDeflist = require('markdown-it-deflist');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItTableOfContents = require('markdown-it-table-of-contents');
const markdownItFootnote = require('markdown-it-footnote');
//
const fs = require('fs');
const htmlmin = require('html-minifier');
//
const { DateTime } = require('luxon');

//
const isProduction = process.env.NODE_ENV === 'production';

//
//
//
module.exports = function (eleventyConfig) {

    //
    //
    //

    eleventyConfig.setQuietMode(true);
    eleventyConfig.addPlugin(directoryOutputPlugin, {
        columns: {
            filesize: true,
            benchmark: true,
        },
        warningFileSize: 400 * 1000,
    });

    eleventyConfig.addPlugin(pluginRss, {
        posthtmlRenderOptions: {
            // See
            //   https://github.com/posthtml/posthtml-render#options
            //   https://learneleventyfromscratch.com/lesson/17.html#adding-an-rss-feed
            closingSingleTag: 'default'
        }
    });
    //
    eleventyConfig.addPlugin(sitemap, {
        sitemap: {
            hostname: jsonData.url,
        },
    });

    //
    //
    //

    eleventyConfig.addFilter('setHeadTitle', filters.setHeadTitle);
    eleventyConfig.addFilter('getCollectionsWelcomeMainContents', filters.getCollectionsWelcomeMainContents);
    eleventyConfig.addFilter('getCollectionsWelcomeRecentUpdated', filters.getCollectionsWelcomeRecentUpdated);
    eleventyConfig.addFilter('getCollectionsRelatedArticles', filters.getCollectionsRelatedArticles);
    eleventyConfig.addFilter('getCollectionsFooter', filters.getCollectionsFooter);
    eleventyConfig.addFilter('getBreadcrumb', filters.getBreadcrumb);
    eleventyConfig.addFilter('setMyCustomOrder', filters.setMyCustomOrder);

    //
    //
    //

    var collectionArray = [
        { collectionArray_name: 'contentsSectionsWelcome', collectionArray_path: './source/sections/welcome-*.md' },
        { collectionArray_name: 'contentsSectionsWhoAmI', collectionArray_path: './source/sections/who_am_i-*.md' },
    ];
    collectionArray.forEach(function (element) {
        eleventyConfig.addCollection(element.collectionArray_name, function (collectionApi) {
            return collectionApi
                .getFilteredByGlob(element.collectionArray_path)
                .sort((a, b) => Number(a.data.order) > Number(b.data.order) ? 1 : -1);
        });
    });

    // If 'updated' in *.md exists, sort it in descending order.
    //   If you use 'date', 11ty will see the date of the file's date.
    //   I wanted to avoid it. Therefore, I explicitly use 'updated'.
    eleventyConfig.addCollection('myCustomSortRecentUpdated', function (collectionApi) {
        return collectionApi
            .getAll()
            .filter(function (value) {
                if (null != value.data.updated) {
                    return value;
                }
            })
            .sort(function (a, b) {
                return b.data.updated - a.data.updated;
            });
    });

    //
    //
    //

    eleventyConfig.addShortcode('youtubeEmbed', shortcodes.youtubeEmbed);
    eleventyConfig.addShortcode('nicovideoEmbed', shortcodes.nicovideoEmbed);
    eleventyConfig.addShortcode('imageEmbed', shortcodes.imageEmbed);
    eleventyConfig.addShortcode('rubyEmbed', shortcodes.rubyEmbed);

    //
    //
    //

    eleventyConfig.setNunjucksEnvironmentOptions({
        throwOnUndefined: true,
        autoescape: false, // warning: don’t do this!
    });

    //

    if (isProduction) {
        eleventyConfig.addTransform('htmlmin', htmlminTransform);
    } else {
        eleventyConfig.setBrowserSyncConfig({
            callbacks: { ready: browserSyncReady },
        });
    }

    //
    //
    //

    let markdownIt_options = {
        html: true,
        breaks: true,
        linkify: true,
    };
    //
    let markdownItTableOfContents_options = {
        includeLevel: [3, 4, 5],
        containerClass: 'table-of-contents',
        markerPattern: /^\[\[toc\]\]/im,
        listType: 'ol',
        containerHeaderHtml: '<h2>Table of contents...</h2>',
        containerFooterHtml: '',
    };
    //
    let markdownItFootnote_options = {
        html: true,
        linkify: true,
        typographer: true
    };
    //
    let markdownLib = markdownIt(markdownIt_options)
        .use(markdownItDeflist)
        .use(markdownItTableOfContents, markdownItTableOfContents_options)
        .use(markdownItAnchor)
        .use(markdownItFootnote, markdownItFootnote_options);
    //
    markdownLib.renderer.rules.footnote_block_open = () =>
        '<section class="footnotes">' + '<hr>' + '<h2>Footnotes...</h2>' + '<ol>';
    //
    eleventyConfig.setLibrary('md', markdownLib);

    //
    //
    //

    eleventyConfig.addFilter('readableDate', (dateObj) => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' })
            .toFormat('dd LLLL yyyy');
    });

    //
    //
    //

    eleventyConfig.addPassthroughCopy({ './source/static/assets/webfonts': './assets/webfonts' });
    eleventyConfig.addPassthroughCopy({ './source/static/assets/styles/images': './assets/styles/images' });
    //
    eleventyConfig.addPassthroughCopy({ './source/static/assets/styles/fontawesome-all.min.css': './assets/styles/fontawesome-all.min.css' });
    //
    eleventyConfig.addPassthroughCopy({ './source/static/assets/scripts/breakpoints.min.js': './assets/scripts/breakpoints.min.js' });
    eleventyConfig.addPassthroughCopy({ './source/static/assets/scripts/browser.min.js': './assets/scripts/browser.min.js' });
    eleventyConfig.addPassthroughCopy({ './source/static/assets/scripts/jquery.min.js': './assets/scripts/jquery.min.js' });
    eleventyConfig.addPassthroughCopy({ './source/static/assets/scripts/jquery.scrollex.min.js': './assets/scripts/jquery.scrollex.min.js' });
    //
    eleventyConfig.addPassthroughCopy({ './source/assets/images/**/*.{jpg,jpeg,png,webp}': './images' });
    eleventyConfig.addPassthroughCopy({ './source/images/**/*.{jpg,jpeg,png,webp}': './images' });
    eleventyConfig.addPassthroughCopy({ './source/contents/**/*.{jpg,jpeg,png,webp}': './images' });
    //
    eleventyConfig.addPassthroughCopy({ './source/static/meta/**': './' });

    //
    //
    //

    return {
        markdownTemplateEngine: 'njk',
        dataTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dir: {
            input: './source',
            layouts: './_includes/layouts',
            output: isProduction ? './_production' : './_develop'
        }
    };
};

//
//
//

function browserSyncReady(err, bs) {
    bs.addMiddleware('*', (req, res) => {
        const content_404 = fs.readFileSync('./_develop/404.html');
        // Provides the 404 content without redirect.
        res.write(content_404);
        // Add 404 http status code in request header.
        // res.writeHead(404, { 'Content-Type": "text/html' });
        res.writeHead(404);
        res.end();
    });
}

function htmlminTransform(content, outputPath) {
    if (!outputPath) {
        return content;
    }

    if (outputPath.endsWith('.html')) {
        let minified = htmlmin.minify(content, {
            useShortDoctype: true,
            removeComments: true,
            collapseWhitespace: true,
            minifyJS: true,
        });
        return minified;
    }
    return content;
}
