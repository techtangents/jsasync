require("../../include/include.js");

var testConstantFail = forEachWithSpy_(testInts, function(input, spy) {
    Bfuture.constantFail(input)(explode, spy);
    spy.verifyArgs([[input]]);
});