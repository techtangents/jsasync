require("../../../include/include.js");

var test = unitTest(function(Future, Async, Bfuture, Bsync) {
    testArrays.forEach(function(array) {
        var futures = array.map(Future.constant);
        checkF(Future.par(futures), array);
    });
});
