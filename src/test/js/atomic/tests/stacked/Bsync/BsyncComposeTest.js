require("../../../include/include.js");

var forChainers = function(f) {
    f(">>>", "<<<");
    f("chain", "compose");
};

var p1 = function(x) { return x + 1; };
var sz = function(x) { return String(x); };

var testPassPass = function() {
    testInts.forEach(function(input) {
        var expectedArgs = [[sz(p1(input))]];
        forChainers(function(chainName, composeName) {
            var p1b = Bsync.sync(p1);
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
};

var testPassFail = function() {
    forEach3(testValues, testValues, testFunctions, function(err, input, f) {
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
};
