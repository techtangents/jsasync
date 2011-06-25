require("../../include/include.js");

var testIdentity = forEachWithSpy_(testValues, function(x, spy) {
    Bsync.identity(x)(spy, explode);
    spy.verifyArgs([[x]]);
});

var testFaildentity = forEachWithSpy_(testValues, function(x, spy) {
    Bsync.faildentity(x)(explode, spy);
    spy.verifyArgs([[x]]);
});

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

var testBsyncConstantFail = forEachWithSpy_(testInts, function(input, spy) {
    Bsync.constantFail("no dice")("ignored")(explode, spy);
    spy.verifyArgs([["no dice"]]);
});