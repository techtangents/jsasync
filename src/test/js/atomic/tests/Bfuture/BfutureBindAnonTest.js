require("../../include/include.js");

var testPassPassSimple = forEach2WithSpy_(testValues, testValues, function(x, y, spy) {
    Bfuture.constant(x)[">>"](Bfuture.constant(y))(spy, explode);
    spy.verifyArgs([[y]]);
});