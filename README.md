# Something like a "blog" but not a "blog"

**I built this based on [Eleventy][Eleventy-url], not to mass produce articles on blogs, but to mass produce articles on a "topic/theme".**  
ブログで記事を量産するため、ではなく、ある「トピック/テーマ」について記事を量産するために、私は[Eleventy][Eleventy-url]をベースに、これを構築しました。

[Eleventy-url]: https://www.11ty.dev/


[![Netlify Status](https://api.netlify.com/api/v1/badges/4e9ef566-2b94-44b6-af12-7f84524cc2d7/deploy-status)](https://app.netlify.com/sites/dollplayer2501/deploys)

[Demo site (unlimited text works, the 4th.)](https://dollplayer2501.netlify.app/)


## Getting Started


    git clone git@github.com:dollplayer2501/Eleventy-netlify-V2.git any-path-name
    cd any-path-name
    nvm use
    npm install

    #
    # 1. Local
    #   Data is stored in ./any-path-name/_develop
    #
    npm run develop:build-watch
    # http://localhost:8080

    # 2. Production
    #   Data is stored in ./any-path-name/_production
    #   HTML, CSS, Javascript are compressed
    #   Built and published on Netlify
    #
    npm run product:build
    # If you want to check production's data
    npm run product:serve
    # http://localhost:3000

When you write an article after building a local environment, it is recommended to run `npm run develop:eleventy:watach` to write the article.

**Notes for me !**

When developing a filter, `npx @11ty/eleventy --config=Eleventy.js --quiet` or `npm run develop:eleventy:build`. I feel that this method is safer.


## Features


### Eleventy

- [Eleventy, a simpler static site generator](https://www.11ty.dev/)
- [Nunjucks](https://mozilla.github.io/nunjucks/)
- (BrowserSync)

To avoid cluttering the description in the template engine, I use [Eleventy's filtering feature](https://www.11ty.dev/docs/filters/).

The plugin below was difficult for me to use, so I haven't used it.

- [Image pulgin](https://www.11ty.dev/docs/plugins/image/)
- [Navigation pulgin](https://www.11ty.dev/docs/plugins/navigation/)

Markdown uses the following npm packages.

- [markdown-it](https://www.npmjs.com/package/markdown-it)
- [markdown-it-anchor](https://www.npmjs.com/package/markdown-it-anchor)
- [markdown-it-deflist](https://www.npmjs.com/package/markdown-it-deflist)
- [markdown-it-footnote](https://www.npmjs.com/package/markdown-it-footnote)
- [markdown-it-table-of-contents](https://www.npmjs.com/package/markdown-it-table-of-contents)
- Implementation of ruby tag using [shortcodes](https://www.11ty.dev/docs/shortcodes/) instead of [markdown-it-ruby](https://www.npmjs.com/package/markdown-it-ruby)

[Here](https://dollplayer2501.netlify.app/test-data/child01/) is the sample page for the example above.


### Laravel Mix

> **Note**  
> I stopped using Laravel Mix and unified Gulp to use.

- Compiling SCSS
- Passthrough file/directry copy, also possible with Eleventy, see [Passthrough File Copy - Eleventy](https://www.11ty.dev/docs/copy/)

Regarding SCSS, I'm using responsive HTML5 and CSS3 site templates, [Solid State](https://html5up.net/solid-state) of [HTML5 UP!](https://html5up.net/).  
I had the option to use Webpack, but I couldn't compile with SCSS and I could compile with Laravel Mix, so I used it.


### Gulp

- [gulp-libsquoosh](https://www.npmjs.com/package/gulp-libsquoosh)  
I currently don't know how to compress the image. Is the existing method of using imagemin currently available?
- gulp-sass/sass  
I use [`addWatchTarget`](https://www.11ty.dev/docs/watch-serve/) for the directories.
- gulp-uglify
