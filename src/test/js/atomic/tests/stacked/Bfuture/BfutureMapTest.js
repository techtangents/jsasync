require("../../../include/include.js");

var testMap = forEach2WithSpy_(testFunctionsFromInt, testInts, function(f, input, spy) {
    Bfuture.constant(input).map(f)(spy, explode);
    spy.verifyArgs([[f(input)]]);
});