require("../../../include/include.js");

var testFail = forEach_(testValues, function(input) {
    checkBfFail(Bsync.identity.negate()(input), input);
    checkBfFail(Bsync.faildentity.negate().negate()(input), input);

    checkBfPass(Bsync.faildentity.negate()(input), input);
    checkBfPass(Bsync.identity.negate().negate()(input), input);
});
