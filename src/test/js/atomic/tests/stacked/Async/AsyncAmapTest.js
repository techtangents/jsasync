require("../../../include/include.js");

var test = unitTest(function(Future, Async, Bfuture, Bsync) {
    // crank this up if you want to test Rhino syncing
    for (var i = 0; i < 10; i++) {
        forEach2(testFunctions, testArrays, function(f, array) {
            checkF(Async.sync(f).amap(array), array.map(f));
        });
    };
});