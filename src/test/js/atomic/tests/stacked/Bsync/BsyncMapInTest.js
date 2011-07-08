require("../../../include/include.js");

var test = forEach2_(testInts, testFunctionsFromInt, function(input, f) {

    var id = function(x) { return x; };

    // input -> f -> identity = f(input)
    checkBfPass(Bsync.identity.mapIn(f)(input), f(input));
    checkBfPass(Bsync.identity.mapInAsync(Async.sync(f))(input), f(input));

    // input -> identity -> f = f(input)
    checkBfPass(Bsync.sync(f).mapIn(id)(input), f(input));
    checkBfPass(Bsync.sync(f).mapInAsync(Async.sync(id))(input), f(input));

    // input -> identity -> identity -> input
    checkBfPass(Bsync.sync(id).mapIn(id)(input), input);
    checkBfPass(Bsync.sync(id).mapInAsync(Async.sync(id))(input), input);

    // input -> f -> f -> f(f(input)
    checkBfPass(Bsync.sync(f).mapIn(f)(input), f(f(input)));
    checkBfPass(Bsync.sync(f).mapInAsync(Async.sync(f))(input), f(f(input)));
});
