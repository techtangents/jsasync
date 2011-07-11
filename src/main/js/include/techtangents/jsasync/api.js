Ephox.core.module.define("techtangents.jsasync.api", [], function(api) {

    var Library = techtangents.jsasync.glue.Library;
    var Util = techtangents.jsasync.util.Util;

    api.stacked = {};
    api.bounced = {};

    // TODO sideways

    var rhinoSync = function(f) {
        return Util.wrap(sync(f));
    };

    var noSync = Util.wrap;

    api.browser = {
        /** Chained calls are invoked via normal call stack. */
        stacked: Library.create(Util.wrap, noSync),

        /** Uses short setTimeouts between calls. */
        bounced: Library.create(Util.bounce, noSync)
    };

    /** The 'rhino' variants use Rhino's 'sync' function to synchronize shared state when
     *  managing concurrent async calls in Async.amap and Bsync.amap
     */
    api.rhino = {
        /** Chained calls are invoked via normal call stack. */
        stacked: Library.create(Util.wrap, rhinoSync),

        /** Uses short setTimeouts between calls. Only works if there's a setTimeout implementation. */
        bounced: Library.create(Util.bounce, rhinoSync)
    };

    api.auto = undefined; // TODO: detect Rhino. if rhino: rhino.stacked, if browser: browser.bounced. Other: browser.stacked.
});
