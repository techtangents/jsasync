require("../../include/include.js");

/* Note: these tests are actually synchronous, but still test the callback mechanism.
 * If we start bouncing the functions with setTimeout, these tests will break.
 * In this instance, perhaps mock out setTimeout, or use Java threading from Rhino.
 */

var testInvoke = testWithSpy(function() {
    return sz(3);
}, [["3"]]);

var testCompose = testWithSpy(function() {
    return plus1[">>>"](sz)(3);
}, [["4"]]);

var testMapOut = function() {
    var check = function(fnName) {
        withSpy(function() {
            return plus1[fnName](function(a) { return a + 2; })(1);
        }, [[4]]);
    };
    check("mapOut");
    check(">>^");
};

var testMapIn = function() {
    var check = function(fnName) {
        withSpy(function() {
            return plus1[fnName](function(a) { return Number(a); })("1");
        }, [[2]]);
    };
    check("mapIn");
    check("<<^");
};

var testConstant = function() {
    permute2(testValues, function(c, ignored) {
        withSpy(function() {
            return Async.constant(c)(ignored);
        }, [[c]]);
    });
};

var testAmap = function() {
    var fns = [
        function(x) { return x; },
        function(x) { return 2; },
        function(x) { return [x]; },
        function(x) { return {a: x, b: [x]}; }
    ];

    fns.forEach(function(f) {
        testArrays.forEach(function(array) {
            withSpy(function() {
                return Async.sync(f).amap(array);
            }, [[array.map(f)]]);
        });
    });
};
