require("../../../include/include.js");

var test = forEach_(testInts, function(input) {
    checkBfPass(Bfuture.constant(input), input);
    checkBfFail(Bfuture.constantFail(input), input);
});
