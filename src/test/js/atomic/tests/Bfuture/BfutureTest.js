require("../../include/include.js");

var testBindPassPass = forEach2WithSpy_(testFunctionsFromInt, testInts, function(f, input, spy) {
    Bfuture.constant(input).bind(Bsync.sync(f))(spy, explode);
    var expected = f(input);
    spy.verifyArgs([[expected]]);
});

var testBindFail = forEachWithSpy_(testInts, function(input, spy) {
    Bfuture.constantFail(input).bind(undefined)(explode, spy);
    spy.verifyArgs([[input]]);
});

var testBindPassFail = forEachWithSpy_(testInts, function(input, spy) {
    Bfuture.constant(input).bind(Bsync.constantFail("no dice"))(explode, spy);
    spy.verifyArgs([["no dice"]]);
});

var testConstantFail = forEachWithSpy_(testInts, function(input, spy) {
    Bfuture.constantFail(input)(explode, spy);
    spy.verifyArgs([[input]]);
});
