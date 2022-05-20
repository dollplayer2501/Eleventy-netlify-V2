//
//
//

//
const pluginRss = require('@11ty/eleventy-plugin-rss');
const sitemap = require('@quasibit/eleventy-plugin-sitemap');

//
const jsonData = require('./source/_data/site.json');
const shortcodes = require('./source/_data/Eleventy.shortcodes.js');
const filters = require('./source/_data/Eleventy.filters.js');

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
    eleventyConfig.addFilter('getCollectionsWelcome', filters.getCollectionsWelcome);
    eleventyConfig.addFilter('getCollectionsRelatedArticles', filters.getCollectionsRelatedArticles);
    eleventyConfig.addFilter('getCollectionsFooter', filters.getCollectionsFooter);
    eleventyConfig.addFilter('getBreadcrumb', filters.getBreadcrumb);
    eleventyConfig.addFilter('setMyCustomOrder', filters.setMyCustomOrder);

    //
    //
    //

    var collectionArray = [
        // { collectionArray_name: 'myCustomSort', collectionArray_path: './source/contents/**/*.md' },
        { collectionArray_name: 'contentsSectionsWelcome', collectionArray_path: './source/contents-sections/welcome-*.md' },
        { collectionArray_name: 'contentsSectionsWhoAmI', collectionArray_path: './source/contents-sections/who_am_i-*.md' },
    ];
    collectionArray.forEach(function (element) {
        eleventyConfig.addCollection(element.collectionArray_name, function (collectionApi) {
            return collectionApi
                .getFilteredByGlob(element.collectionArray_path)
                .sort((a, b) => Number(a.data.order) > Number(b.data.order) ? 1 : -1);
        });
    });

    //
    //
    //

    eleventyConfig.addShortcode('youtubeEmbed', shortcodes.youtubeEmbed);
    eleventyConfig.addShortcode('nicovideoEmbed', shortcodes.nicovideoEmbed);

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

    return {
        markdownTemplateEngine: 'njk',
        dataTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dir: {
            input: './source',
            layouts: './_includes/layouts',
            output: isProduction ? '_production' : '_develop'
        }
    };
};

//
//
//

function browserSyncReady(err, bs) {
    bs.addMiddleware('*', (req, res) => {
        const content_404 = fs.readFileSync('_develop/404.html');
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
        });
        return minified;
    }
    return content;
}
