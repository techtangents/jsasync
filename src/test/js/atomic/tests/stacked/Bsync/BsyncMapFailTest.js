require("../../../include/include.js");

var fnNames = ["mapFail", "<!>"];

var testMapFailOnFail = forEach3_(testFunctionsFromInt, testInts, testValues, function(f, input, dummy) {
    fnNames.forEach(function(fnName) {
        checkBfFail(Bsync.constantFail(input)[fnName](f)(dummy), f(input));
    });
});

var testMapFailOnPass = forEach3_(testInts, testValues, fnNames, function(input, dummy, fnName) {
    checkBfPass(Bsync.constant(input)[fnName](explode)(dummy), input);
});
