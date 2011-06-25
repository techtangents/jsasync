require("../../include/include.js");

var testBind = function() {
    testInts.forEach(function(x) {
        withSpy(function(spy) {
            plus1(x) [">>="] (sz) [">>="] (suffixQ)(spy);
            spy.verifyArgs([[String(x + 1) + "q"]]);
        });
    });
};

var testAnonBind = function() {
    permute2(testValues, function(x, y) {
        var spy1 = jssert.spy();
        var spy2 = jssert.spy();

        var futureA = Future.future(function(callback) {
            spy1();
            callback(x);
        });
        var futureB = Future.constant(y);
        var f = (futureA) [">>"] (futureB);
        f(spy2);

        jssert.assertEq(1, spy1.getInvocations().length);
        spy2.verifyArgs([[y]]);
    });
};

var testMap = function() {
    testInts.forEach(function(v) {
        withSpy(function(spy) {
            Future.constant(v) ["<$>"] (function(x) { return x + 2; })(spy);
            spy.verifyArgs([[v + 2]]);
        });
    });
};

var testConstant = function() {
    testValues.forEach(function(x) {
        withSpy(function(spy) {
            Future.constant(x)(spy);
            spy.verifyArgs([[x]]);
        });
    });
};

