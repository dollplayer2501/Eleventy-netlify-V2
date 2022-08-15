---
title: 2022年6月の時点でGulpについて書くのは抵抗が無い訳で無い、とは表立って言いませんが
order: 03
permalink: /backstage/03/index.html
layout: list.njk
date: 2022-06-20
updated: 2022-06-20
---

自分はピンのプログラマ（自称）です。  
とは言え、リアルでフロントエンド系の知り合いや顔見知りは居ても、特に近年は[例の影響](https://ja.wikipedia.org/wiki/%E6%96%B0%E5%9E%8B%E3%82%B3%E3%83%AD%E3%83%8A%E3%82%A6%E3%82%A4%E3%83%AB%E3%82%B9%E6%84%9F%E6%9F%93%E7%97%87_(2019%E5%B9%B4))もあるので直接顔を合わせる機会も無くなり、それ以前に、常時深く付き合いがある訳で無いので、フロントエンドのトレンドが全く分からない、プラス、[Node.js](https://nodejs.org/ja/)やJavaScriptに詳しくない、という前提です。  
更には[Gulp](https://gulpjs.com/)のversion3の頃ならともかく ^[[Grunt](https://gruntjs.com/)は名前しか知らず、使った事がありませんし、Webpackも記述方を結構忘れていますね…] 、現時点での選択肢は[Webpack](https://webpack.js.org/)や[Laravel Mix](https://laravel-mix.com/)もある訳で…有名ドコロだと…他にも自分が知らないだけで色々あるかもしれません。


[[toc]]


### 目標

自分がGulpを使い出したのはversion3の頃で、その頃から後述する「目標」がありました。
しかし、自分のスキル不足や情報収集能力不足で残念ならがら達成できず、もしくは場当たり的に対処していたため、「型」を体感として覚えていない状態でした。^[JavaScriptは（仕様や実装が乱立していた）Webブラウザでしか動かす事ができない頃の印象が強く、とても自分では太刀打ちできる言語環境では無いと思い、基本、他の人にJavaScript関連の業務はお願いしていましたが、Gulp…Node.jsはコンソール環境で稼働するので、個人的には取り組みやすくなった気がしますし、多少は実力が付いた気がしますが、それでもトランスパイルやら何やら、となると今もお手上げ状態ですね。]
その後、Gulpがversion4になり、Gulp自体の記述方が変わり、更には、Sass/SCSSの記述方やコンパイルの実装も変わり、画像圧縮も従来の方法だと対処できなくなり、と、これがフロントエンドのパワーなんだな、と感じると同時に、今まで学習した事柄を捨てて新たに学び直す必要もあるので、正直、面倒だなぁというのがあります。

そしてその前述した目標ですが、具体的には下記になります。

1. ローカル環境と本番環境の出力ディレクトリの完全分離 ^[これ、そこまでは不要なのかなぁ…[Eleventyのスタータープロジェクト](https://www.11ty.dev/docs/starter/)でも見なくて…自分は絶対に必要とする機能だけど…ちなみにローカル環境も本番環境も`.gitignore`して管理対象外です。]  
出力ディレクトリの削除は、Gulpの[del](https://www.npmjs.com/package/del)で行っても上手く連動しないケースがある模様なので ^[凄く曖昧な記述をしているのは、もしかして自分のポカミス疑惑が拭えないけど、という前提で。Gulpのdelを用いたタスクを起動した場合、既に出力先に各種ファイル群が生成されている状態だと正常に動いているが、`rm -rf`した状態、つまりディレクトリが存在しない場合だと、各種ファイルを生成した後にGulpのdelが実行されている疑惑。Gulpの[series](https://gulpjs.com/docs/en/api/series)も[parallel](https://gulpjs.com/docs/en/api/parallel)も問題無く記述していた筈なのですが状態。] 、npmスプリクト側（[rimraf](https://www.npmjs.com/package/rimraf)）で対応
2. ソースマップは本番環境では不要  
`hoge.min.css`の様なリネームまでは望まない
3. HTML・CSS・JavaScript・画像の圧縮は本番環境のみ  
現在、HTML生成は、例えば[Jade/Pug](https://pugjs.org/api/getting-started.html)を用いてGulpで行うのではなく、[Eleventy](https://www.11ty.dev/)で[Nunjucks](https://mozilla.github.io/nunjucks/templating.html)を使用


### 実装

それらを全て包含したソースコードですが、実はこのサイトではなく、このサイトの構築に遅れて同時期に作成した、自身のポートフォリオ…ではありませんが、ランディングページが近いかな、私の名刺に記載しているproject2501という屋号のサイトになります。  
いずれこのサイトにもマージする予定ですが。

- [project2501のウェブサイト](https://project2501.duelist.org/)
- [project2501のGitHub](https://github.com/dollplayer2501/project2501-v2)

project2501は1枚ページですが、ざっくり説明すると…（CSSのWebブラウザ互換の組み込みなど、色々と足りない機能はありますが）

1. Gulpで行なうタスク
    1. Sass/SCSSコンパイルと圧縮  
ローカル環境のみソースマップあり、本番環境のみ圧縮
    2. JavaScriptの圧縮  
本番環境のみ  
concat/連結やトランスパイルは行なっていない（勉強不足で分からない）
    3. 画像の圧縮  
本番環境のみ
2. Eleventyで行なうタスク
    1. YAML+MarkdownとNunjucksなどによるコンテンツの生成
    1. [パススルーファイルコピー](https://www.11ty.dev/docs/copy/)
    2. [ファイル更新の監視とWebブラウザの自動リロード](https://www.11ty.dev/docs/watch-serve/)

以前だと`gulpfile.js`はタスク単位でファイル分割していましたが、今はしていません。^[記述方を忘れたのと、1ファイルでも、そこまで長くならないと思うので。]

そしてこれら、前述の投稿<small>（2022年5月から6月にかけて、このサイトをほぼ完全リニューアルした件）</small>でもチラッと記述した通りで、  
「Gulpを直接起動 ^[グローバル・ローカルインストールのどちらでもいいと思うけど、自分はローカルのみにインストール。] 、`npx gulp hoge`するのではなく、npmスクリプト、`package.json`の`scripts`で色々と操作や制御しようよ、どうせ黒い窓使うのには変わらないのだから」^[今更ですが、何故コレに気付けたのか、今となっては思い出せません。おそらくですが、Eleventyのスタータープロジェクトをなりふり構わず漁っていた時、どれかのスタータープロジェクトにその様な記述をしていたのに気付いたのではないかと。]  
になりますかね。  
プラス、npmスクリプトで[npm-run-all](https://www.npmjs.com/package/npm-run-all)を使えば、かなり柔軟に対応できる気がするのは、理論上はGulpだけでなく、[並行して](https://github.com/mysticatea/npm-run-all/blob/HEAD/docs/run-p.md)/[順次に](https://github.com/mysticatea/npm-run-all/blob/HEAD/docs/run-s.md) ^[`run-p`や`run-s`と書かず、`npm-run-all hoge --parallel`や`npm-run-all hoge --serial`と記述しているのは自分の好みです。また、ワイルドカード的な機能を使用していないのは、その方がポカミスを防ぐ可能性が高い、と判断したからです。] 、Laravel Mixなども併用できる点ですね。  
例えばLaravel MixでSass/SCSSのコンパイルなどを行ない、他のタスクはGulpなどで行なう、という芸当も可能になるので。 ^[ただ、Laravel Mixはコンソール画面の出力結果が、EleventyやGulpと大幅に違う独自のインタフェース過ぎてちょっと嫌かな、と思いましたが、それを抑制するオプション/引数が不明で…]  
この利点は、将来、前述した様な各タスクのトレンドや栄枯盛衰にも追随できる点、つまり、タスク単位で捨てる事を前提とできる、かなと思っています。  
および、是が非でもGulpだけ、Laravel Mixだけ、みたいな事をしなくていい点もあると思います。


### ドツボ（どうでもいい話）

一方で、タスクの切り分けが上手く行っていないと、変なトコロでアタマを抱える事態に遭遇しますが。  
例えば下記の状態で、上手く行かない原因がまさか自分にあるとは思わず、でした。

本番環境の画像の圧縮タスクを含むnpmスクリプトを起動した場合…

1. コミットのバージョンが違いますが、前提として、[`package.json`](https://github.com/dollplayer2501/Eleventy-netlify-V2/commit/1658d8b2af73f7885aa004797aa736c09f192811#diff-7ae45ad102eab3b6d7e7896acd08c427a9b25b346470d7bc6507b6481575d519)の`product:build`を起動
2. まず最初に、[`gulpfile.js`](https://github.com/dollplayer2501/Eleventy-netlify-V2/commit/b05a03811f48d8567027e5eb0c0e56b3f9bc6709#diff-25789e3ba4c2adf4a68996260eb693a441b4a834c38b76167a120f0b51b969f7)の各種タスクが稼働する中で、画像圧縮タスクが起動
3. 次いで、[`Eleventy.js`](https://github.com/dollplayer2501/Eleventy-netlify-V2/commit/b05a03811f48d8567027e5eb0c0e56b3f9bc6709#diff-a2a333d2f2c706050b19f90f79e234283a11fb4797063a2d5ba102aa21559daf)の`addPassthroughCopy`で、画像ファイルを上書き

詰まるトコロ、ローカル環境ではGulpで画像圧縮を行わず、実質、ファイルコピーした後、次に起動するEleventyでパススルーコピーしていたので気付かなかった、気付くのに遅れた、という初歩的なミスをしでかしていました。  
ですが本番環境では、レスポンス時間的にも画像圧縮を行なっているっぽく感じるのに、何故かオリジナルとのファイルサイズが同じ、という。  
しかも、敢えて`npx gulp image`や（今は存在しませんが）`npm run product:gulp:image`単体の起動だと上手く行ってるのに、みたいな。

および、Webブラウザの自動リロードも、もしかするとドツボになるかもしれません。  
幸いな事にElenentyには`addWatchTarget`・`setWatchThrottleWaitTime`という機能がありましたので、ミリ秒を適当に決め打ちして実現しています。  
無ければ無かったで、F5を押下すればいいだけでなので、そこまでこだわっていませんが。


### まとめ

改めてまとめますと、下記の様に言えるのかなと思います…と言うか、これが自分の「型」なのかなと思います。

1. Gulpなどタスクランナーはnpmスクリプトで起動  
[cross-env](https://www.npmjs.com/package/cross-env)を使用して、`cross-env NODE_ENV=production npx gulp hoge`など、本番環境とローカル環境を分けて記述
2. npmスクリプトの各スクリプトは、`npm-run-all`で起動順を制御
3. `gulpfile.js`の[gulp-mode](https://www.npmjs.com/package/gulp-mode)で、npmスクリプトの引数（本番環境とローカル環境）を制御
4. 各タスクは、例えば`mode.develop()`・`mode.production()`で、ソースマップの追加や圧縮などの処理を分ける


### （余計な一言）2022年6月の時点でSass/SCSSについて書くのは抵抗が無い訳で無い、とは表立って言いませんが

以下、余計な一言…で済まない長さですねぇ。

自分、最初は[Bootstrap](https://getbootstrap.com/)でした。  
当時、身近だと[Foundation](https://get.foundation/)勢もおられた記憶です。  
「へぇ、そういうのがあるんだ、PHPやRubyなども様々なフレームワークがあるので、CSSのそれも車輪の再発明しなくていいよね」と、プログラマ視点だと素直にそう思っていました…が…まぁ、当時から色々と色々（意味深）だったと思いますが。

その後、半分以上は趣味の面もありますが、HTMLのテンプレートと共に、CSSフレームワークも忘れた頃に定点観測する様になりました。  
例えば下記、自分は「軽量/lightweight」にこだわっておらず、検索しやすい単語なので使っています。 ^[余計な一言。日本語記述のサイトは見ません。]

- [100+ Best CSS Frameworks For Responsive Design](https://cssauthor.com/css-frameworks/)
- [Lightweight CSS Frameworks - A curated list - DEV Community](https://dev.to/sm0ke/lightweight-css-framework-a-curated-list-4hc3)
- [troxler/awesome-css-frameworks: List of awesome CSS frameworks in 2022](https://github.com/troxler/awesome-css-frameworks)
- [23 Responsive And Lightweight CSS Frameworks](https://www.lambdatest.com/blog/responsive-lightweight-css-frameworks/)

ざっと記憶を振り返り、「おっ」と思ったCSSフレームワークは下記ですね…開発が停滞・ストップしているのも含みますが。  
なお、斜体のそれは、過去、機会を見付けて実践的な使用をしました。

- [*Bourbon*](https://www.bourbon.io/) / [*Neat*](https://neat.bourbon.io/) / [*Bitters*](https://github.com/thoughtbot/bitters) / [*Refills*](http://refills.bourbon.io/)
- [*Milligram*](https://milligram.io/)
- [Skeleton](http://getskeleton.com/)
- [*Materialize*](https://materializecss.com/) ^[入力フォームが前提のHTMLサイトの場合、これを使うのではないかと思います。]
- [*Bulma*](https://bulma.io/)
- [Buldy](https://github.com/johannschopplich/buldy)
- [CodyHouse](https://codyhouse.co/)
- [*Pico.css*](https://picocss.com/) ^[[テストベッド/Eleventy-test-bed](https://github.com/dollplayer2501/Eleventy-test-bed)で使用しましたが、そこで使用した[Basic template](https://picocss.com/examples/basic-template/)レベルでいいんだよ（やや投げやり）と思いましたので、今後、もう少し深く潜ってみる予定です、と言うのも、テストベッドはSass/SCSSのレベルでは触っていないので。おそらく今後はこのCSSフレームワークを第一に考えるのではないかと思います。]
- [Susy](https://www.oddbird.net/susy/) ^[本家サイトデザインが自分好みなのと、本家サイトをEleventyで構築している模様。]

で、自分はCSSフレームワークに何を求めているのか？ですが。  
それ自体の軽さや使いやすさでは無く、Bootstrapで言えば、[Bootsnipp](https://bootsnipp.com/)だと物足りないかな、[Start Bootstrap](https://startbootstrap.com/themes)程度のテンプレートが欲しい、と言うのが、今となっては本音ですね。  
と言うのは、自分はゼロベースでWebサイトデザインができないし、今後はしないと思うので。

とは言いつつ、Bootstrapの次に取り組んだBourbon/Neat/Bitters/Refillsは、Refillsを使いたいから、Bourbon/Neat/Bittersを使える様に勉強した、その過程でSass/SCSSも使える様になった ^[とは言え、ゼロベースでmixinレベルからゴリゴリ書く、では決して無く、各CSSフレームワークに存在するであろう変数ファイルを修正してコンパイルする、程度ですが。] 、になります。 ^[もしもそれが[Less](https://lesscss.org/)や[Stylus](https://stylus-lang.com/)だったとすると、それらに取り組んでいたと思います。]  
ところが現在、BourbonとBitters以外、開発が終了していますので現在は使用していません。  
そしてこの流れだと、CodyHouseが近いかな、なのですが、結局は使っていません。^[今は分かりませんが、初見当時だと、ルビが上手く表示されなかった記憶です。また、無料で使用できるUIコンポーネントだけでも、結構有用かな、という認識です。]

という様な観点からだと、[HTML5 UP!](https://html5up.net/)、自分的にはサイコー！なんですがねぇ…今後はもしかすると厳しいかな、と言うのが本音ですね。  
具体的には、Sass/SCSSは今後、仕様/実装変更が生じても何とかする、という意思はありますが、JavaScript/jQueryに関しては、完全にお手上げ状態になる可能性が高いですね。  
そしてこれがSass/SCSSを使用しているので、自分もそれを使用している、になります。

ところで先述したCSSフレームワークに敢えて含めていないのが、[Tailwind CSS](https://tailwindcss.com/)ですね。

Eleventyで使う場合、[@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)が無ければ、完全に詰んでいたと思います…程度までは潜りました。  
本音で言うと、HTMLのタグのクラスにずらっと記述するのに抵抗があったのは事実です。  
しかしそもそもNunjucksなどでテンプレートを作成すると、それ以降、そんなに修正する事も無いだろうから、そこは了解しました、です。  
ですが、[Prettier](https://prettier.io/)などで半強制的にコード修正される場合はともかく、HTMLはフリーフォーマットで記述しないと ^[HTMLタグの中の`style=""`の記述、クラスやID内で改行できるんだ、と言うか、敢えてそういう記述しないと後日読み返す時、絶対に詰む、でした。] 、後々のメンテナンス可読性がキツくなりそうな気が…という事を考慮すると、Pugでの使用はチョット厳しいかな、です。  
とは言え、今のトコロその可能性は無いですが、Eleventyから[Next.js](https://nextjs.org/)や[Gatsby](https://www.gatsbyjs.com/)に移行した場合、おそらくはTailwind CSSを第一に考えるのではないかと思いますね。
