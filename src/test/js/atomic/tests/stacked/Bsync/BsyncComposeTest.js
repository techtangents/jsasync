require("../../../include/include.js");

var testPassPass = function() {

    testInts.forEach(function(input) {
        [[">>>", "<<<"], ["chain", "compose"]].forEach(function(fnNames) {
            var chainName = fnNames[0];
            var composeName = fnNames[1];

            var p1 = function(x) { return x + 1; };
            var sz = function(x) { return String(x); };

            var p1b = Bsync.sync(p1);
            var szb = Bsync.sync(sz);

            var expectedArgs = [[sz(p1(input))]]

            var spy1 = jssert.spy();
            szb[composeName](p1b)(input)(spy1, explode);
            spy1.verifyArgs(expectedArgs);

            var spy2 = jssert.spy();
            p1b[chainName](szb)(input)(spy2, explode);
            spy2.verifyArgs(expectedArgs);
        });
    });
};