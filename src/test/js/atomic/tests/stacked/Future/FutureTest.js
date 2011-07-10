require("../../../include/include.js");

var test = unitTest(function(Future, Async, Bfuture, Bsync) {

    permute2(testValues, function(x, y) {
        [">>", "bindAnon"].forEach(function(fnName) {
            var spy1 = jssert.spy();
            var spy2 = jssert.spy();

            var futureA = Future.future(function(callback) {
                spy1();
                callback(x);
            });
            var f = futureA[fnName](Future.constant(y))(spy2);

            waitForSpies([spy1, spy2]);

            jssert.assertEq(1, spy1.getInvocations().length);
            spy2.verifyArgs([[y]]);
        });
    });

    forEach2(testInts, [">>=", "bind"], function(x, fnName) {
        checkF(plus1(x)[fnName](sz)[fnName](suffixQ), String(x + 1) + "q");
    });

    forEach2(testInts, ["<$>", "map"], function(v, fnName) {
        checkF(Future.constant(v)[fnName](function(x) { return x + 2; }), v + 2);
    });

    forEach(testInts, function(x) {
        checkF(Future.constant(x), x);
    });
});
