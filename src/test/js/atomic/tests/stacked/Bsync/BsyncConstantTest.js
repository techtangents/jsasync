require("../../../include/include.js");

var testBsyncConstant = forEach2WithSpy_(testInts, testInts, function(ignored, input, spy) {
    Bsync.constant(input)(ignored)(spy, explode);
    spy.verifyArgs([[input]]);
});

var testBsyncConstantFail = forEach2WithSpy_(testInts, testInts, function(ignored, input, spy) {
    Bsync.constantFail(input)(ignored)(explode, spy);
    spy.verifyArgs([[input]]);
});