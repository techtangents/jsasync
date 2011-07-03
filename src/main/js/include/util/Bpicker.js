Ephox.core.module.define("techtangents.jsasync.util.Bpicker", [], function(api) {
    var pass = function(ifPass, ifFail) {
        return ifPass;
    };

    var fail = function(ifPass, ifFail) {
        return ifFail;
    };

    api.pass = pass;
    api.fail = fail;
});