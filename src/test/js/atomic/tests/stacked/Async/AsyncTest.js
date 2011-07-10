require("../../../include/include.js");

var test = unitTest(function(Future, Async, Bfuture, Bsync) {

    checkF(Async.sync(sz)(3), "3");

    checkF(Async.sync(plus1)[">>>"](Async.sync(sz))(3), "4");

    forEach(["map", ">>^", "<$>"], function(fnName) {
        checkF(Async.sync(plus1)[fnName](plus2)(1), 4);
    });

    forEach(["mapIn", "<<^"], function(fnName) {
        checkF(Async.sync(plus1)[fnName](toNum)("1"), 2);
    });

    permute2(testValues, function(c, ignored) {
        checkF(Async.constant(c)(ignored), c);
    });

    forEach2(testFunctions, testArrays, function(f, array) {
        checkF(Async.sync(f).amap(array), array.map(f));
    });
});