require("../../../include/include.js");

var fnNames = ["map", ">>^", "<$>"];

var testMapPass = forEach3_(testFunctionsFromInt, testInts, testValues, function(f, input, dummy) {
    fnNames.forEach(function(fnName) {
        checkBfPass(Bsync.constant(input)[fnName](f)(dummy), f(input));
    });
});

var testMapFail = forEach3_(testInts, testValues, fnNames, function(input, dummy, fnName) {
    checkBfFail(Bsync.constantFail(input)[fnName](explode)(dummy), input);
});
