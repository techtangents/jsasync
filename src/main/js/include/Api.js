Ephox.core.module.define("techtangents.jsasync.Api", [], function(api) {

    var Library = techtangents.jsasync.glue.Library;

    var stack = function(f) {
        f();
    };

    var bounce = function(f) {
        setTimeout(1, f);
    };

    var Stacked = Library.create(stack);
    var Bounced = Library.create(bounce);

    api.Stacked = Stacked;
    api.Bounced = Bounced;
});
