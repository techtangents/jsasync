Ephox.core.module.define("techtangents.jsasync.util.Util", [], function(api) {

    // TODO: should we be using TheDLibrary here?

    /** flip :: (a -> b -> c) -> b -> a -> c */
    var flip = function(f) {
        return function(a) {
            return function(b) {
                return f(b)(a);
            };
        };
    };

    /** flipUncurried :: ((a, b) -> c) -> ((b, a) -> c) */
    var flipUncurried = function(f) {
        return function(a, b) {
            return f(b, a);
        };
    };

    /** wrap :: function -> function */
    function wrap(f) {
        return function() {
            return f.apply(this, arguments);
        };
    }

    /** konst :: a -> b -> a */
    var konst = function(x) {
        return function(_) {
            return x;
        };
    };

    /** arrayMap :: ([a], a -> b) -> [b] */
    var arrayMap = function(a, f) {
        var r = [];
        for (var i = 0; i < a.length; i++) {
            r.push(f(a[i], i, a));
        }
        return r;
    };

    /** arrayEach :: ([a], a -> ()) -> () */
    var arrayEach = function(a, f) {
        for (var i = 0; i < a.length; i++) {
            f(a[i], i, a);
        }
    };

    /** arrayFilter :: ([a], (a -> Boolean)) -> [a] */
    var arrayFilter = function(as, p) {
        var r = [];
        arrayEach(as, function(a) {
            if (p(a)) {
                r.push(a);
            }
        });
        return r;
    };

    var objectEach = function(o, f) {
        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                f(o[i], i, o);
            }
        }
    };

    var objectMap = function(o, f) {
        var r = {};
        objectEach(o, function(x, i) {
            r[i] = f(x, i, o);
        });
        return r;
    };

    /** compose :: (b -> c) -> (a -> b) -> a -> c */
    var compose = function(f) {
        return function(g) {
            return function(x) {
                return f(g(x));
            };
        };
    };

    /** chain :: (a -> b) -> (b -> c) -> a -> c */
    var chain = flip(compose);

    /** identity :: a -> a */
    var identity = function(x) {
        return x;
    };

    /** chainConst :: ((b -> a) -> c) -> a -> c */
    var chainConst = chain(konst);

    var bounce = function(f) {
        return function() {
            var thisArg = this;
            var args = arguments;
            setTimeout(function() {
                f.apply(thisArg, args);
            }, 1);
        };
    };

    var curry0 = function(f) {
        return function(a) {
            return function() {
                return f(a);
            };
        };
    };

    // TODO type sig
    var arrayFoldLeft = function arrayFoldLeft(array, acc, initial) {
        var cur = initial;
        for (var i = 0; i < array.length; i++) {
            cur = acc(cur, array[i]);
        }
        return cur;
    };

    var method = function(fnName) {
        return function(x, y) {
            return x[fnName](y);
        };
    };

    api.flip = flip;
    api.flipUncurried = flipUncurried;
    api.compose = compose;
    api.chain = chain;
    api.wrap = wrap;
    api.konst = konst;

    api.arrayMap = arrayMap;
    api.arrayEach = arrayEach;
    api.arrayFilter = arrayFilter;
    api.arrayFoldLeft = arrayFoldLeft

    api.objectEach = objectEach;
    api.objectMap = objectMap;
    api.identity = identity;
    api.chainConst = chainConst;
    api.bounce = bounce;
    api.curry0 = curry0;
    api.method = method;
});