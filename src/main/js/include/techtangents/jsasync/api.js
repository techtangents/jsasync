Ephox.core.module.define("techtangents.jsasync.api", [], function(api) {

    var j               = techtangents.jsasync;
    var Library         = j.glue.Library;
    var Util            = j.util.Util;
    var Synchronization = j.util.Synchronization;
    var Detective       = j.util.Detective;

    var browser = Library.create(Synchronization.noSync);
    var rhino = Library.create(Synchronization.rhinoSync);

    var platform = Detective.detect();
    var auto = platform === "rhino" ? rhino.stacked : platform === "browser" ? browser.bounced : browser.stacked;

    api.browser = browser;
    api.rhino   = rhino;
    api.auto    = auto;
});
