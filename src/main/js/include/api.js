Ephox.core.module.define("techtangents.jsasync.api", [], function(api) {

    var Library = techtangents.jsasync.glue.Library;
    var Util = techtangents.jsasync.util.Util;

    api.stacked = Library.create(Util.wrap);
    api.bounced = Library.create(Util.bounce);
});
