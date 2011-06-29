Ephox.core.module.define("techtangents.jsasync.Either", [], function(api, _private) {

    /** data Either g b = Good g | Bad b
     *  A simple sum type of a good/bad value.
     */

    var Util = techtangents.jsasync.Util;

    var good = function good(g) {
        return {
            fold: function(goodFn, _) {
                return goodFn(g);
            },
            map: function(mapper) {
                return good(mapper(g));
            },
            isGood : Util.konst(true)
        };
    };

    var bad = function bad(b) {
        return {
            fold: function(_, badFn) {
                return badFn(b);
            },
            map: function(_) {
                return bad(b);
            },
            isGood : Util.konst(false)
        };
    };

    var foldOn = function(passFn, failFn) {
        return function(either) {
            return either.fold(passFn, failFn);
        };
    };

    /** goods :: [Either good bad] -> [good] */
    var goods = function(es) {
        return Util.arrayFilter(es, function(e) {
            return e.isGood();
        });
    };

    api.good = good;
    api.bad = bad;
    api.foldOn = foldOn;
    api.goods = goods;
});