require("../../../include/include.js");

var test = unitTest(function(Future, Async, Bfuture, Bsync) {

    forEach2(["bind", ">>="], testInts, function(fnName, input) {
        forEach(testFunctionsFromInt, function(f) {
            checkBfPass(Bfuture.constant(input)[fnName](Bsync.sync(f)), f(input));
        });

        checkBfFail(Bfuture.constantFail(input)[fnName](undefined), input);
        checkBfFail(Bfuture.constant(input)[fnName](Bsync.constantFail("no dice")), "no dice");
    });
});
