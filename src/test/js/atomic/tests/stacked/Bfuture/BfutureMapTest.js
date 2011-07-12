require("../../../include/include.js");

var testParConstants = unitTest(function(Future, Async, Bfuture, Bsync) {
    forEach2WithSpy(testFunctionsFromInt, testInts, function(f, input, spy) {
        checkBfPass(Bfuture.constant(input).map(f), f(input));
    });
});
