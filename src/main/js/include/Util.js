Ephox.core.module.define("techtangents.jsasync.Util", [], function(api) {
    function flip(f) {
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

    function compose(f, g) {
        return function(x) {
            return f(g(x));
        };
    }

    var chain = flip(compose);

    var curry1 = function(f, a) {
        return function(b) {
            return f(a, b);
        };
    };

    api.flip = flip;
    api.wrap = wrap;
    api.konst = konst;
    api.arrayMap = arrayMap;
    api.arrayEach = arrayEach;
    api.compose = compose;
    api.chain = chain;
    api.curry1 = curry1;
});