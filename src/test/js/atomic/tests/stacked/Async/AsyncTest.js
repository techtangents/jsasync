require("../../../include/include.js");

var test = unitTest(function(Future, Async, Bfuture, Bsync) {

    checkF(Async.sync(sz)(3), "3");

    forChainers(function(chainName, composeName) {
        // TODO: use a wider variety of test data
        checkF(Async.sync(plus1)[chainName](Async.sync(sz))(3), "4");
        checkF(Async.sync(sz)[composeName](Async.sync(plus1))(3), "4");
    });

    forEach(["map", ">>^", "<$>"], function(fnName) {
        checkF(Async.sync(plus1)[fnName](plus2)(1), 4);
    });

    forEach(["mapIn", "<<^"], function(fnName) {
        checkF(Async.sync(plus1)[fnName](toNum)("1"), 2);
    });
    
    permute2(testValues, function(c, ignored) {
        checkF(Async.constant(c)(ignored), c);
    });
});