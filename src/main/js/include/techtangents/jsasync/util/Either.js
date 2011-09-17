Ephox.core.module.define("techtangents.jsasync.util.Either", [], function(api, _private) {

    /** data Either g b = Good g | Bad b
     *  A simple sum type of a good/bad value.
     */

    var Util = techtangents.jsasync.util.Util;

    var good = function good(g) {
        return {
            fold: function(goodFn, _) {
                return goodFn(g);
            },
            map: function(mapper) {
                return good(mapper(g));
            },
            isGood : Util.konst(true),
            isBad  : Util.konst(false),
            goodOrDie: Util.konst(g),
            badOrDie: function() {
                throw "badOrDie called on Either.good";
            },
            each: function(f) {
                f(g);
            }
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
            isGood: Util.konst(false),
            isBad : Util.konst(true),
            goodOrDie: function() {
                throw "goodOrDie called on Either.bad"
            },
            badOrDie: Util.konst(b),
            each: Util.noop
        };
    };

    var foldOn = function(passFn, failFn) {
        return function(either) {
            return either.fold(passFn, failFn);
        };
    };

    var split = function(filter, getter) {
        return function(es) {
            return Util.arrayMap(Util.arrayFilter(es, filter), getter);
        };
    };

    /** goods :: [Either good bad] -> [good] */
    var goods = split(
        function(e) { return e.isGood();    },
        function(e) { return e.goodOrDie(); }
    );

    /** bads :: [Either good bad] -> [bad] */
    var bads = split(
        function(e) { return e.isBad();    },
        function(e) { return e.badOrDie(); }
    );

    api.good = good;
    api.bad = bad;
    api.foldOn = foldOn;
    api.goods = goods;
    api.bads = bads;
});