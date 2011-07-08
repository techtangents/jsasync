require("../../../include/include.js");

var test = forEach2WithSpy_(testInts, testFunctionsFromInt, function(input, f, spy) {
    checkBfPass(Bsync.sync(f)(input), f(input));
    checkBfFail(Bsync.syncFail(f)(input), f(input));
});
