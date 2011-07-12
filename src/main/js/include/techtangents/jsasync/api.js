Ephox.core.module.define("techtangents.jsasync.api", [], function(api) {

    var Library         = techtangents.jsasync.glue.Library;
    var Util            = techtangents.jsasync.util.Util;
    var Synchronization = techtangents.jsasync.util.Synchronization;
    var Detective       = techtangents.jsasync.util.Detective;

    var browser = Library.create(Synchronization.noSync);
    var rhino = Library.create(Synchronization.rhinoSync);

    var platform = Detective.detect();
    var auto = platform === "rhino" ? rhino.stacked : platform === "browser" ? browser.bounced : browser.stacked;

    api.browser = browser;
    api.rhino   = rhino;
    api.auto    = auto;
});
