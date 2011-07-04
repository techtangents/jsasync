require("../../../include/include.js");

var testBindPassPass = forEach2WithSpy_(testFunctionsFromInt, testInts, function(f, input, spy) {
    Bfuture.constant(input).bind(Bsync.sync(f))(spy, explode);
    var expected = f(input);
    spy.verifyArgs([[expected]]);
});

var testBindFail = forEach2WithSpy_(["bind", ">>="], testInts, function(fnName, input, spy) {
    Bfuture.constantFail(input)[fnName](undefined)(explode, spy);
    spy.verifyArgs([[input]]);
});

var testBindPassFail = forEach2WithSpy_(["bind", ">>="], testInts, function(fnName, input, spy) {
    Bfuture.constant(input)[fnName](Bsync.constantFail("no dice"))(explode, spy);
    spy.verifyArgs([["no dice"]]);
});

