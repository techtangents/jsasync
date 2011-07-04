require("../../../include/include.js");

var testSync = forEach2WithSpy_(testInts, testFunctionsFromInt, function(input, f, spy) {
    Bsync.sync(f)(input)(spy, explode);
    spy.verifyArgs([[f(input)]]);
});

var testSyncFail = forEach2WithSpy_(testInts, testFunctionsFromInt, function(input, f, spy) {
    Bsync.syncFail(f)(input)(explode, spy);
    spy.verifyArgs([[f(input)]]);
});
