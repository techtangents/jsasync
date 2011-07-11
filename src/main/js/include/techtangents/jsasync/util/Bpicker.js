Ephox.core.module.define("techtangents.jsasync.util.Bpicker", [], function(api) {
    var pass = function(ifPass, _) {
        return ifPass;
    };

    var fail = function(_, ifFail) {
        return ifFail;
    };

    api.pass = pass;
    api.fail = fail;
});