require("../../../include/include.js");

var testPass = forEach2WithSpy_(testFunctionsFromInt, testInts, function(f, input, spy) {
    var bs = Bsync.bsync(function(a, passCb, failCb) {
        passCb(f(a));
    });
    checkBfPass(bs(input), f(input));
});

var testFail = forEach2WithSpy_(testFunctionsFromInt, testInts, function(f, input, spy) {
    var bs = Bsync.bsync(function(a, passCb, failCb) {
        failCb(f(a));
    });
    checkBfFail(bs(input), f(input));
});
