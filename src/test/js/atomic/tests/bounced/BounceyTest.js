require("../../include/include.js");

function test() {

    [0, 1, 2, 10].forEach(function(num){
        var fs = [];
        var expected = [];

        var mk = function(i) {
            // 'sync' is a rhino function that gives you some java synchronization
            return bounced.Future.future(sync(function(cb) {
                cb(i);
            }));
        };

        for (var i = 0; i < num; i++) {
            fs[i] = mk(i);
            expected[i] = i;
        }

        var actual;
        bounced.Future.par(fs)(function(as) {
            actual = as;
        });

        waitFor(function() {
            return actual !== undefined;
        });
        jssert.assertEq(expected, actual);
    });
}