Ephox.core.module.define("techtangents.jsasync.Util", [], function(api) {
    function flip(f) {
        return function(a, b) {
            return f(b, a);
        };
    };

    function wrap(f) {
        return function() {
            f.apply(this, arguments);
        };
    };

    api.flip = flip;
    api.wrap = wrap;
});