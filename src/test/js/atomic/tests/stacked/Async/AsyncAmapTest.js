require("../../../include/include.js");

var test = unitTest(function(Future, Async, Bfuture, Bsync) {
    forEach2(testFunctions, testArrays, function(f, array) {
        checkF(Async.sync(f).amap(array), array.map(f));
    });
});