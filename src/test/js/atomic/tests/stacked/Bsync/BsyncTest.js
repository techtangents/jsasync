require("../../../include/include.js");

var testPass = forEach2WithSpy_(testFunctionsFromInt, testInts, function(f, input, spy) {
    var bs = Bsync.bsync(function(a, passCb, failCb) {
        passCb(f(a));
    });
    bs(input)(spy, explode);
    var expected = f(input)
    spy.verifyArgs([[expected]]);
});

var testFail = forEach2WithSpy_(testFunctionsFromInt, testInts, function(f, input, spy) {
    var bs = Bsync.bsync(function(a, passCb, failCb) {
        failCb(f(a));
    });
    bs(input)(explode, spy);
    var expected = f(input);
    spy.verifyArgs([[expected]]);
});
