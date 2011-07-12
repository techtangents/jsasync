require("../../../include/include.js");

var testParConstants = unitTest(function(Future, Async, Bfuture, Bsync) {
    forEach(testArrays, function(input) {
        checkBfPass(Bfuture.par(input.map(Bfuture.constant)), input);
    });
});

var testParConstantFails = forEachWithSpy_(testNonEmptyArrays, function(input, spy) {
    var futures = input.map(Bfuture.constantFail);
    Bfuture.par(futures)(explode, spy);
    var expected = input.map(Either.bad);
    assertArrayOfEitherEquals(expected, spy.getInvocationArgs()[0][0]);
});

