require("../../../include/include.js");

var fnNames = ["mapFail", "<!>"];

var testMapFailOnFail = forEach3_(testFunctionsFromInt, testInts, testValues, function(f, input, dummy) {
    fnNames.forEach(function(fnName) {
        checkBfFail(Bsync.constantFail(input)[fnName](f)(dummy), f(input));
    });
    checkBfFail(Bsync.constantFail(input).mapFailAsync(Async.sync(f))(dummy), f(input));
});

var testMapFailOnPass = forEach2_(testInts, testValues, function(input, dummy) {
    fnNames.forEach(function(fnName) {
        checkBfPass(Bsync.constant(input)[fnName](explode)(dummy), input);
    });
    checkBfPass(Bsync.constant(input).mapFailAsync(Async.sync(explode))(dummy), input);
});
