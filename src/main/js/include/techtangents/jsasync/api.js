Ephox.core.module.define("techtangents.jsasync.api", [], function(api) {

    var Library = techtangents.jsasync.glue.Library;
    var Util = techtangents.jsasync.util.Util;
    var Synchronization = techtangents.jsasync.util.Synchronization

    var mk = function(syncer) {
        return {
            /** Chained calls are invoked via normal call stack. */
            stacked: Library.create(Util.wrap, syncer),

            /** Uses short setTimeouts between calls. */
            bounced: Library.create(Util.bounce, syncer)
        };
    };

    api.browser = mk(Synchronization.noSync);
    api.rhino = mk(Synchronization.rhinoSync);

    api.auto = undefined; // TODO: detect Rhino. if rhino: rhino.stacked, if browser: browser.bounced. Other: browser.stacked.
});
