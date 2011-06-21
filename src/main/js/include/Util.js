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

    api.flip = flip;
    api.wrap = wrap;
    api.konst = konst;
});