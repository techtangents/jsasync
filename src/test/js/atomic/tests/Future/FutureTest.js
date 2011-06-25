require("../../include/include.js");

var testBind = forEachWithSpy_(testInts, function(x, spy) {
    plus1(x) [">>="] (sz) [">>="] (suffixQ)(spy);
    spy.verifyArgs([[String(x + 1) + "q"]]);
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

var testMap = forEachWithSpy_(testInts, function(v, spy) {
    Future.constant(v) ["<$>"] (function(x) { return x + 2; })(spy);
    spy.verifyArgs([[v + 2]]);
});

var testConstant = forEachWithSpy_(testInts, function(x, spy) {
    Future.constant(x)(spy);
    spy.verifyArgs([[x]]);
});

