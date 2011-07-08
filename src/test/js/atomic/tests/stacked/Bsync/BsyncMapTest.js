require("../../../include/include.js");

var fnNames = ["map", ">>^", "<$>"];

var testMapPass = forEach3_(testFunctionsFromInt, testInts, testValues, function(f, input, dummy) {
    fnNames.forEach(function(fnName) {
        checkBfPass(Bsync.constant(input)[fnName](f)(dummy), f(input));
    });
    checkBfPass(Bsync.constant(input).mapAsync(Bsync.sync(f))(dummy), f(input));
});

var testMapFail = forEach2_(testInts, testValues, function(input, dummy) {
    fnNames.forEach(function(fnName) {
        checkBfFail(Bsync.constantFail(input)[fnName](explode)(dummy), input);
    });
    checkBfFail(Bsync.constantFail(input).mapAsync(Async.sync(explode))(dummy), input);
});
