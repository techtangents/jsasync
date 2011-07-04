require("../../../include/include.js");

var testParConstants = forEachWithSpy_(testArrays, function(input, spy) {
    var futures = input.map(Bfuture.constant);
    Bfuture.par(futures)(spy, explode);
    spy.verifyArgs([[input]]);
});

var testParConstantFails = forEachWithSpy_(testNonEmptyArrays, function(input, spy) {
    var futures = input.map(Bfuture.constantFail);
    Bfuture.par(futures)(explode, spy);
    var expected = input.map(Either.bad);
    assertArrayOfEitherEquals(expected, spy.getInvocationArgs()[0][0]);
});

