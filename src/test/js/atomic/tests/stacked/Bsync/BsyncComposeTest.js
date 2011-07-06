require("../../../include/include.js");

var sz = function(x) { return String(x); };

var testPassPass = forChainers2_(testInts, testFunctionsFromInt, function(input, f1, chainName, composeName) {
    var expected = sz(f1(input));
    var expectedArgs = [[expected]];
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
    check(Bsync.chainMany([Bsync.identity, p1b, szb, Bsync.constant(expected)]));
});

var testPassFail = forChainers3_(testValues, testValues, testFunctions, function(err, input, f, chainName, composeName) {
    var expectedArgs = [[err]];
    function check(q) {
        var spy = jssert.spy();
        q(input)(explode, spy);
        spy.verifyArgs(expectedArgs);
    }
    check(Bsync.sync(f)[chainName](Bsync.constantFail(err)));
    check(Bsync.chainMany([Bsync.sync(f), Bsync.constantFail(err)]));

    check(Bsync.identity[chainName](Bsync.sync(f))[chainName](Bsync.constantFail(err))[chainName](Bsync.sync(explode)));
    check(Bsync.chainMany([Bsync.identity, Bsync.sync(f), Bsync.constantFail(err), Bsync.sync(explode)]));

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
    check(Bsync.constant(2)[chainName](Bsync.constantFail(err))[chainName](Bsync.sync(explode)));
    check(Bsync.constantFail(err)[chainName](Bsync.constantFail(err))[chainName](Bsync.sync(explode))[chainName](Bsync.failDentity));

    check(Bsync.sync(explode)[composeName](Bsync.constantFail(err)));
    check(Bsync.sync(explode)[composeName](Bsync.constantFail(err))[composeName](Bsync.constant("aaaaaaaaaaaargh")));
});

var testComposeManyIdentity = forEach_(testValues, function(input) {
    var check = function(q) {
        var spy = jssert.spy();
        q(input)(spy, explode);
        spy.verifyArgs([[input]]);
    };

    for (var i = 0; i < 10; i++) {
        check(Bsync.composeMany(repeat(Bsync.identity, i)));
        check(Bsync.chainMany(repeat(Bsync.identity, i)));
    }
});
