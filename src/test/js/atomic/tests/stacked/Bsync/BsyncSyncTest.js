require("../../../include/include.js");

var testSync = forEach2WithSpy_(testInts, testFunctionsFromInt, function(input, f, spy) {
    checkBfPass(Bsync.sync(f)(input), f(input));
});

var testSyncFail = forEach2WithSpy_(testInts, testFunctionsFromInt, function(input, f, spy) {
    checkBfFail(Bsync.syncFail(f)(input), f(input));
});
