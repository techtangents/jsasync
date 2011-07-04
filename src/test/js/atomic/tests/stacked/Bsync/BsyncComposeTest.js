require("../../../include/include.js");

var forChainers = function(f) {
    f(">>>", "<<<");
    f("chain", "compose");
};

var sz = function(x) { return String(x); };

var testPassPass = forEach2_(testInts, testFunctionsFromInt, function(input, f1) {
    var expectedArgs = [[sz(f1(input))]];
    forChainers(function(chainName, composeName) {
        var p1b = Bsync.sync(f1);
        var szb = Bsync.sync(sz);

        var check = function(q) {
            var spy = jssert.spy();
            q(input)(spy, explode);
            spy.verifyArgs(expectedArgs);
        };

        check(szb[composeName](p1b));
        check(p1b[chainName](szb));
    });
});

var testPassFail = forEach3_(testValues, testValues, testFunctions, function(err, input, f) {
    var expectedArgs = [[err]];
    forChainers(function(chainName, composeName) {
        function check(q) {
            var spy = jssert.spy();
            q(input)(explode, spy);
            spy.verifyArgs(expectedArgs);
        }
        check(Bsync.sync(f)[chainName](Bsync.constantFail(err)));
        check(Bsync.constantFail(err)[composeName](Bsync.sync(f)));
    });
});

var testFailFail = forEach2_(testValues, testValues, function(err, input) {
    var expectedArgs = [[err]];
    forChainers(function(chainName, composeName) {
        function check(q) {
            var spy = jssert.spy();
            q(input)(explode, spy);
            spy.verifyArgs(expectedArgs);
        }
        check(Bsync.constantFail(err)[chainName](Bsync.sync(explode)));
        check(Bsync.sync(explode)[composeName](Bsync.constantFail(err)));
    });
});
