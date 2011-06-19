require("../include/include.js");

// TODO: this drives out a varargs bind, e.g. futureA.bindn(sz, suffixQ), or perhaps >>= could just take varargs?
var testBind = function() {
    var spy = jssert.spy();
    var futureA = plus1(5);
    var futureB = (futureA) [">>="] (sz) [">>="] (suffixQ);
    futureB(spy);
    spy.verifyArgs([["6q"]]);
};

var testAnonBind = function() {
    var spy1 = jssert.spy();
    var spy2 = jssert.spy();

    var futureA = Future.future(function(callback) {
        spy1();
        callback(3);
    });
    var futureB = Future.constant(4);
    var f = (futureA) [">>"] (futureB);
    f(spy2);

    jssert.assertEq(1, spy1.getInvocations().length);
    spy2.verifyArgs([[4]]);
};

var testMap = function() {
    var spy = jssert.spy();
    var futureA = Future.constant(3) ["<$>"] (function(x) { return x + 2; });
    futureA(spy);
    spy.verifyArgs([[5]]);
};
