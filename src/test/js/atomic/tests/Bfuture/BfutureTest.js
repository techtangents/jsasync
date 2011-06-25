require("../../include/include.js");

function testBindPassPass() {
    forEach2WithSpy(testFnsFromInt, testInts, function(f, input, spy) {
        Bfuture.constant(input).bind(Bsync.sync(f))(spy, explode);
        var expected = f(input);
        spy.verifyArgs([[expected]]);
    });
}

function testBindFail() {
    forEachWithSpy(testInts, function(input, spy) {
        Bfuture.constantFail(input).bind(undefined)(explode, spy);
        spy.verifyArgs([[input]]);
    });
}

function testBindPassFail() {
    forEachWithSpy(testInts, function(input, spy) {
        Bfuture.constant(input).bind(Bsync.constantFail("no dice"))(explode, spy);
        spy.verifyArgs([["no dice"]]);
    });
}

function testConstantFail() {
    forEachWithSpy(testInts, function(input, spy) {
        Bfuture.constantFail(input)(explode, spy);
        spy.verifyArgs([[input]]);
    });
}