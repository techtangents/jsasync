require("../../include/include.js");

function testIdentity() {
    testValues.forEach(function(x) {
        var spy = jssert.spy();
        Bsync.identity(x)(spy, explode);
        spy.verifyArgs([[x]]);
    });
}

function testFaildentity() {
    testValues.forEach(function(x) {
        var spy = jssert.spy();
        Bsync.faildentity(x)(explode, spy);
        spy.verifyArgs([[x]]);
    });
}

function testPass() {
    testFunctionsFromInt.forEach(function(f) {
        testInts.forEach(function(input) {
            var bs = Bsync.bsync(function(a, passCb, failCb) {
                passCb(f(a));
            });
            var spy = jssert.spy();
            bs(input)(spy, explode);
            var expected = f(input)
            spy.verifyArgs([[expected]]);
        });
   });
}

function testFail() {
    testFunctionsFromInt.forEach(function(f) {
        testInts.forEach(function(input) {
            var bs = Bsync.bsync(function(a, passCb, failCb) {
                failCb(f(a));
            });
            var spy = jssert.spy();
            bs(input)(explode, spy);
            var expected = f(input)
            spy.verifyArgs([[expected]]);
        });
   });
}

function testBsyncConstantFail() {
    testInts.forEach(function(input) {
        var spy = jssert.spy();
        Bsync.constantFail("no dice")("ignored")(explode, spy);
        spy.verifyArgs([["no dice"]]);
    });
}