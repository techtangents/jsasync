Ephox.core.module.define("techtangents.jsasync.util.Util", [], function(api) {

    // TODO: should we be using TheDLibrary here?

    var curry0 = function(f) {
        return function(a) {
            return function() {
                return f(a);
            };
        };
    };

    /** curry :: ((a -> b) -> c) -> a -> b -> c */
    var curry = function(f) {
        return function(a) {
            return function(b) {
                return f(a, b);
            };
        };
    };

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

    /** flips arguments 2 and 3 of a 3 arg curried function
     *  flip23 :: (a -> b -> c -> d) -> a -> c -> b -> d
     */
    var flip23 = function(f) {
        return function(a) {
            return function(c) {
                return function(b) {
                    return f(a)(b)(c);
                };
            };
        };
    };

    /** compizzle :: (b -> c) -> a -> (b -> c) -> a -> c */
    var compizzle = flip23(compose);

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

    /** arrayFoldLeft :: [a] -> (a -> b) -> b -> b */
    var arrayFoldLeft = function(array) {
        return function(acc) {
            return function(initial) {
                var cur = initial;
                for (var i = 0; i < array.length; i++) {
                    cur = acc(cur, array[i]);
                }
                return cur;
            }
        }
    };

    var method = function(fnName) {
        return function(x, y) {
            return x[fnName](y);
        };
    };

    var arrayFoldLeftOnMethod = function(fnName) {
        return function(initial) {
            return function(as) {
                // TODO: validate input?
                return arrayFoldLeft(as)(method(fnName))(initial);
            };
        };
    };

    var hasAllProperties = function(o, props) {
        for (var i = 0; i < props.length; i++) {
            if (!o.hasOwnProperty(props[i])) {
                return false;
            }
        }
        return true;
    };

    var global = function() {
        return (function() { return this; })();
    };

    var mapArgs = curry(function(mapper, f) {
        return function() {
            var margs = arrayMap(arguments, mapper);
            return f.apply(this, margs);
        };
    });

    api.global = global;
    api.hasAllProperties = hasAllProperties;

    api.flip = flip;
    api.flipUncurried = flipUncurried;
    api.compose = compose;
    api.compizzle = compizzle;
    api.chain = chain;
    api.wrap = wrap;
    api.konst = konst;

    api.arrayMap = arrayMap;
    api.arrayEach = arrayEach;
    api.arrayFilter = arrayFilter;
    api.arrayFoldLeft = arrayFoldLeft;
    api.arrayFoldLeftOnMethod = arrayFoldLeftOnMethod;

    api.objectEach = objectEach;
    api.objectMap = objectMap;
    api.identity = identity;
    api.chainConst = chainConst;
    api.bounce = bounce;
    api.curry0 = curry0;
    api.curry = curry;
    api.method = method;
    api.mapArgs = mapArgs;
});