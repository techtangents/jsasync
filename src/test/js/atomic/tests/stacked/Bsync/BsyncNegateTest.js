require("../../../include/include.js");

var testFail = forEach_(testValues, function(input) {
    var check = function(bs) {
        var spy = jssert.spy();
        bs(input)(explode, spy);
        spy.verifyArgs([[input]]);
    };

    check(Bsync.identity.negate());
    check(Bsync.faildentity.negate().negate());
});
