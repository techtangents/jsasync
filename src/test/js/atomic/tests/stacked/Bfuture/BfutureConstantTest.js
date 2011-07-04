require("../../../include/include.js");

var testConstant = forEachWithSpy_(testInts, function(input, spy) {
    Bfuture.constant(input)(spy, explode);
    spy.verifyArgs([[input]]);
});

var testConstantFail = forEachWithSpy_(testInts, function(input, spy) {
    Bfuture.constantFail(input)(explode, spy);
    spy.verifyArgs([[input]]);
});
