require("../../../include/include.js");

var testPredicate = forEachWithSpy_(testInts, function(inputs_, spy) {
    var inputs = [1].concat(inputs_); // so there's always a fail

    var pred = gte2;
    var expected = sift(inputs, pred);

    var bs = Bsync.predicate(pred);
    bs.amap(inputs)(explode, spy);
    var actual = spy.getInvocationArgs()[0][0];
    assertArrayOfEitherEquals(expected, actual);
});