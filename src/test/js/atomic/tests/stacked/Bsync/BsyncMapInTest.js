require("../../../include/include.js");

var test = forEach2_(testInts, testFunctionsFromInt, function(input, f) {
    function check(q, expected) {
        var spy = jssert.spy();
        q(spy, explode);
        spy.verifyArgs([[expected]]);
    }

    var id = function(x) { return x; };

    // input -> f -> identity = f(input)
    check(Bsync.identity.mapIn(f)(input), f(input));

    // input -> identity -> f = f(input)
    check(Bsync.sync(f).mapIn(id)(input), f(input));

    // input -> identity -> identity -> input
    check(Bsync.sync(id).mapIn(id)(input), input);

    // input -> f -> f -> f(f(input)
    check(Bsync.sync(f).mapIn(f)(input), f(f(input)));
});
