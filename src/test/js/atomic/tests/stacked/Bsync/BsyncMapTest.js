require("../../../include/include.js");

var fnNames = ["map", ">>^", "<$>"];

var testMapPass = forEach3_(testFunctionsFromInt, testInts, testValues, function(f, input, dummy) {
    fnNames.forEach(function(fnName) {
        var spy = jssert.spy();
        Bsync.constant(input)[fnName](f)(dummy)(spy, explode);
        spy.verifyArgs([[f(input)]]);
    });
});

var testMapFail = forEach3_(testInts, testValues, fnNames, function(input, dummy, fnName) {
    var spy = jssert.spy();
    Bsync.constantFail(input)[fnName](explode)(dummy)(explode, spy);
    spy.verifyArgs([[input]]);
});
