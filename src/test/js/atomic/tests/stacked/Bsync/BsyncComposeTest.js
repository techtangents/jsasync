require("../../../include/include.js");

var sz = function(x) { return String(x); };

var testPassPass = forChainers2_(testInts, testFunctionsFromInt, function(input, f1, chainName, composeName) {
    var expectedArgs = [[sz(f1(input))]];
    var p1b = Bsync.sync(f1);
    var szb = Bsync.sync(sz);

    var check = function(q) {
        var spy = jssert.spy();
        q(input)(spy, explode);
        spy.verifyArgs(expectedArgs);
    };

    check(szb[composeName](p1b));
    check(Bsync.identity[composeName](szb)[composeName](p1b));
    check(szb[composeName](p1b)[composeName](Bsync.identity));

    check(Bsync.composeMany([szb, p1b]));
    check(Bsync.composeMany([szb, p1b, Bsync.identity]));
    check(Bsync.composeMany([Bsync.identity, szb, p1b, Bsync.identity]));
    check(Bsync.composeMany([Bsync.identity, szb, Bsync.identity, p1b, Bsync.identity]));

    check(p1b[chainName](szb));
    check(p1b[chainName](szb)[chainName](Bsync.identity));
    check(Bsync.identity[chainName](p1b)[chainName](szb)[chainName](Bsync.identity));

    check(Bsync.chainMany([p1b, szb]));
    check(Bsync.chainMany([p1b, szb, Bsync.identity]));
    check(Bsync.chainMany([p1b, Bsync.identity, szb, Bsync.identity]));
    check(Bsync.chainMany([Bsync.identity, p1b, Bsync.identity, szb, Bsync.identity]));
    check(Bsync.chainMany([Bsync.identity, p1b, szb]));
});

var testPassFail = forChainers3_(testValues, testValues, testFunctions, function(err, input, f, chainName, composeName) {
    var expectedArgs = [[err]];
    function check(q) {
        var spy = jssert.spy();
        q(input)(explode, spy);
        spy.verifyArgs(expectedArgs);
    }
    check(Bsync.sync(f)[chainName](Bsync.constantFail(err)));
    check(Bsync.constantFail(err)[composeName](Bsync.sync(f)));
});

var testFailFail = forChainers2_(testValues, testValues, function(err, input, chainName, composeName) {
    var expectedArgs = [[err]];
    function check(q) {
        var spy = jssert.spy();
        q(input)(explode, spy);
        spy.verifyArgs(expectedArgs);
    }
    check(Bsync.constantFail(err)[chainName](Bsync.sync(explode)));
    check(Bsync.sync(explode)[composeName](Bsync.constantFail(err)));
});
