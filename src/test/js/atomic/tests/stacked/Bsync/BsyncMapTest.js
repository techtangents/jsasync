require("../../../include/include.js");

var fnNames = ["map", ">>^", "<$>"];

var testMapPass = forEach3_(testFunctionsFromInt, testInts, testValues, function(f, input, dummy) {
    var expected = f(input);
    fnNames.forEach(function(fnName) {
        checkBfPass(Bsync.constant(input)[fnName](f)(dummy), expected);
    });
    checkBfPass(Bsync.constant(input).mapAsync(Bsync.sync(f))(dummy), expected);
    checkBfPass(Bsync.constant(input).biMapAsync(Async.sync(f))(dummy), expected);
});

var testMapFail = forEach2_(testInts, testValues, function(input, dummy) {
    fnNames.forEach(function(fnName) {
        checkBfFail(Bsync.constantFail(input)[fnName](explode)(dummy), input);
    });
    checkBfFail(Bsync.constantFail(input).mapAsync(Async.sync(explode))(dummy), input);

    forEach(testFunctionsFromInt, function(f) {
        checkBfFail(Bsync.constantFail(input).biMapAsync(Async.sync(f))(dummy), f(input));
    });
});
