require("../../../include/include.js");

var testPass = forEach_(testValues, function(input) {
    var check = function(bs) {
        checkBfPass(bs(input), input);
    };

    check(Bsync.identity.alwaysPass());
    check(Bsync.constant(input).alwaysPass());
    check(Bsync.identity[">>>"](Bsync.constant(input)).alwaysPass());
    check(Bsync.identity[">>>"](Bsync.constant(input).alwaysPass()));
    check(Bsync.constantFail(input).alwaysPass());
    check(Bsync.faildentity.alwaysPass());
});

var testFail = forEach_(testValues, function(input) {
    var check = function(bs) {
        checkBfFail(bs(input), input);
    };

    check(Bsync.identity.alwaysFail());
    check(Bsync.constant(input).alwaysFail());
    check(Bsync.identity[">>>"](Bsync.constant(input)).alwaysFail());
    check(Bsync.identity[">>>"](Bsync.constant(input).alwaysFail()));
    check(Bsync.constantFail(input).alwaysFail());
    check(Bsync.faildentity.alwaysFail());
});