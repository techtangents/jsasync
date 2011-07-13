require("../../../include/include.js");

var test = unitTest(function(Future, Async, Bfuture, Bsync) {
    forEach2(testFunctionsFromInt, testInts, function(f, input) {
        var af = Async.sync(f);
        var asz = Async.sync(sz);
        var expected = sz(f(input));

        forChainers(function(chainName, composeName) {
            checkF(af[chainName](asz)(input), expected);
            checkF(asz[composeName](af)(input), expected);
        });

        checkF(Async.chainMany([af, asz])(input), expected);
        checkF(Async.composeMany([asz, af])(input), expected);
    });
});