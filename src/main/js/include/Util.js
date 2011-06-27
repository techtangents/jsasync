Ephox.core.module.define("techtangents.jsasync.Util", [], function(api) {
    function flipUncurried(f) {
        return function(a, b) {
            return f(b, a);
        };
    }

    function wrap(f) {
        return function() {
            f.apply(this, arguments);
        };
    }

    function konst(x) {
        return function(_) {
            return x;
        };
    }

    function arrayMap(a, f) {
        var r = [];
        for (var i = 0; i < a.length; i++) {
            r.push(f(a[i], i, a));
        }
        return r;
    }

    function arrayEach(a, f) {
        for (var i = 0; i < a.length; i++) {
            f(a[i], i, a);
        }
    }

    function composeUncurried(f, g) {
        return function(x) {
            return f(g(x));
        };
    }

    var chainUncurried = flipUncurried(composeUncurried);

    var curry1 = function(f, a) {
        return function(b) {
            return f(a, b);
        };
    };

    function identity(x) {
        return x;
    }

    api.flipUncurried = flipUncurried;
    api.composeUncurried = composeUncurried;
    api.chainUncurried = chainUncurried;

    api.wrap = wrap;
    api.konst = konst;
    api.arrayMap = arrayMap;
    api.arrayEach = arrayEach;
    api.curry1 = curry1;
    api.identity = identity;
});