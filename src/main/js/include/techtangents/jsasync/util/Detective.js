Ephox.core.module.define("techtangents.jsasync.util.Detective", [], function(api, _private) {

    var Util = techtangents.jsasync.util.Util;

    // "browser" | "rhino"
    var detect = function() {
        var g = Util.global();
        var isRhino = Util.hasAllProperties(g, ["java", "sync", "Packages", "importClass", "importPackage"]);
        var isBrowser = Util.hasAllProperties(g, ["window", "document"]);
        return isRhino ? "rhino" : isBrowser ? "browser" : "other";
    };

    api.detect = detect;
});