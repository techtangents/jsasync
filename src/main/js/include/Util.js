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

    function identity(x) {
        return x;
    }

    function identity_(x) {
        return function() {
            return identity(x);
        };
    }

    api.flip = flip;
    api.wrap = wrap;
    api.identity = identity;
});