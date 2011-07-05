require("../../../include/include.js");

var fnNames = ["mapFail", "<!>"];

var testMapFailOnFail = forEach3_(testFunctionsFromInt, testInts, testValues, function(f, input, dummy) {
    fnNames.forEach(function(fnName) {
        var spy = jssert.spy();
        Bsync.constantFail(input)[fnName](f)(dummy)(explode, spy);
        spy.verifyArgs([[f(input)]]);
    });
});

var testMapFailOnPass = forEach3_(testInts, testValues, fnNames, function(input, dummy, fnName) {
    var spy = jssert.spy();
    Bsync.constant(input)[fnName](explode)(dummy)(spy, explode);
    spy.verifyArgs([[input]]);
});
