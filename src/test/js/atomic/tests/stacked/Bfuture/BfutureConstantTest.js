require("../../../include/include.js");

var test = unitTest(function(Future, Async, Bfuture, Bsync) {
    forEach_(testInts, function(input) {
        checkBfPass(Bfuture.constant(input), input);
        checkBfFail(Bfuture.constantFail(input), input);
    });
});
