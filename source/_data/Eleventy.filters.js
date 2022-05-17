//
//
//

//

const HEAD_DELIMITER = ' » ';
const ROOT_TAG = 'root';

const URL_WELCOME = '/';
const URL_404 = '/404.html';

const KIND_WELCOME = 'welcome';
const KIND_LIST = 'list';
const KIND_ARTICLE = 'article';

//
module.exports = {

    //
    // ブラウザのタイトルの設定
    //
    setHeadTitle: function (collections, me, site_name) {
        var ret = site_name;

        var tmp = _getBreadcrumb(collections, me);
        if (URL_WELCOME === me.url) {
            ret += HEAD_DELIMITER + tmp[0].title;
        } else {
            for (var i = 1; i < tmp.length; i++) {
                ret += HEAD_DELIMITER + tmp[i].title;
            }
        }

        return ret;
    },

    //
    // トップページ（Welcome!/Home）の記事一覧
    //   トップページと404は除く
    //
    getCollectionsWelcome: function (collections) {
        var ret = [];

        var tmp = _get_collections_from_root(collections);
        tmp.forEach(function (element) {
            if ((URL_WELCOME !== element.url) && (URL_404 !== element.url)) {
                ret.push({ 'title': element.title, 'url': element.url });
            }
        });

        return ret;
    },

    //
    // 自身の「直下」の記事一覧
    //
    getCollectionsDownLevel: function (collections, me) {
        var ret = [];

        var my_level = _get_my_level(me.url);

        var me_url = me.url.toString();
        collections.forEach(function (element) {
            var url = element.url.toString();
            // その配下以外を弾く
            if (url.indexOf(me_url)) {
                return;
            }
            // 自分を弾く
            if (url.length == me_url.length) {
                return;
            }
            // トップと404を弾く
            if ((URL_WELCOME === element.url) && (URL_404 === element.url)) {
                return;
            }
            // 配下のレベルより深いレベルを弾く
            if (my_level + 1 != _get_my_level(element.url)) {
                return;
            }
            ret.push({ 'title': element.data.title, 'url': element.url });
        });

        return ret;
    },

    //
    // 自身と「同一レベル」の記事一覧
    //
    getCollectionsSameLevel: function (collections, me) {
        var ret = [];

        // トップレベルは弾く
        var parent = _getParentFromChild(collections, me);
        if (0 == parent.url.length) {
            return ret;
        }

        collections.forEach(function (element) {
            var url = element.url.toString();
            // 親のURLを含まないのを弾く
            if (0 != url.indexOf(parent.url)) {
                return;
            }
            // 自身と同じレベル以外を弾く
            if (_get_my_level(me.url) != _get_my_level(url)) {
                return;
            }
            ret.push({ 'title': element.data.title, 'url': element.url });
        });
        _seek_and_check(ret, me.url);

        return ret;
    },

    //
    // 自身の一つ上の親を取得
    //
    getParentFromChild: function (collections, me) {
        return _getParentFromChild(collections, me);
    },

    //
    // フッターの一覧
    //
    getCollectionsFooter: function (collections, me, kind) {
        var ret = [];

        ret = _get_collections_from_root(collections);

        if (KIND_WELCOME === kind.toLowerCase()) {
            //
            // トップ
            //
            _seek_and_check(ret, me.url)
        } else
        if (KIND_LIST === kind.toLowerCase()) {
            //
            // リスト
            //
            var flg = _seek_and_check(ret, me.url);
            if (!flg) {
                var parent = _getParentFromChild(collections, me);
                while (true) {
                    flg = _seek_and_check(ret, parent.url);
                    if (flg) {
                        break;
                    }
                    parent = _getParentFromChild(collections, parent);
                }
            }
        } else
        if (KIND_ARTICLE === kind.toLowerCase()) {
            //
            // 記事
            //
            var flg = _seek_and_check(ret, me.url);
            if (!flg) {
                var parent = _getParentFromChild(collections, me);
                while (true) {
                    flg = _seek_and_check(ret, parent.url);
                    if (flg) {
                        break;
                    }
                    parent = _getParentFromChild(collections, parent);
                }
            }
        }

        return ret;
    },

    //
    // パンくずリスト
    //
    getBreadcrumb: function (collections, me) {
        return _getBreadcrumb(collections, me);
    },
};

//
//
//

//

function _get_collections_from_root(_collections) {
    var ret = [];

    _collections.forEach(function (element) {
        if (!element.url) {
            return;
        }

        var tags = element.data.tags;
        var flg = false;
        tags.forEach(function (tag) {
            if (ROOT_TAG === tag) {
                flg = true;
                return;
            }
        });
        if (!flg) {
            return;
        }

        ret.push({ 'title': element.data.title, 'url': element.url });
    });

    return ret;
}

//

function _seek_and_check(_list, _url) {
    var flg = false;

    var i = 0;
    _list.forEach(function (element) {
        if (element.url === _url) {
            _list[i]['active'] = true;
            flg = true;
        } else {
            _list[i]['active'] = false;
        }
        i++;
    });

    return flg;
}

//

function _get_my_level(_url) {
    var level = 0;

    var tmp = _url.split('/');
    tmp.forEach(function (element) {
        if (0 < element.length) {
            level++;
        }
    });

    return level;
}

//
//
//

//

function _getParentFromChild(_collections, _me) {
    var ret = { 'title': '', 'url': '' }

    var me_url = _me.url.toString();
    var tmp = me_url.split('/');
    if (3 >= tmp.length) {
        return ret;
    }

    var parent_url = '';
    for (var i = 0; i <= tmp.length - 3; i++) {
        if (0 == tmp[i].length) {
            continue;
        }
        parent_url += '/' + tmp[i];
    }
    parent_url += '/';

    _collections.forEach(function (element) {
        var url = element.url.toString();
        if (url === parent_url) {
            ret = { 'title': element.data.title, 'url': element.url };
            return;
        }
    });

    return ret;
}

//

function _getBreadcrumb(_collections, _me) {
    var ret = [];

    var tmp1 = _me.url.split('/');
    var breadObj = [URL_WELCOME];
    var tmp2 = '/';
    tmp1.forEach(function (element) {
        if (0 < element.length) {
            tmp2 += element + (URL_404 === _me.url ? '' : '/');
            breadObj.push(tmp2);
        }
    });

    breadObj.forEach(function (element1) {
        _collections.forEach(function (element2) {
            if (element1 === element2.url) {
                ret.push({ 'title': element2.data.title, 'url': element1 });
                return;
            }
        });
    });
    _seek_and_check(ret, _me.url)

    return ret;
}

//
