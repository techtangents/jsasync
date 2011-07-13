require("../../../include/include.js");

var test = unitTest(function(Future, Async, Bfuture, Bsync) {
    forChainers(function(chainName, composeName) {
        forEach2(testFunctionsFromInt, testInts, function(f, input) {
            var af = Async.sync(f);
            var asz = Async.sync(sz);
            var expected = sz(f(input));
            checkF(af[chainName](asz)(input), expected);
            checkF(asz[composeName](af)(input), expected);
        });
    });
});