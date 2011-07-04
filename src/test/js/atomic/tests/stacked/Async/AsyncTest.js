require("../../../include/include.js");

/* Note: these tests are actually synchronous, but still test the callback mechanism.
 * If we start bouncing the functions with setTimeout, these tests will break.
 * In this instance, perhaps mock out setTimeout, or use Java threading from Rhino.
 */

var testInvoke = withSpy_(function(spy) {
    sz(3)(spy);
    spy.verifyArgs([["3"]]);
});

var testCompose = withSpy_(function(spy) {
    plus1[">>>"](sz)(3)(spy);
    spy.verifyArgs([["4"]]);
});

var testMap = forEachWithSpy_(["map", ">>^", "<$>"], function(fnName, spy) {
    plus1[fnName](function(a) { return a + 2; })(1)(spy);
    spy.verifyArgs([[4]]);
});

var testMapIn = forEachWithSpy_(["mapIn", "<<^"], function(fnName, spy) {
    plus1[fnName](function(a) { return Number(a); })("1")(spy);
    spy.verifyArgs([[2]]);
});

var testConstant = permute2_(testValues, function(c, ignored) {
    withSpy(function(spy) {
        Async.constant(c)(ignored)(spy);
        spy.verifyArgs([[c]]);
    });
});

var testAmap = forEach2WithSpy_(testFunctions, testArrays, function(f, array, spy) {
    Async.sync(f).amap(array)(spy);
    spy.verifyArgs([[array.map(f)]]);
});
