Ephox.core.module.define("techtangents.jsasync.glue.Library", [], function(api) {

    var Util = techtangents.jsasync.util.Util;

    var create = function(strategy) {
        var base = techtangents.jsasync.bits;
        var bits = {
            Async: base.Async,
            Future: base.Future,
            Bsync: base.Bsync,
            Bfuture: base.Bfuture
        };

        return Util.objectMap(bits, function(bit) {
            return bit.create(strategy);
        });
    };

    api.create = create;
});