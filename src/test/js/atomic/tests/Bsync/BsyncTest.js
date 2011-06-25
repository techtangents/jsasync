require("../../include/include.js");

function testIdentity() {
    forEachWithSpy(testValues, function(x, spy) {
        Bsync.identity(x)(spy, explode);
        spy.verifyArgs([[x]]);
    });
}

function testFaildentity() {
    forEachWithSpy(testValues, function(x, spy) {
        Bsync.faildentity(x)(explode, spy);
        spy.verifyArgs([[x]]);
    });
}

function testPass() {
    forEach2WithSpy(testFunctionsFromInt, testInts, function(f, input, spy) {
        var bs = Bsync.bsync(function(a, passCb, failCb) {
            passCb(f(a));
        });
        bs(input)(spy, explode);
        var expected = f(input)
        spy.verifyArgs([[expected]]);
   });
}

function testFail() {
    forEach2WithSpy(testFunctionsFromInt, testInts, function(f, input, spy) {
        var bs = Bsync.bsync(function(a, passCb, failCb) {
            failCb(f(a));
        });
        bs(input)(explode, spy);
        var expected = f(input);
        spy.verifyArgs([[expected]]);
   });
}

function testBsyncConstantFail() {
    forEachWithSpy(testInts, function(input, spy) {
        Bsync.constantFail("no dice")("ignored")(explode, spy);
        spy.verifyArgs([["no dice"]]);
    });
}