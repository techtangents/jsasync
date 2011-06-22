Ephox.core.module.define("techtangents.jsasync.Either", [], function(api, _private) {

    /** data Either g b = Good g | Bad b
     *  A simple sum type of a good/bad value.
     *  Very lightweight - only fold is implemented
     */

    var good = function(g) {
        return {
            fold: function(goodFn, badFn) {
                return goodFn(g);
            }
        };
    };

    var bad = function(b) {
        return {
            fold: function(goodFn, badFn) {
                return badFn(b);
            }
        };
    };

    api.good = good;
    api.bad = bad;
});