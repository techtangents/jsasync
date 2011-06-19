require("../include/include.js");

// TODO: this drives out a varargs bind, e.g. futureA.bindn(sz, suffixQ), or perhaps >>= could just take varargs?
var testBind = function() {
    var spy = jssert.spy();
    var futureA = plus1(5);
    var futureB = (futureA) [">>="] (sz) [">>="] (suffixQ);
    futureB(spy);
    spy.verifyArgs([["6q"]]);
};

var testMap = function() {
    var spy = jssert.spy();
    var futureA = Future.constant(3) ["<$>"] (function(x) { return x + 2; });
    futureA(spy);
    spy.verifyArgs([[5]]);
};