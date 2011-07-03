require("../../include/include.js");

var testPassPassSimple = forEach2WithSpy_(testValues, testValues, function(x, y, spy) {
    Bfuture.constant(x)[">>"](Bfuture.constant(y))(spy, explode);
    spy.verifyArgs([[y]]);
});

var testPassPass2 = function() {
    testValues.forEach(function(x) {
        var spy1 = jssert.spy();
        var spy2 = jssert.spy();
        Bfuture.bfuture(function(passCb, failCb) {
            spy1();
            passCb();
        })[">>"](Bfuture.constant(x))(spy2, explode);
        spy1.verifyArgs([[]]);
        spy2.verifyArgs([[x]]);
    });
};