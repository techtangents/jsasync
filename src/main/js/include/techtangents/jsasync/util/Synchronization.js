Ephox.core.module.define("techtangents.jsasync.util.Synchronization", [], function(api, _private) {

    var Util = techtangents.jsasync.util.Util;

    var noSync = function(_, fn) {
        return Util.wrap(fn);
    };

    var rhinoSync = function(lockObj, f) {
        var sf = sync(f);
        return function() {
            return sf.apply(lockObj, arguments);
        };
    };

    api.noSync = noSync;
    api.rhinoSync = rhinoSync;
});