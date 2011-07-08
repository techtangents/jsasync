require("../../../include/include.js");

var testPass = forEach2WithSpy_(testFunctions, testArrays, function(f, inputs, spy) {
    var expected = inputs.map(f);
    checkBfPass(Bsync.sync(f).amap(inputs), expected);
});

var testFail = forEachWithSpy_(testValues, function(inputs_, spy) {
    var inputs = [1].concat(inputs_); // so there's always a fail
    var pred = gte2;

    var expected = sift(inputs, pred);

    var bs = Bsync.bsync(function(a, passCb, failCb) {
         pred(a) ? passCb(a) : failCb(a);
    });

    bs.amap(inputs)(explode, spy);
    var actual = spy.getInvocationArgs()[0][0];
    assertArrayOfEitherEquals(expected, actual);
});