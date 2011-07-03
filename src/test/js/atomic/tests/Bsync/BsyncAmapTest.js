require("../../include/include.js");

var testPass = forEach2WithSpy_(testFunctions, testArrays, function(f, inputs, spy) {
    var expected = inputs.map(f);
    var bs = Bsync.sync(f);
    bs.amap(inputs)(spy, explode);
    spy.verifyArgs([[expected]]);
});

var testFail = forEachWithSpy_(testInts, function(inputs_, spy) {
    var inputs = [1].concat(inputs_); // so there's always a fail

    var spy = jssert.spy();
    var pred = function(a) { return a >= 2; };

    var expected = inputs.map(function(a) {
        return (pred(a) ? Either.good : Either.bad)(a);
    });

    var check = function(bs) {
        bs.amap(inputs)(explode, spy);
        var actual = spy.getInvocationArgs()[0][0];
        assertArrayOfEitherEquals(expected, actual);
    };

    check(Bsync.bsync(function(a, passCb, failCb) {
         pred(a) ? passCb(a) : failCb(a);
    }));

    check(Bsync.predicate(pred));

});