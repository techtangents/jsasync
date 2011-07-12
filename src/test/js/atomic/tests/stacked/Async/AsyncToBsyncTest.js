require("../../../include/include.js");

var test = unitTest(function(Future, Async, Bfuture, Bsync) {
    forEach2(testFunctionsFromInt, testInts, function(f, input) {
        var as = Async.sync(f);
        var ex = f(input);
        checkBfPass(as.toPassBsync()(input), ex);
        checkBfFail(as.toFailBsync()(input), ex);
    });
});
