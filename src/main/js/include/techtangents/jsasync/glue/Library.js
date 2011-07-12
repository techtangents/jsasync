Ephox.core.module.define("techtangents.jsasync.glue.Library", [], function(api) {

    var Util = techtangents.jsasync.util.Util;

    var createHalf = function(executor, synchronizer) {
        var base = techtangents.jsasync.bits;
        var bits = {
            Async: base.Async,
            Future: base.Future,
            Bsync: base.Bsync,
            Bfuture: base.Bfuture
        };

        return Util.objectMap(bits, function(bit) {
            return bit.create(executor, synchronizer);
        });
    };

    var create = function(syncer) {
        return {
            /** Chained calls are invoked via normal call stack. */
            stacked: createHalf(Util.wrap, syncer),

            /** Uses short setTimeouts between calls. */
            bounced: createHalf(Util.bounce, syncer)
        };
    };

    api.create = create;
});
