require("../../../include/include.js");

var testBind = forEach2_(testInts, [">>=", "bind"], function(x, fnName) {
    checkF(plus1(x)[fnName](sz)[fnName](suffixQ), String(x + 1) + "q");
});

var testAnonBind = permute2_(testValues, function(x, y) {
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

var testMap = forEach2_(testInts, ["<$>", "map"], function(v, fnName) {
    checkF(Future.constant(v)[fnName](function(x) { return x + 2; }), v + 2);
});

var testConstant = forEach_(testInts, function(x) {
    checkF(Future.constant(x), x);
});
