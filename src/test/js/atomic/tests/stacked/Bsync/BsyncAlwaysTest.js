require("../../../include/include.js");

var test = unitTest(function(Future, Async, Bfuture, Bsync) {

    var queck = function(f, input) {
        return function(bs) {
            f(bs(input), input);
        };
    };

    forEach(testValues, function(input) {
        var check = queck(checkBfPass, input);

        check(Bsync.identity.alwaysPass());
        check(Bsync.constant(input).alwaysPass());
        check(Bsync.identity[">>>"](Bsync.constant(input)).alwaysPass());
        check(Bsync.identity[">>>"](Bsync.constant(input).alwaysPass()));
        check(Bsync.constantFail(input).alwaysPass());
        check(Bsync.faildentity.alwaysPass());
    });

    forEach(testValues, function(input) {
        var check = queck(checkBfFail, input);

        check(Bsync.identity.alwaysFail());
        check(Bsync.constant(input).alwaysFail());
        check(Bsync.identity[">>>"](Bsync.constant(input)).alwaysFail());
        check(Bsync.identity[">>>"](Bsync.constant(input).alwaysFail()));
        check(Bsync.constantFail(input).alwaysFail());
        check(Bsync.faildentity.alwaysFail());
    });
});