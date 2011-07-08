require("../../../include/include.js");

var test = forEach2WithSpy_(testInts, testInts, function(ignored, input, spy) {
    checkBfPass(Bsync.constant(input)(ignored), input);
    checkBfFail(Bsync.constantFail(input)(ignored), input);
});