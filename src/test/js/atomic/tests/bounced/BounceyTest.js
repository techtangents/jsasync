require("../../include/include.js");

var bounceyFuture = techtangents.jsasync.api.bounced.Future;

function test() {

    [0, 1, 2, 10].forEach(function(num){
        var fs = [];
        var dones = [];
        var expected = [];

        var mk = function(i) {
            // 'sync' is a rhino function that gives you some java synchronization
            return bounceyFuture.future(sync(function(cb) {
                dones[i] = true;
                cb(i);
            }));
        };

        for (var i = 0; i < num; i++) {
            fs[i] = mk(i);
            expected[i] = i;
        }

        var actual;
        bounceyFuture.par(fs)(function(as) {
            actual = as;
        });

        waitFor(function() {
            for (var i = 0; i < num; i++) {
                if (!dones[i]) return false;
            }
            return true;
        });
        jssert.assertEq(expected, actual);

    });
}