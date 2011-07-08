require("../../../include/include.js");

var test = forEach_(testValues, function(x) {
    checkBfPass(Bsync.identity(x), x);
    checkBfFail(Bsync.faildentity(x), x);
});
