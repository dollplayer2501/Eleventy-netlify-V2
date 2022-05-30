//
//
//

//
const sprintf = require('sprintf-js')
    .sprintf;
const escape = require('html-escaper')
    .escape;

//

const HEAD_DELIMITER = ' » ';

const URL_WELCOME = '/';
const URL_404 = '/404.html';

const SPRINTF_LENGTH = 12;
const SPRINTF_STRING = '%' + SPRINTF_LENGTH + 's';

//
module.exports = {

    //
    // Browser title settings
    //
    // ブラウザのタイトルの設定
    //
    setHeadTitle: function (collections_order, me, site_name) {
        var ret = site_name;

        // トップページの名称も習得するため、1件目は取得しない
        var tmp = module.exports.getBreadcrumb(collections_order, me);
        for (var i = 1; i < tmp.length; i++) {
            ret += HEAD_DELIMITER + tmp[i].title;
        }

        return ret;
    },

    //
    // List of articles on the top page (Welcome!/Home)
    //   Top page and 404 are excluded
    //
    // トップページ（Welcome!/Home）の記事一覧
    //   トップページと404は除く
    //
    getCollectionsWelcomeMainContents: function (collections_order) {
        var ret = [];

        collections_order.forEach(function (element) {
            if ((URL_WELCOME === element.url) || (URL_404 === element.url)) {
                return;
            }
            if (SPRINTF_LENGTH != element.order_new.length) {
                return;
            }
            ret.push({ 'title': element.title, 'url': element.url });
        });

        return ret;
    },

    //
    // List of latest updated articles on the top page (Welcome!/Home)
    //
    // トップページ（Welcome!/Home）の最新更新記事一覧
    //
    getCollectionsWelcomeRecentUpdated: function (collections_custom_sort, collections_all, count = 3) {
        var ret = [];

        // 必要な項目を必要な件数で取得
        var i = 0;
        collections_custom_sort.some(function (element) {
            if (Number(count) > i++) {
                ret.push({ 'title': element.data.title, 'url': element.url, 'updated': element.data.updated });
            } else {
                return true;
            }
        });

        // データの（トップの）親を取得
        //  親の情報も欲しいので、collections_allが必要
        var tmp = module.exports.setMyCustomOrder(collections_all);
        i = 0;
        ret.forEach(function (element1) {
            tmp.forEach(function (element2) {
                if (element1.url === element2.url) {
                    ret[i++]['order_new'] = element2.order_new;
                }
            });
        });

        // 親の必要なデータを取得
        i = 0;
        ret.forEach(function (element1) {
            var parent_order_new = element1.order_new.substring(0, SPRINTF_LENGTH);
            tmp.some(function (element2) {
                if (parent_order_new === element2.order_new) {
                    ret[i++]['parent'] = { 'url': element2.url, 'title': element2.title };
                    return true;
                }
            });
        });

        // 親と同じ場合、空白を設定
        i = 0;
        ret.forEach(function (element) {
            if (element.url === element.parent.url) {
                ret[i++]['parent'] = { 'url': '', 'title': '' };
            }
        });

        return ret;
    },

    //
    // Related articles, acquisition of related articles (acquisition of subordinate articles)
    //
    // Related articles、関連する記事の取得（配下の記事の取得）
    //
    getCollectionsRelatedArticles: function (collections_order, me) {
        var ret = '';

        // 自身のオーダの取得
        var my_order_new = '';
        collections_order.some(function (element) {
            if (me.url === element.url) {
                my_order_new = element.order_new;
                return true;
            }
        });

        // 自身の親（一番上）の取得
        var parent_order_new = my_order_new.substring(0, SPRINTF_LENGTH);

        // 自身の親の配下の投稿の取得
        var articles = [];
        collections_order.forEach(function (element) {
            if (0 == element.order_new.indexOf(parent_order_new)) {
                articles.push(element);
            }
        });

        // トップと404を弾く
        if (1 == articles.length) {
            return;
        }

        // 自身をマーク
        var i = 0;
        articles.forEach(function (element) {
            articles[i++]['active'] = (element.url === me.url) ? true : false;
        });

        // HTMLのタグを用いた（文字列型）リスト作成

        var _create_anker = function (_obj) {
            var ret = '';

            if (_obj.active) {
                ret = '<span class="active">' + _obj.title + '</span>';
            } else {
                ret = '<a href="' + _obj.url + '">' + _obj.title + '</a>';
            }

            return ret;
        };

        var level_save = '';
        articles.forEach(function (element) {
            if (0 == level_save.length) {
                ret = '<li>' + _create_anker(element);
            } else {
                if (level_save == element.order_new.length / SPRINTF_LENGTH) {
                    ret += '</li>' + '\n' + '<li>' + _create_anker(element);
                } else
                if (level_save < element.order_new.length / SPRINTF_LENGTH) {
                    ret += '\n' + '<ol>' + '\n' + '<li>' + _create_anker(element);
                } else
                if (level_save > element.order_new.length / SPRINTF_LENGTH) {
                    ret += '</li>' + '\n' + '</ol>' + '\n' + '</li>' + '\n' + '<li>' + _create_anker(element);
                }
            }
            level_save = element.order_new.length / SPRINTF_LENGTH;
        });

        for (i = 1; i <= level_save; i++) {
            ret += '</li>' + '\n';
            if (i == level_save) {
                ret += '</ul>';
            } else {
                ret += '</ol>';
            }
        }

        return '<ul>' + ret;
    },

    //
    // Footer article list
    //
    // フッターの記事一覧
    //
    getCollectionsFooter: function (collections_order, me) {
        var ret = [];

        var tmp_order_new = '';
        collections_order.forEach(function (element) {
            // トップレベルの記事の取得
            if (SPRINTF_LENGTH == element.order_new.length) {
                ret.push(element);
            }

            // 自身の独自オーダ取得
            if (me.url === element.url) {
                tmp_order_new = element.order_new;
            }
        });

        // 自身の親（トップレベル）の取得
        var tmp_parennt = tmp_order_new.substring(0, SPRINTF_LENGTH);

        //
        var i = 0;
        ret.forEach(function (element) {
            ret[i++]['active'] = (tmp_parennt == element.order_new) ? true : false;
        });

        return ret;
    },

    //
    // Breadcrumb
    //
    // パンくずリスト
    //
    getBreadcrumb: function (collections_order, me) {
        //
        var _tmp_search = function (_arr, _url) {
            var ret = [];

            _arr.some(function (element) {
                if (element.url === _url) {
                    ret = element;
                    return true;
                }
            });

            return ret;
        };

        var ret = [];

        // 自身の独自オーダ取得
        var tmp_order_new = _tmp_search(collections_order, me.url);

        // トップの取得
        var top = _tmp_search(collections_order, URL_WELCOME);
        ret.push({ 'title': top.title, 'url': top.url });

        // トップ以下の取得
        for (var i = 1; i <= tmp_order_new.order_new.length / SPRINTF_LENGTH; i++) {
            var tmp = tmp_order_new.order_new.substring(0, SPRINTF_LENGTH * i);
            collections_order.some(function (element) {
                if (element.order_new === tmp) {
                    ret.push({ 'title': element.title, 'url': element.url });
                    return true;
                }
            });
        }

        return ret;
    },

    //
    // Filter to sort Eleventy's Collections.all in their own sort order
    //
    // EleventyのCollections.allを独自のソート順に並べ替えるためのフィルタ
    //
    setMyCustomOrder: function (collections_all) {
        //
        var _tmp_search = function (_arr, _url) {
            var ret = [];

            _arr.some(function (element) {
                if (element.url === _url) {
                    ret = element;
                    return true;
                }
            });

            return ret;
        };

        var ret = [];

        // 必要な要素の抽出と選択
        collections_all.forEach(function (element) {
            if (element.url) {
                ret.push({ 'url': element.url, 'order_original': element.data.order, 'title': escape(element.data.title) })
            }
        });

        // ソートオーダーの統一化
        var i = 0;
        ret.forEach(function (element1) {
            var tmp_order = '';
            if ((URL_WELCOME === element1.url) || (URL_404 === element1.url)) {
                tmp_order += sprintf(SPRINTF_STRING, element1.order_original);
            } else {
                // URLを戦闘から区切り、それぞれのソートオーダーをつなぎ合わせる
                var tmp_url = '/';
                element1.url.split('/')
                    .forEach(function (element2) {
                        if (0 != element2.length) {
                            tmp_url += element2 + '/';
                            var tmp = _tmp_search(ret, tmp_url);
                            tmp_order += sprintf(SPRINTF_STRING, tmp.order_original);
                        }
                    });
            }
            ret[i++]['order_new'] = tmp_order;
        });

        ret.sort(function (a, b) {
            if (a.order_new < b.order_new) return -1;
            if (a.order_new > b.order_new) return 1;
            return 0;
        });

        return ret;
    },
};
