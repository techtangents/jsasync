require("../../../include/include.js");

var test = unitTest(function(Future, Async, Bfuture, Bsync) {
    forEach2WithSpy(testFunctions, testArrays, function(f, inputs, spy) {
        checkBfPass(Bsync.sync(f).amap(inputs), inputs.map(f));
    });

    forEachWithSpy(testValues, function(inputs_, spy) {
        var inputs = [1].concat(inputs_); // so there's always a fail
        var pred = gte2;

        var expected = sift(inputs, pred);

        var bs = Bsync.bsync(function(a, passCb, failCb) {
             pred(a) ? passCb(a) : failCb(a);
        });

        bs.amap(inputs)(explode, spy);
        waitForSpy(spy);
        var actual = spy.getInvocationArgs()[0][0];
        assertArrayOfEitherEquals(expected, actual);
    });
});