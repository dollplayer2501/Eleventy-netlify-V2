---
title: 2022年5月から6月にかけて、このサイトをほぼ完全リニューアルした件
order: 01
permalink: /backstage/01/index.html
layout: list.njk
date: 2022-06-10
updated: 2022-06-10
tags:
  - backstage
---

今が2022年6月上旬で、ほぼ1年前、このサイトを立ち上げました。  
それ以前のWordPressで実装していた3rd.から5年以上を経ての再起になります。  
仮にその時点を4th.のver.1/初代、現時点がver.2/二代目、だとすると、その他諸々、ソースコードやサイトURLは下記になります。


4th. ver.1/初代
:   Public Archive済み  
[dollplayer2501/dollplayer2501-eleventy-netlify](https://github.com/dollplayer2501/dollplayer2501-eleventy-netlify)

4th. ver.2/二代目
:   現在の稼働ソースコード  
[dollplayer2501/Eleventy-netlify-V2: Eleventy with Laravel Mix, Gulp](https://github.com/dollplayer2501/Eleventy-netlify-V2)

テストベンチ/テストベッド
:   4th. ver.2を元に、不要な実装を取り去ったバージョン  
一応、Elevenのスタータキット、スケルトン扱い…  
[Source Code Samples — Eleventy](https://www.11ty.dev/docs/samples/)に登録済み  
ソースコード：[dollplayer2501/Eleventy-test-bed: This is a test bench for me to see the features of Eleventy.](https://github.com/dollplayer2501/Eleventy-test-bed)  
サイトURL：[Eleventy test bed » Home](https://eleventy-test-bed-dollplayer2501.netlify.app/)

自分の名刺に記載しているURL（ポータルサイト的な）
:   1ページしか無いので当初、Gulp関連で実装していたが、結局Eleventyにした  
Netlifyにて、自前のドメイン…サブドメインの割り当てとLet’s EncryptによるHTTPS化済み  
ソースコード：[dollplayer2501/project2501-v2: @dollplayer2501's portal site](https://github.com/dollplayer2501/project2501-v2)  
サイトURL：project2501として、[project2501.duelist.org](https://project2501.duelist.org/)、[project2501.netlify.app](https://project2501.netlify.app)のいずれでもアクセス可能


この4th. ver.2/二代目への移行ですが、至極個人的な理由がありました。  
（なお、何故4th.なのかは「[わたしはだぁれ](/who_am_i/)」を参照）


[[toc]]


### 初代の挫折


4th.初代は、画面レイアウトをあるCSSフレームワークを元に、ゼロベースでHTML+CSS…Sass/SCSSのスケルトンから構築したのですが、運用後のちょとした変更に耐えられずそれ以上の更新を諦めたという、自分の完全なスキル不足にあります。  
（4th.初代で使用したCSSフレームワークのせいでは**決して**無く、自分のCSSの書き方がマズかった、という事は敢えて明記しておきますね）  
このため、4th.二代目では、提供元が示すテンプレートをベースにして、行間など細かな調整はしない、目をつぶる方針で行く、が大前提の一つにありました。

そして、それを前提に、自分の中で究極まで推し進めたのが、このサイトのエッセンス…と言うと大袈裟ですが、それらを抽出したのが前述のテストベンチ/テストベッドになります。  
以前の自分だと、このレイアウトはとても看破できなかったですが、そこを敢えて抑えています。


### ある種の原点回帰


大本のHTMLテンプレートを大幅に修正する事無く、となると、個人的には「親の顔より見た」[HTML5 UP!](https://html5up.net/)になる訳です。  
しかし多少残念な事に、昨今のSCSS/Sassコンパイルに追随していない状態、具体的には`global`や割り算の扱いは利用者であるこちら側で対応する必要がありました。  
それらの対応は一応はこちらでしましたが、果たして不具合を引き起こさないのか、自信はありません。  
また、今後の事を憂慮すると、非常に由々しき事態には違いありませんので、本家側で何とかして、が本音ですが、ここはやはり利用者側で何とかする、のが道理でしょうねぇ…[開発者様](https://github.com/ajlkn)がGitHubで展開されておられれば、もう少し違った展開も期待できたのですが。


### タスクランナー


4th.二代目に関してはもう一つ、タスクランナー…Gulpからの脱却です。  
タスクランナー…Gulpは時代遅れと言うと大変失礼ですが、気分的にはそういう感じです。^[Gulp全盛の頃からこのトレンドはあったと記憶しています。]

ですが、今回も利用しています。

現在、Eleventy、Gulp、Larabel Mixを利用しています。  
増えてますね…言ってる事とやっている事が矛盾していますね。  
理由ですが、適所適材で役割を分担しているからです。

- Eleventyはコンテンツ生成とブラウザ確認
- Gulpは画像圧縮
- Larabel MixはSass/SCSSとJavaScriptコンパイル（当初は単純ファイルコピーも行なっていたが、現在はEleventyの[Passthrough File Copy](https://www.11ty.dev/docs/copy/)を使用）

画像圧縮はEleventyのプラグイン、[eleventy-img](https://www.11ty.dev/docs/plugins/image/)でできますが、仕様が圧巻過ぎ、自分のスキル不足のため利用を見送りました。  
同様にLaravel Mixを使わなかったのは、自分が画像圧縮のトレンドがよく分からない、というのがあります。  
以前は[gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin)などを利用していたと認識していますが、バージョンアップすると不具合が出るので利用を回避した結果、[gulp-libsquoosh](https://www.npmjs.com/package/gulp-libsquoosh)に辿り着き、自分のスキルだとGulpで動かす事ができたのでそれを利用している状態です。

逆にSass/SCSSコンパイルはGulpでなくLarabel Mixだと割とすんなり動いたので使用している、になります…が、[eleventy-sass](https://www.npmjs.com/package/eleventy-sass)に乗り換える可能性があります。  
と言うのは、自身のポータルサイト/project2501では、このプラグインを試しに使用、特に問題が無い状態です。^[実はあまり利用に前向きでなく、理由は、本家のプラグインでないので、今後、継続的にメンテナンスされるか不安なので。]  
なおこの場合だと、Larabel Mixは不要になりますね。

ちなみに画像ファイルのディレクトリに関して。  
コンテンツの記述・作成時はディレクトリを区分けしていますが ^[現在コンテンツで画像を使用していませんが、今後はこの方針で。] 、最終成果物の生成ではその区分けをせず、一律、サイトトップの`./images`ディレクトリに突っ込んでいます。  
これは、この方が記述が楽である、と同時に、自動生成される成果物は管理の範囲外、では無いですが、人間側で細かく管理する必要は無い、という方針です。


### npmスクリプト


当初、Eleventy、Gulp、Larabel Mixをどうやって連動させるのか、分かりませんでした。  
結論を言うと、「npmスクリプト…`./package.json`のscriptsにターミナルで叩くコマンドを書く、起動の制御は[npm-run-all](https://www.npmjs.com/package/npm-run-all)で制御する」が、回答になりますが。

今にして思えば、ですが、タスクランナーの初見であったGulpを学習し始めた頃、コンソールから`npx gulp hohe`の様に叩くのが一般的だったと思います。  
このため、npmスクリプトを完全に意識しない、させない弊害、と言うと大変失礼ですが、そういう気分ですし、当初からタスクランナーを利用しない事を言っていた方々の意味がようやく分かった気がします。^[ですが、さすがに自分にはnpmパッケージを素のままで使うという割り切りはできず、タスクランナーを噛ませて使う事にしました。]

および自分の中で、全てをある一つのタスクランナーの中で完結させない、無理っぽいなら諦める、というのも方針の一つかな、と思います。  
ただこの場合、微妙に不具合…具体的にはブラウザの自動リロードの制御が実質できなくなる、という弊害もあるのはありますが、軽微なので無視しています。^[Eleventyの[Watch and Serve](https://www.11ty.dev/docs/watch-serve/)の機能を使えば回避できるかもしれませんが、現状、何ともです。]  
トレンドの移り変わりが激しいフロントエンド界隈ですからね、トレンド・不具合・あるプロダクトの仕様変更が他のプロダクトに引き起こす影響 ^[少し前、Sass/SCSSの仕様変更がタスクランナーなどに与えた影響は結構大きかった様な…今は仕様がfixしたのか、落ち着いてる気がしますし、Gulpもメジャーバージョンアップで色々と修正が生じた気がします。] 、などの状況によっては乗り換えを前提とする、みたいな。


### ステップ・バイ・ステップによるアプローチ


今、改めて自分のMBP/MacBook Proのソースコードのガラクタ置き場を見ると、ここに辿り着くまで、改めてのEleventy、初見のLaravel Mix、画像処理関係のGulp、結局は採用を見送ったTailwind CSSなどで何十ものトライ（&amp;エラー）を繰り返してるなぁと。  
ヨシ！ここまではできた、これをファイルコピーして ^[一つ前の世代は`rm -rf ./node_modules`などして] 、次はこの機能を盛り込もう、よしできた・アカンダメだった、を繰り返した結果の今というのを実感しますね、いや、してませんかね。  
これらは消してもいいのですが、二度と見る事は無いと思いますが、記念に残しておこうかと思います。
