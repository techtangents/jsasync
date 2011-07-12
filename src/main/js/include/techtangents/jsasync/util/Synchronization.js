Ephox.core.module.define("techtangents.jsasync.util.Synchronization", [], function(api, _private) {

    var noSync = function(lockObj, fn) {
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