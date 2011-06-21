require("../include/include.js");

/* Note: these tests are actually synchronous, but still test the callback mechanism.
 * If we start bouncing the functions with setTimeout, these tests will break.
 * In this instance, perhaps mock out setTimeout, or use Java threading from Rhino.
 */

var testInvoke = function() {
    var spy = jssert.spy();
    sz(3)(spy);
    spy.verifyArgs([["3"]]);
};

var testCompose = function() {
    var spy = jssert.spy();
    var fn = (plus1) [">>>"] (sz);
    fn(3)(spy);
    spy.verifyArgs([["4"]]);
};

var testMapOut = function() {
    var check = function(fnName) {
        var spy = jssert.spy();
        var fn = plus1[fnName](function(a) { return a + 2; });
        fn(1)(spy);
        spy.verifyArgs([[4]]);
    };
    check("mapOut");
    check(">>^");
};

var testMapIn = function() {
    var check = function(fnName) {
        var spy = jssert.spy();
        var fn = plus1[fnName](function(a) { return Number(a); });
        fn("1")(spy);
        spy.verifyArgs([[2]]);
    };
    check("mapIn");
    check("<<^");
};
