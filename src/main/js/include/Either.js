Ephox.core.module.define("techtangents.jsasync.Either", [], function(api, _private) {

    /** data Either g b = Good g | Bad b
     *  A simple sum type of a good/bad value.
     *  Very lightweight - only fold is implemented
     */

    var good = function good(g) {
        return {
            fold: function(goodFn, _) {
                return goodFn(g);
            },
            map: function(mapper) {
                return good(mapper(g));
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
            }
        };
    };

    var foldOn = function(passFn, failFn) {
        return function(either) {
            return either.fold(passFn, failFn);
        };
    };

    api.good = good;
    api.bad = bad;
    api.foldOn = foldOn;
});